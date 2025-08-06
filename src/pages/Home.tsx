import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

import {
  Calendar,
  AlertTriangle,
  Heart,
  MessageCircle,
  FileText,
  Stethoscope,
  Phone,
  User
} from 'lucide-react';

import ChatbotModal from '../components/ChatbotModal';
import BookAppointmentModal from '../components/BookAppointmentModal';
import HealthReportsModal from '../components/HealthReportsModal';
import EmergencyModal from '../components/EmergencyModal';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [showChatbot, setShowChatbot] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  if (!user) return <div className="text-center mt-20 text-gray-600">Loading...</div>;

  const features = [
    {
      icon: Calendar,
      title: t('bookAppointment'),
      description: 'Schedule appointments with certified doctors',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      action: () => setShowBooking(true)
    },
    {
      icon: Stethoscope,
      title: 'Consult a Doctor',
      description: 'Get professional medical consultation online',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      action: () => setShowChatbot(true)
    },
    {
      icon: AlertTriangle,
      title: t('emergencySOS'),
      description: 'Emergency contacts and immediate assistance',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      action: () => setShowEmergency(true)
    },
    {
      icon: FileText,
      title: 'Health Reports',
      description: 'Upload and manage your medical documents',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      action: () => setShowReports(true)
    },
    {
      icon: MessageCircle,
      title: 'HealthBot Support',
      description: 'AI-powered health assistant for instant help',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
      action: () => setShowChatbot(true)
    },
    {
      icon: Heart,
      title: t('healthCheckup'),
      description: 'Monitor your vital signs and health metrics',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      action: () => alert('Health checkup feature coming soon!')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-10">
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

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={feature.action}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer overflow-hidden group"
          >
            <div className={`${feature.bgColor} p-6`}>
              <div className={`bg-gradient-to-r ${feature.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-xl font-bold ${feature.textColor} mb-2`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <ChatbotModal isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
      <BookAppointmentModal isOpen={showBooking} onClose={() => setShowBooking(false)} />
      <HealthReportsModal isOpen={showReports} onClose={() => setShowReports(false)} />
      <EmergencyModal isOpen={showEmergency} onClose={() => setShowEmergency(false)} />
    </div>
  );
};

export default Home;
