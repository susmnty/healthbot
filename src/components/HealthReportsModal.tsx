// src/components/HealthReportsModal.tsx
import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { X, FileText, Upload, Loader, Sparkles, Volume2, VolumeX } from 'lucide-react';

// This is the correct address for your running Python backend
const API_BASE_URL = 'http://127.0.0.1:5000'; 
const api = axios.create({ baseURL: API_BASE_URL });

// --- Type Definitions ---
interface HealthReport { 
  id: number; 
  file_name: string; 
  report_type: string; 
}

interface HealthReportsModalProps { 
  isOpen: boolean; 
  onClose: () => void; 
}

// --- Main React Component ---
const HealthReportsModal: React.FC<HealthReportsModalProps> = ({ isOpen, onClose }) => {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('');
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [analyzingReport, setAnalyzingReport] = useState<HealthReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Reset the state of the modal whenever it is opened
  useEffect(() => {
    if (isOpen) {
      setReports([]);
      setAnalyzingReport(null);
      setAnalysisResult(null);
      setFormMessage(null);
      setSelectedFile(null);
      setReportType('');
    } else {
      // Stop any speech synthesis if the modal is closed
      if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  // Function to handle the file upload to the backend
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !reportType) {
        setFormMessage({ type: 'error', text: 'Please select a file and report type.' });
        return;
    }
    setUploading(true);
    setFormMessage(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // This sends the file to your Python "/upload" endpoint
      const response = await api.post('/upload', formData); 
      
      const newReport: HealthReport = { id: Date.now(), file_name: selectedFile.name, report_type: reportType };
      setReports([newReport]); // Replace old reports with the new one
      setFormMessage({ type: 'success', text: response.data.message });
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      setFormMessage({ type: 'error', text: err.response?.data?.error || 'Upload failed. Is the backend running correctly?' });
    } finally {
      setUploading(false);
    }
  };

  // Function to handle sending a question to the backend
  const handleQuerySubmit = async () => {
    if (!analysisQuery.trim()) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    if (isSpeaking) window.speechSynthesis.cancel();
    
    try {
      // This sends the question to your Python "/query" endpoint
      const response = await api.post('/query', { query: analysisQuery }); 
      setAnalysisResult(response.data.response);
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      setAnalysisResult(err.response?.data?.error || "Error during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeak = (text: string | null) => {
    if (!text || !('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text.replace(/###|\*/g, ''));
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };
  
  // A safe way to render the AI's response and prevent crashes
  const renderAnalysisResult = () => {
    if (isAnalyzing) {
      return <div className="text-center p-4"><Loader className="w-6 h-6 animate-spin mx-auto text-blue-600" /></div>;
    }
    if (typeof analysisResult === 'string' && analysisResult) {
      return (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <h6 className="font-bold text-gray-800">AI Analysis</h6>
            <button onClick={() => handleSpeak(analysisResult)} title={isSpeaking ? "Stop" : "Read Aloud"} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full">{isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}</button>
          </div>
          <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">{analysisResult}</div>
        </div>
      );
    }
    return null; // Render nothing if there's no result, preventing errors
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center space-x-3"><div className="bg-gradient-to-r from-pink-500 to-pink-600 p-2 rounded-lg"><FileText className="w-6 h-6 text-white" /></div><div><h2 className="text-xl font-bold">Health Reports Analyzer</h2><p className="text-sm text-gray-600">Powered by AI</p></div></div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6 text-gray-600" /></button>
        </div>
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
            <h3 className="text-lg font-semibold mb-4 flex items-center"><Upload className="w-5 h-5 mr-2" /> Upload Report</h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium">Report Type *</label><select value={reportType} onChange={(e) => setReportType(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-lg" required><option value="">Select...</option><option value="Blood Test">Blood Test</option><option value="X-Ray">X-Ray</option><option value="Other">Other</option></select></div>
                <div><label className="block text-sm font-medium">File (PDF only) *</label><input id="file-upload" type="file" accept=".pdf" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="w-full text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100" required/></div>
              </div>
              <button type="submit" disabled={uploading} className="px-6 py-2 bg-pink-600 text-white rounded-lg disabled:opacity-50">{uploading ? 'Processing...' : 'Upload & Process'}</button>
            </form>
          </div>
          {formMessage && (<div className={`p-3 rounded-lg text-center mb-4 ${formMessage.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{formMessage.text}</div>)}
          {reports.length > 0 && reports.map((report) => (
            <div key={report.id} className="bg-white border rounded-lg p-4">
              <div><h4 className="font-semibold">{report.report_type}</h4><p className="text-sm text-gray-500">{report.file_name}</p></div>
              <div className="mt-4 pt-4 border-t">
                <h5 className="font-semibold text-gray-800 mb-2">Ask HealthBot about this report</h5>
                <div className="flex gap-2"><input type="text" value={analysisQuery} onChange={(e) => setAnalysisQuery(e.target.value)} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g., What are the key findings?"/><button onClick={handleQuerySubmit} disabled={isAnalyzing} className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:opacity-50">{isAnalyzing ? <Loader className="w-5 h-5 animate-spin" /> : 'Ask'}</button></div>
                {renderAnalysisResult()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthReportsModal;