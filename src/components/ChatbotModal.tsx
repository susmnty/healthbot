import React, { useState } from 'react';
import { X, MessageCircle, Upload, Loader } from 'lucide-react';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// A complete knowledge base derived from all your uploaded CSV files
const knowledgeBase: { [key: string]: string } = {
  // Common Medical Queries
  "what should i do if i have a sore throat": "Gargle with warm salt water, stay hydrated, and avoid irritants like smoke.",
  "how can i reduce a fever at home": "Rest, drink fluids, and use a cool compress; over-the-counter fever reducers may help.",
  "what are natural remedies for headaches": "Try resting in a dark room, staying hydrated, and applying a cold or warm compress.",
  "how can i boost my energy naturally": "Get enough sleep, stay hydrated, eat balanced meals, and exercise regularly.",
  "what are some ways to improve digestion": "Eat high-fiber foods, stay hydrated, avoid overeating, and exercise.",
  "how to treat mild back pain at home": "Rest, use a heating pad, stretch gently, and avoid heavy lifting.",
  "what are ways to relieve constipation": "Drink plenty of water, eat fiber-rich foods, and consider a gentle laxative if needed.",
  "how do i treat dry skin": "Moisturize regularly, avoid hot showers, and use gentle, hydrating soaps.",
  "what are ways to manage seasonal allergies": "Limit exposure to allergens, keep windows closed, and consider antihistamines.",
  "how can i relieve stress quickly": "Try deep breathing, stretching, or taking a brief walk to clear your mind.",
  "what is good for sore muscles": "Use ice or heat, rest the area, and consider gentle stretching and massage.",
  "how do i improve sleep quality": "Maintain a consistent schedule, limit caffeine, and avoid screens before bed.",
  "what can i do for sinus congestion": "Try steam inhalation, a saline spray, or a warm compress on your sinuses.",
  "how to handle acid reflux": "Avoid heavy meals, stay upright after eating, and limit spicy or acidic foods.",
  "how can i reduce bloating": "Drink water, avoid carbonated drinks, eat slowly, and consider a mild probiotic.",
  "what are ways to boost the immune system": "Eat a balanced diet, get enough sleep, exercise, and manage stress.",
  "how to manage mild nausea": "Sip clear fluids, rest, avoid strong odors, and try ginger or mint.",
  "what are tips for healthy skin": "Stay hydrated, eat nutritious foods, protect skin from the sun, and use moisturizer.",
  "how to protect my hair from damage": "Limit heat styling, use a gentle shampoo, and avoid tight hairstyles.",
  "how can i reduce joint pain": "Stay active, maintain a healthy weight, and consider over-the-counter pain relief if needed.",
  "what can i do for mild toothache": "Rinse with warm salt water, use a cold compress, and avoid chewing on the affected side.",
  "how to handle mild anxiety": "Practice deep breathing, mindfulness exercises, or talk to someone you trust.",
  "how to treat minor cuts and scrapes": "Clean the area with water, apply an antiseptic, and cover with a clean bandage.",
  "what can i do for itchy skin": "Apply a cold compress, use hydrating lotion, and avoid hot showers.",
  "how to relieve ear pressure": "Try swallowing, yawning, or using a warm compress on the affected ear.",
  "what can help reduce blood pressure": "Eat less salt, exercise regularly, manage stress, and avoid excessive alcohol.",
  "how can i keep my eyes healthy": "Take breaks from screens, eat vitamin-rich foods, and wear sunglasses outdoors.",
  "what is the best way to quit smoking": "Set a quit date, avoid triggers, try nicotine replacement, and seek support if needed.",
  "how do i care for a sprained ankle": "Rest, ice, compress, and elevate the ankle for 24-48 hours.",

  // Emergency
  "what should i do in a medical emergency": "Call emergency contacts and share your location with the nearest hospital.",
  "how can i send an alert for help": "Automatically send an SOS message with location to your emergency contacts.",
  "can this chatbot call for an ambulance": "Initiate contact with the nearest ambulance service by sharing your location.",
  "how do i add an emergency contact": "Guide users on setting up emergency contacts in the chatbot.",
  "how do i activate location sharing in an emergency": "Enable automatic location sharing with emergency contacts during emergencies.",
  "what happens when i press the emergency button": "Triggers an automated call to emergency contacts and sends location to hospitals.",
  "how can i notify family in an emergency": "An automated message is sent to all saved emergency contacts with live location.",
  "can i contact nearby hospitals directly": "Share the nearest hospitals' contact information and allow a direct call option.",
  "how do i turn off emergency notifications": "Instructions to disable emergency mode when it’s not needed.",
  "can i send my live location to contacts": "Send live location to saved contacts in case of an emergency.",
  "what do i do if i feel unwell suddenly": "Use the emergency call button to alert family and send location to medical services.",
  "how do i notify emergency services automatically": "Sends an alert message with location to emergency contacts and nearby hospitals.",
  "how can i get help quickly if i’m alone": "Triggers an emergency alert to contacts and hospitals with your location.",
  "how do i add more contacts for emergencies": "Allows users to add additional contacts who will receive alerts in emergencies.",
  "can the chatbot track my location during emergencies": "Shares real-time location updates with emergency responders and contacts.",
  "how do i set the chatbot to send alerts": "Set an option to automatically notify contacts if an emergency condition is detected.",
  "what is the fastest way to get an ambulance": "Sends location to the nearest hospital to dispatch an ambulance.",
  "how to set up live location sharing": "Guide to enable live location sharing during an emergency.",
  "what do i do if someone has a heart attack": "Automatically contact emergency services and notify family with the patient’s location.",
  "can i request medical help from the chatbot": "Alerts emergency responders by sending live location for faster assistance.",
  "how can i stop emergency location sharing": "Instructions to deactivate location sharing when emergency mode is turned off.",
  "how do i activate emergency mode": "Enables automatic notifications and location sharing in case of a critical situation.",
  "what happens if i don’t respond in an emergency": "Sends alerts to contacts and nearby hospitals with your last known location.",
  "can the chatbot connect to nearby clinics": "Sends location to nearby clinics for emergency assistance.",
  "how to disable emergency mode after reaching safety": "Steps to deactivate emergency mode and stop notifications.",
  "how to activate sos alert in case of danger": "Initiates an SOS alert with location sent to contacts and hospitals.",
  "can i send a live location update continuously": "Shares continuous location updates with emergency contacts until deactivated.",
  "how do i notify the police in an emergency": "Sends a location alert to both medical services and law enforcement if needed.",
  "how to contact an emergency room quickly": "Sends location and medical details to the nearest emergency room for quicker response.",

  // Health Monitor
  "how can i monitor my blood pressure": "Use a home blood pressure monitor, or visit a clinic for regular checks.",
  "how often should i check my blood sugar levels": "Diabetics should check as per doctor’s advice; general checks can be done annually.",
  "what is a normal resting heart rate": "For adults, a normal range is 60-100 beats per minute.",
  "how can i keep track of my weight": "Regularly use a scale and track changes weekly or monthly.",
  "how can i monitor my hydration levels": "Drink water regularly and check your urine color; light yellow indicates good hydration.",
  "what’s a healthy oxygen saturation level": "A normal SpO2 is generally 95-100%; consult a doctor if it's consistently below this.",
  "how can i track my cholesterol levels": "Get regular blood tests as recommended by your healthcare provider.",
  "how to monitor my sleep quality": "Track sleep patterns with a sleep monitor or an app for insights on duration and quality.",
  "how often should i monitor my bmi": "Every few months or as recommended by your healthcare provider.",
  "how do i monitor my calorie intake": "Use a food-tracking app to monitor daily calorie intake and nutritional balance.",
  "how often should i check my heart rate during exercise": "Check periodically to ensure you stay within your target heart rate range.",
  "how to monitor hydration during exercise": "Drink water before, during, and after physical activity based on exertion level.",
  "how can i keep track of my physical activity": "Use a fitness tracker or app to log daily steps, exercise, and activity duration.",
  "how do i check my respiratory rate": "Count breaths per minute when resting; a normal range is 12-20 breaths per minute.",
  "how often should i test my vitamin d levels": "Annual tests are recommended, especially if you have limited sun exposure.",
  "how to monitor my dietary fiber intake": "Track your food intake using an app or nutrition guide to meet daily fiber recommendations.",
  "how can i check my hemoglobin levels": "A blood test at a clinic is the best way to monitor hemoglobin levels.",
  "how often should i test my thyroid levels": "Thyroid tests are generally recommended annually or as advised by a doctor.",
  "what’s a normal blood glucose level": "For fasting, 70-99 mg/dL is normal; consult a doctor for personalized guidance.",
  "how do i know if i am underweight or overweight": "Calculate BMI using weight and height; discuss with your doctor for a detailed evaluation.",
  "how to monitor blood pressure at home": "Use an automatic cuff monitor, follow instructions, and record readings regularly.",
  "how to monitor bone density": "Regular bone density tests are recommended for individuals over 50 or at risk of osteoporosis.",
  "how often should i monitor cholesterol": "Every 4-6 years for healthy adults; consult your doctor for specific advice.",
  "how to check blood sugar levels at home": "Use a glucometer, follow instructions, and log readings for pattern observation.",
  "how to monitor my hydration level in hot weather": "Increase water intake and monitor urine color, aiming for light yellow or clear.",
  "how to track muscle mass percentage": "Use a body composition scale or visit a clinic for accurate muscle mass measurements.",
  "how can i measure stress levels": "Use a heart rate monitor or stress tracking features on wearable devices.",
  "how to monitor fatigue levels": "Pay attention to energy patterns, sleep quality, and track with an app if needed.",
  "how do i monitor my heart health": "Regular checkups, monitoring blood pressure, and keeping a healthy lifestyle aid heart health.",
  
  // Medicine Reminders
  "how do i set a medicine reminder": "Provide the medicine name, dosage, and times, and I’ll set a reminder for you.",
  "can i get reminders for multiple medications": "Yes, just list each medicine with timing and dosage, and I’ll set up reminders for each.",
  "how often can i receive reminders": "You can receive reminders daily, weekly, or at custom intervals you specify.",
  "can you remind me to take vitamins": "Yes, I can set up reminders for vitamins and supplements along with other medicines.",
  "can i get a reminder if i miss a dose": "Yes, let me know your preferred reminder time for missed doses.",
  "how do i set a recurring reminder": "Specify the interval and medicine, and I’ll set up a recurring reminder for it.",
  "can i pause a medicine reminder": "Yes, just let me know which medicine reminder to pause and for how long.",
  "can you remind me to refill my prescription": "I can set a refill reminder a week before your prescription runs out.",
  "how do i cancel a medicine reminder": "Let me know which reminder to cancel, and I’ll remove it from your schedule.",
  "can you remind me about insulin doses": "Yes, provide the timing and dosage, and I’ll set up insulin reminders.",
  "how do i edit my medicine reminder time": "Tell me the new timing, and I’ll update your reminder for the specified medicine.",
  "can i set reminders for over-the-counter meds": "Yes, just provide the name, dosage, and timing for the reminder.",
  "how do i set reminders for child medication": "I can schedule reminders for children’s medications if you provide the details.",
  "can i get reminders on my phone": "Yes, I can set reminders that notify you on your device.",
  "can i set a bedtime medicine reminder": "Let me know the specific time, and I’ll set a reminder for your bedtime medicine.",
  "can i receive reminders for morning and evening meds separately": "Yes, just specify the timings, and I’ll create separate reminders.",
  "how to get reminders for allergy medication": "Provide the name and timing, and I’ll set a regular reminder for it.",
  "can you remind me to take medicine with food": "I can add a note in your reminder to take the medicine with food.",
  "can i get weekly reminders instead of daily": "Yes, I can set up weekly reminders for specific medications.",
  "how to set a one-time reminder for medication": "Just tell me the time and dosage, and I’ll set a single reminder.",
  "how to set reminders for an entire treatment course": "Let me know the start and end dates, and I’ll set recurring reminders for the duration.",
  "can i set multiple reminders for the same day": "Yes, specify the times, and I’ll set multiple reminders for your medication.",
  "can i get reminders when i travel": "Yes, I can adjust reminders to your travel time zone.",
  "how to reset a missed dose reminder": "I’ll reset it according to your preferred schedule if you miss a dose.",
  "can i add notes to my medicine reminder": "Yes, let me know the note you want, and I’ll add it to your reminder.",
  "can you remind me to check blood pressure with meds": "I can include a reminder to check blood pressure before or after taking medicine.",
  "can i get reminders for short-term medications": "Yes, let me know the duration, and I’ll set reminders accordingly.",
  "can i turn off reminders temporarily": "Yes, just let me know when you’d like to resume reminders.",
  "how do i set an end date for my reminders": "Specify the last day for the reminder, and I’ll set it to stop after that date.",

  // Mental Health Support
  "how can i manage anxiety": "Practice deep breathing, meditation, and consider talking to a mental health professional.",
  "what are signs of depression": "Persistent sadness, fatigue, and loss of interest in activities are common signs.",
  "how can i improve my mental well-being": "Stay active, connect with loved ones, and engage in activities you enjoy.",
  "how do i know if i need therapy": "If stress or sadness affects daily life, therapy might help with coping strategies.",
  "what are ways to manage stress": "Try relaxation techniques, exercise, and establish a healthy routine.",
  "how can i practice mindfulness": "Focus on the present, engage in mindful breathing, and try meditation exercises.",
  "what is a mental health emergency": "If you or someone is at risk of harm, seek immediate support or contact emergency services.",
  "how to deal with panic attacks": "Focus on slow breathing, grounding techniques, and seek help if needed.",
  "can talking to friends help mental health": "Yes, connecting with trusted friends can provide support and relieve stress.",
  "how can i improve my sleep for better mental health": "Try a relaxing bedtime routine, limit caffeine, and maintain a regular sleep schedule.",
  "how does exercise affect mental health": "Physical activity releases endorphins, which can boost mood and reduce anxiety.",
  "what should i do if i feel isolated": "Reach out to friends, family, or consider joining community groups for support.",
  "how can i manage work-related stress": "Take regular breaks, prioritize tasks, and communicate boundaries at work.",
  "how can i build self-confidence": "Set achievable goals, practice positive self-talk, and celebrate small successes.",
  "how to deal with negative thoughts": "Challenge them by focusing on facts, seeking evidence, or talking with a therapist.",
  "how can journaling help mental health": "Writing thoughts down can provide clarity, relieve stress, and track progress.",
  "how to manage feelings of loneliness": "Stay connected with loved ones, consider new hobbies, or join local community activities.",
  "how do i know if i have a mental health condition": "If you experience ongoing emotional distress, consult a mental health professional.",
  "how to practice gratitude": "Take time daily to reflect on things you're thankful for; it can improve mood and outlook.",
  "how can i manage anger in a healthy way": "Practice deep breathing, take time-outs, and find constructive ways to express feelings.",
  "what are good ways to relax": "Try deep breathing, meditation, gentle exercise, or spend time in nature.",
  "how can i help a friend struggling with mental health": "Listen to them, offer support, and encourage professional help if needed.",
  "how does nutrition impact mental health": "A balanced diet can improve mood, energy levels, and support overall brain function.",
  "how to avoid burnout": "Balance work and rest, set limits, and engage in hobbies outside of work.",
  "how can i stay positive": "Focus on the good things, stay active, and practice gratitude regularly.",
  "what are relaxation techniques": "Try progressive muscle relaxation, deep breathing, and visualization exercises.",
  "can pets improve mental health": "Yes, pets provide companionship and can reduce stress and loneliness.",
  "how does music affect mood": "Listening to music can boost mood, reduce stress, and aid relaxation.",
  "how to set mental health goals": "Start small, be specific, and track progress in a way that feels supportive.",

  // Providing_General_Health_Advice
  "how can i boost my immune system?": "Eat a balanced diet, stay active, sleep well, and manage stress.",
  "what’s the best diet for heart health?": "Focus on fruits, vegetables, whole grains, lean protein, and limit salt and sugar.",
  "how to stay hydrated?": "Drink at least 8 glasses of water daily, or more if active.",
  "what are some tips for good sleep?": "Maintain a regular schedule, avoid screens before bed, and keep your room dark.",
  "how can i lower stress levels?": "Try deep breathing, exercise, meditation, or hobbies you enjoy.",
  "what’s the best way to exercise?": "Include a mix of cardio, strength, flexibility, and balance exercises.",
  "how to prevent back pain?": "Practice good posture, stretch regularly, and lift with your legs, not your back.",
  "what foods help with digestion?": "Fiber-rich foods like fruits, vegetables, whole grains, and yogurt are great for digestion.",
  "how to improve concentration?": "Get regular sleep, take breaks, and try mindfulness exercises.",
  "what is a balanced diet?": "A balanced diet includes fruits, vegetables, lean proteins, whole grains, and healthy fats.",
  "how to keep skin healthy?": "Stay hydrated, eat well, avoid too much sun, and use sunscreen.",
  "what are tips for healthy weight loss?": "Focus on balanced meals, portion control, and regular physical activity.",
  "how to increase physical activity?": "Incorporate walking, take the stairs, and find activities you enjoy.",
  "what are signs of good mental health?": "Positive relationships, managing stress well, and a balanced mood.",
  "how can i improve my mood?": "Exercise, eat healthy, get enough sleep, and connect with loved ones.",
  "what’s the best way to reduce cholesterol?": "Eat fiber-rich foods, reduce saturated fats, and increase exercise.",
  "how can i avoid getting sick?": "Wash your hands, eat well, stay active, and avoid close contact with sick people.",
  "what foods are good for heart health?": "Leafy greens, berries, whole grains, and nuts support heart health.",
  "how to maintain a healthy weight?": "Balance calories consumed with calories burned through diet and activity.",
  "what are tips for staying active at work?": "Take short walks, stretch, and stand during breaks.",
  "how to protect my eyes from screens?": "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
  "how to reduce sugar intake?": "Limit sugary drinks, choose whole fruits over juices, and read labels.",
  "what are tips for healthy aging?": "Stay active, eat balanced meals, stay socially connected, and get regular check-ups.",
  "how to keep bones strong?": "Include calcium-rich foods and vitamin D, and do weight-bearing exercises.",
  "how to improve memory?": "Stay mentally active, sleep well, exercise, and eat brain-friendly foods.",
  "what are benefits of drinking water?": "Water supports digestion, energy, skin health, and regulates body temperature.",
  "how to prevent joint pain?": "Stay active, maintain a healthy weight, and avoid excessive repetitive motions.",
  "what are ways to reduce headaches?": "Stay hydrated, avoid triggers, manage stress, and get regular sleep.",
  "what are some healthy breakfast ideas?": "Oatmeal with fruit, yogurt, whole-grain toast, and eggs are good options.",

  // Scheduling Doctor Appointments
  "how can i book a doctor’s appointment": "You can book an appointment by providing the preferred date, time, and doctor specialty.",
  "can i reschedule my appointment": "Yes, please specify your new preferred date and time, and we will update your appointment.",
  "how to cancel my doctor’s appointment": "To cancel, simply provide the date and time of your appointment, and we’ll remove it from the schedule.",
  "how do i know if my doctor is available": "I can check your doctor’s availability if you provide their name and preferred date.",
  "can i book an appointment with a specialist": "Yes, specify the specialty and your preferred timing, and I will check available slots.",
  "how far in advance can i book an appointment": "Appointments can typically be scheduled up to 3 months in advance.",
  "how to get a reminder for my appointment": "I can set a reminder for you. Please provide your preferred reminder time, like a day or an hour before.",
  "can i book a follow-up appointment": "Absolutely, just let me know the doctor’s name and your preferred timing.",
  "how do i choose a suitable doctor": "I can help you choose a doctor based on your health needs and available specialties.",
  "how can i check my appointment status": "Just provide your appointment details, and I’ll check the status for you.",
  "can i book an online consultation": "Yes, let me know the doctor and timing, and I can schedule a virtual consultation.",
  "what is the process for booking a consultation": "Simply provide your preferred timing, and I will check available slots.",
  "can i get a same-day appointment": "Same-day appointments are possible depending on the doctor’s availability. I can check this for you.",
  "how can i book a family appointment": "Let me know the number of people and preferred doctor, and I’ll arrange a family appointment.",
  "can i book a regular health check-up": "Absolutely, just let me know your preferred timing and doctor or hospital.",
  "how long does it take to get an appointment": "Appointment times vary; I can provide you with the nearest available time slot.",
  "can i choose my appointment time": "Yes, let me know your preferred day and time, and I’ll try to match it with the doctor’s availability.",
  "how do i know if i need a referral for an appointment": "I can check your medical requirements and let you know if a referral is necessary.",
  "how do i confirm my appointment": "I can send you a confirmation message once your appointment is booked.",
  "what information do i need to provide to book an appointment": "Your name, contact details, preferred timing, and doctor or specialty are required.",
  "can i change the location of my appointment": "Yes, please provide your preferred location, and I will update your appointment.",
  "how do i know if my insurance covers the appointment": "You can contact your insurance provider for coverage details before booking.",
  "how do i prepare for a doctor’s appointment": "Bring relevant medical records, a list of symptoms, and any questions for your doctor.",
  "what should i do if i’m running late": "Inform the clinic or reschedule if necessary. Many clinics allow a grace period.",
  "can i add a note to my appointment": "Yes, let me know what information you’d like added to the appointment notes.",
  "can i get reminders for all my appointments": "Yes, I can set up reminders for each appointment date and time.",
  "what are the cancellation fees for an appointment": "Fees vary by clinic. Check with the clinic or doctor’s office for specifics.",
  "can i bring someone with me to my appointment": "Yes, you’re generally allowed to bring a companion for support during your visit.",
  "how to schedule a consultation with a nutritionist": "Provide your preferred date and time, and I’ll check availability with a nutritionist.",

  // Symptom_checking
  "what are the symptoms of a cold?": "Common symptoms include runny nose, sore throat, coughing, sneezing, and mild headache.",
  "what are the signs of a fever?": "Fever symptoms include a body temperature over 100.4°F, sweating, chills, and muscle aches.",
  "how can i tell if i have the flu?": "Flu symptoms include high fever, chills, muscle aches, fatigue, and a dry cough.",
  "what are covid-19 symptoms?": "Symptoms include fever, cough, shortness of breath, fatigue, and loss of taste or smell.",
  "how do i know if i have a migraine?": "Migraines often cause severe headache on one side, sensitivity to light, nausea, and vision changes.",
  "what are signs of dehydration?": "Dehydration signs include dark urine, dizziness, dry skin, fatigue, and thirst.",
  "how to recognize food poisoning symptoms?": "Symptoms include nausea, vomiting, diarrhea, abdominal cramps, and sometimes fever.",
  "what are signs of an allergic reaction?": "Symptoms can include hives, itching, swelling, difficulty breathing, and stomach pain.",
  "what are symptoms of high blood pressure?": "Often there are no symptoms, but severe cases may cause headaches, vision changes, and chest pain.",
  "how to identify stress symptoms?": "Common symptoms include tension, fatigue, irritability, trouble sleeping, and headaches.",
  "what are signs of diabetes?": "Symptoms include frequent urination, increased thirst, fatigue, and blurred vision.",
  "what are symptoms of anemia?": "Signs of anemia include fatigue, pale skin, weakness, dizziness, and irregular heartbeat.",
  "how do i know if i have asthma?": "Symptoms include wheezing, shortness of breath, chest tightness, and coughing.",
  "what are symptoms of a uti?": "UTI symptoms include burning during urination, frequent urge to urinate, and cloudy urine.",
  "how to recognize appendicitis?": "Symptoms include severe abdominal pain, nausea, fever, and loss of appetite.",
  "what are symptoms of a kidney stone?": "Signs include intense pain in the side, nausea, vomiting, and blood in urine.",
  "how to know if i have an ear infection?": "Ear infection symptoms include ear pain, hearing loss, fever, and fluid drainage.",
  "what are symptoms of strep throat?": "Signs include sore throat, red and swollen tonsils, fever, and difficulty swallowing.",
  "how do i know if i have pneumonia?": "Pneumonia symptoms include cough with phlegm, fever, shortness of breath, and chest pain.",
  "what are symptoms of arthritis?": "Symptoms include joint pain, stiffness, swelling, and decreased range of motion.",
  "what are signs of a sinus infection?": "Symptoms include nasal congestion, headache, facial pain, and mucus discharge.",
  "how to recognize insomnia?": "Insomnia signs include trouble falling asleep, waking frequently, and feeling unrested.",
  "what are signs of depression?": "Symptoms include persistent sadness, loss of interest, fatigue, and sleep changes.",
  "what are symptoms of anxiety?": "Anxiety symptoms include nervousness, restlessness, rapid heartbeat, and sweating.",
  "how to know if i have a concussion?": "Concussion symptoms include headache, confusion, dizziness, and memory loss.",
  "what are signs of a panic attack?": "Symptoms include rapid heartbeat, sweating, shaking, shortness of breath, and fear.",
  "what are symptoms of an underactive thyroid?": "Signs include fatigue, weight gain, dry skin, and sensitivity to cold.",
  "what are signs of vitamin deficiency?": "Symptoms can include fatigue, brittle nails, hair loss, and muscle weakness.",
  "what are symptoms of gerd(gastroesophageal reflux disease)?": "GERD symptoms include heartburn, chest pain, regurgitation, and trouble swallowing.",
};

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; image?: string; }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  if (!isOpen) {
    return null;
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleImageScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setMessages(prev => [...prev, { sender: 'user', text: 'Scanning image...', image: URL.createObjectURL(selectedImage) }]);
    setUserInput('');

    const formData = new FormData();
    formData.append('data', selectedImage);

    try {
      const response = await fetch('https://kageyama0120-skin-disease-api.hf.space/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const result = await response.json();
      const prediction = result.data[0].label;
      const confidence = (result.data[0].conf * 100).toFixed(2);
      
      const botResponse = `Scan complete. Prediction: ${prediction} with ${confidence}% confidence.`;
      setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]);

    } catch (error) {
      console.error('Error during image scan:', error);
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I couldn't scan the image. Please try again or recheck the image." }]);
    } finally {
      setIsScanning(false);
      setSelectedImage(null);
    }
  };

  const handleSendMessage = () => {
    if (isScanning) return;

    if (selectedImage) {
      handleImageScan();
      return;
    }

    if (userInput.trim() === '') {
      return;
    }

    const userMessage = userInput.toLowerCase();
    const newMessages = [...messages, { sender: 'user', text: userInput }];

    // Find a matching key in our knowledge base
    const botResponse = knowledgeBase[userMessage] || "I'm sorry, I don't have information on that specific query. Please try rephrasing your question.";

    setMessages([...newMessages, { sender: 'bot', text: botResponse }]);
    setUserInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">HealthBot Assistant</h2>
              <p className="text-sm text-gray-600">Your AI-powered health companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        {/* Chat window */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md p-4 rounded-xl ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.image ? (
                  <img src={msg.image} alt="User upload" className="rounded-lg max-w-full" />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          ))}
          {isScanning && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-4 rounded-xl rounded-bl-none">
                <Loader className="w-5 h-5 inline mr-2 animate-spin" />
                Scanning image...
              </div>
            </div>
          )}
        </div>
        
        {/* Chat input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <label className="flex items-center justify-center p-3 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer transition-colors">
              <Upload className="w-6 h-6 text-gray-600" />
              <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
            </label>
            <input
              type="text"
              className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={selectedImage ? `Image selected: ${selectedImage.name}` : "Ask a health question..."}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isScanning || !!selectedImage}
            />
            <button
              onClick={handleSendMessage}
              disabled={isScanning || (!userInput.trim() && !selectedImage)}
              className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
          </div>
          {selectedImage && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              Click the message button to scan the image.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;