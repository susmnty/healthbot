import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <button
        onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
        className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        {language === 'en' ? 'हिंदी' : 'English'}
      </button>
    </div>
  );
};

export default LanguageSwitcher;