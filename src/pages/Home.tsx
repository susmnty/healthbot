import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Calendar,
  AlertTriangle,
  Heart,
  Apple,
  Dumbbell,
  Brain,
  MessageCircle,
  User,
  Activity,
  Scan
} from 'lucide-react';
import SymptomScanner from '../components/SymptomScanner';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [showScanner, setShowScanner] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: t('bookAppointment'),
      description: 'Schedule appointments with healthcare professionals',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: Scan,
      title: t('scanSymptoms'),
      description: 'AI-powered symptom analysis from photos',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      icon: AlertTriangle,
      title: t('emergencySOS'),
      description: 'Get immediate emergency assistance',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      icon: Heart,
      title: t('healthCheckup'),
      description: 'Monitor your vital signs and health metrics',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      icon: Apple,
      title: t('dietSuggestions'),
      description: 'Get personalized nutrition recommendations',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: Dumbbell,
      title: t('exercisePlans'),
      description: 'Access customized workout routines',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: Brain,
      title: t('mentalHealth'),
      description: 'Support for anxiety, depression, and wellness',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600'
    }
  ];

  const handleFeatureClick = (featureTitle: string) => {
    console.log(`Clicked: ${featureTitle}`);
    if (featureTitle === t('scanSymptoms')) {
      setShowScanner(true);
      return;
    }
    // TODO: Navigate to specific feature pages
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-3 rounded-full">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {t('welcome')}, {user?.name}!
                </h1>
                <p className="text-gray-600 text-lg">{t('dashboardTitle')}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Health Score</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 mt-1">85/100</p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Last Checkup</span>
                </div>
                <p className="text-sm font-semibold text-green-700 mt-1">2 weeks ago</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Workouts</span>
                </div>
                <p className="text-2xl font-bold text-purple-700 mt-1">12</p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Apple className="w-5 h-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Diet Plan</span>
                </div>
                <p className="text-sm font-semibold text-orange-700 mt-1">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() => handleFeatureClick(feature.title)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden group"
            >
              <div className={`${feature.bgColor} p-6 group-hover:bg-opacity-80 transition-all duration-300`}>
                <div className={`bg-gradient-to-r ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold ${feature.textColor} mb-2 group-hover:text-opacity-80 transition-colors`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>

              <div className="p-6 border-t border-gray-100">
                <button className={`text-sm font-medium ${feature.textColor} hover:underline flex items-center space-x-1 group-hover:translate-x-1 transition-transform duration-300`}>
                  <span>Learn More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Book Now</span>
            </button>

            <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Emergency</span>
            </button>

            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
              <Heart className="w-5 h-5" />
              <span>Health Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Chatbot Button */}
      <div className="fixed bottom-6 right-6">
        <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 group">
          <MessageCircle className="w-6 h-6 group-hover:animate-pulse" />
        </button>
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Ask HealthBot
        </div>
      </div>

      {/* Symptom Scanner Modal */}
      <SymptomScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
};

export default Home;
