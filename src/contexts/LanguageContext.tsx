import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    back: 'Back',
    
    // Landing Page
    appName: 'My HealthBot',
    motto: 'Your 24/7 Caring Virtual Companion for a Healthier Life',
    landingTitle: 'Your Health, Our Priority',
    landingSubtitle: 'Connect with healthcare professionals, get instant medical advice, and maintain your wellness journey with our AI-powered health assistant.',
    getStarted: 'Get Started',
    
    // Login Page
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to continue your health journey',
    email: 'Email',
    password: 'Password',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    signIn: 'Sign In',
    noAccount: "Don't have an account?",
    signUp: 'Sign Up',
    forgotPassword: 'Forgot Password?',
    
    // Register Page
    registerTitle: 'Create Account',
    registerSubtitle: 'Join thousands of users on their health journey',
    fullName: 'Full Name',
    phone: 'Phone Number',
    confirmPassword: 'Confirm Password',
    namePlaceholder: 'Enter your full name',
    phonePlaceholder: 'Enter your phone number',
    confirmPasswordPlaceholder: 'Confirm your password',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    
    // Home Page
    welcome: 'Welcome',
    dashboardTitle: 'Health Dashboard',
    bookAppointment: 'Book Appointment',
    emergencySOS: 'Emergency SOS',
    healthCheckup: 'Health Checkup',
    dietSuggestions: 'Diet Suggestions',
    exercisePlans: 'Exercise Plans',
    mentalHealth: 'Mental Health Support',
    
    // Symptom Scanner
    symptomScanner: 'Symptom Scanner',
    scanSymptoms: 'Scan Symptoms',
    
    // Common
    loading: 'Loading...',
    error: 'Something went wrong',
    success: 'Success!',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
  },
  hi: {
    // Navigation
    login: 'लॉग इन',
    register: 'पंजीकरण',
    logout: 'लॉग आउट',
    back: 'वापस',
    
    // Landing Page
    appName: 'माय हेल्थबॉट',
    motto: 'स्वस्थ जीवन के लिए आपका 24/7 देखभाल करने वाला वर्चुअल साथी',
    landingTitle: 'आपका स्वास्थ्य, हमारी प्राथमिकता',
    landingSubtitle: 'स्वास्थ्य पेशेवरों से जुड़ें, तत्काल चिकित्सा सलाह प्राप्त करें, और हमारे AI-पावर्ड हेल्थ असिस्टेंट के साथ अपनी कल्याण यात्रा बनाए रखें।',
    getStarted: 'शुरू करें',
    
    // Login Page
    loginTitle: 'वापस स्वागत है',
    loginSubtitle: 'अपनी स्वास्थ्य यात्रा जारी रखने के लिए साइन इन करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    emailPlaceholder: 'अपना ईमेल दर्ज करें',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    signIn: 'साइन इन',
    noAccount: 'कोई खाता नहीं है?',
    signUp: 'साइन अप',
    forgotPassword: 'पासवर्ड भूल गए?',
    
    // Register Page
    registerTitle: 'खाता बनाएं',
    registerSubtitle: 'अपनी स्वास्थ्य यात्रा पर हजारों उपयोगकर्ताओं से जुड़ें',
    fullName: 'पूरा नाम',
    phone: 'फोन नंबर',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    namePlaceholder: 'अपना पूरा नाम दर्ज करें',
    phonePlaceholder: 'अपना फोन नंबर दर्ज करें',
    confirmPasswordPlaceholder: 'अपने पासवर्ड की पुष्टि करें',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से खाता है?',
    
    // Home Page
    welcome: 'स्वागत',
    dashboardTitle: 'स्वास्थ्य डैशबोर्ड',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    emergencySOS: 'आपातकालीन SOS',
    healthCheckup: 'स्वास्थ्य जांच',
    dietSuggestions: 'आहार सुझाव',
    exercisePlans: 'व्यायाम योजनाएं',
    mentalHealth: 'मानसिक स्वास्थ्य सहायता',
    
    // Symptom Scanner
    symptomScanner: 'लक्षण स्कैनर',
    scanSymptoms: 'लक्षण स्कैन करें',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'कुछ गलत हो गया',
    success: 'सफलता!',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};