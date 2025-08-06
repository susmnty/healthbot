import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Shield, Users, Clock, ArrowRight } from 'lucide-react';

const Landing: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Get health assistance anytime, anywhere'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is encrypted and protected'
    },
    {
      icon: Users,
      title: 'Expert Network',
      description: 'Connect with certified healthcare professionals'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-4 rounded-full shadow-lg">
              <Heart className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="block">{t('landingTitle')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-4">
            {t('motto')}
          </p>
          
          <p className="text-lg text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('landingSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/login"
              className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              {t('login')}
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
            <img
              src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Healthcare Technology"
              className="w-full h-64 md:h-96 object-cover rounded-xl"
            />
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full opacity-20 animate-pulse"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose My HealthBot?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of healthcare with our intelligent health companion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust My HealthBot for their wellness needs
          </p>
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span>{t('getStarted')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;