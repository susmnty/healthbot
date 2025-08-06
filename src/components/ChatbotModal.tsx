import React from 'react';
import { X, MessageCircle, Loader } from 'lucide-react';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatbotModal: React.FC<ChatbotModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(true);

  if (!isOpen) return null;

  const handleIframeLoad = () => {
    setIsLoading(false);
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

        {/* Content */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading HealthBot...</p>
              </div>
            </div>
          )}
          <iframe
            src="https://chat.cxgenie.ai/?aid=69d3dc37-19d3-4799-b2a8-5a8ff5762065&lang=en"
            className="w-full h-full rounded-b-2xl"
            onLoad={handleIframeLoad}
            title="HealthBot Assistant"
            allow="microphone; camera"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotModal;