import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.schema.runnable import RunnablePassthrough
from langchain.schema import StrOutputParser
from langchain.prompts import ChatPromptTemplate
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
# This allows your React app to make requests to this server
CORS(app)

# --- Global variable to hold the retrieval chain ---
retrieval_chain = None

def get_pdf_text(pdf_docs):
    """Extracts text from a list of PDF documents."""
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(pdf)
        for page in pdf_reader.pages:
            extracted = page.extract_text()
            if extracted:
                text += extracted
    return text

def get_text_chunks(text):
    """Splits text into manageable chunks for processing."""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    return text_splitter.split_text(text)

@app.route('/upload', methods=['POST'])
def upload_file():
    global retrieval_chain
    if 'file' not in request.files:
        return jsonify({'error': 'No file selected'}), 400
    
    file = request.files['file']
    try:
        raw_text = get_pdf_text([file])
        if not raw_text:
            return jsonify({'error': 'Could not extract text from the PDF.'}), 400
        
        text_chunks = get_text_chunks(raw_text)
        
        # Initialize embeddings and vector store
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            return jsonify({'error': 'OPENROUTER_API_KEY not found in environment variables.'}), 500
            
        embeddings = OpenAIEmbeddings(
            openai_api_base="https://openrouter.ai/api/v1",
            openai_api_key=api_key
        )
        vectorstore = Chroma.from_texts(texts=text_chunks, embedding=embeddings)
        retriever = vectorstore.as_retriever()

        # Initialize the Language Model
        llm = ChatOpenAI(
            model_name="mistralai/mistral-7b-instruct:free",
            openai_api_base="https://openrouter.ai/api/v1",
            openai_api_key=api_key,
            temperature=0.7
        )

        # Create a new, more stable prompt template
        template = """
        You are an expert medical report analyzer named HealthBot.
        Answer the following question based only on the provided context.
        If you don't know the answer, just say that you don't know. Do not make up an answer.
        Structure your answers clearly using headings, bullet points, and bold text.

        CONTEXT: {context}

        QUESTION: {question}

        ANSWER:
        """
        prompt = ChatPromptTemplate.from_template(template)

        # Manually build the chain to avoid the bug
        retrieval_chain = (
            {"context": retriever, "question": RunnablePassthrough()}
            | prompt
            | llm
            | StrOutputParser()
        )
        
        return jsonify({'message': 'Report processed successfully. You can now ask questions.'}), 200
    except Exception as e:
        # Provide a more specific error message
        return jsonify({'error': f'Backend error during upload: {str(e)}'}), 500

@app.route('/query', methods=['POST'])
def query():
    global retrieval_chain
    data = request.get_json()
    user_question = data.get('query')

    if not user_question:
        return jsonify({'error': 'No query was provided.'}), 400
    if not retrieval_chain:
        return jsonify({'error': 'Please upload a file first.'}), 400

    try:
        # Invoke the manually constructed chain
        answer = retrieval_chain.invoke(user_question)
        return jsonify({'response': answer}), 200
    except Exception as e:
        return jsonify({'error': f'Backend error during query: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)