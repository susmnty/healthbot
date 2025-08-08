import React, { useState } from 'react';
import { X, AlertTriangle, Phone, MapPin, Clock, User, Loader } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyModal: React.FC<EmergencyModalProps> = ({ isOpen, onClose }) => {
  const [emergencyType, setEmergencyType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', type: 'General Emergency' },
    { name: 'Poison Control', number: '1-800-222-1222', type: 'Poisoning' },
    { name: 'Crisis Hotline', number: '988', type: 'Mental Health Crisis' },
    { name: 'Fire Department', number: '911', type: 'Fire Emergency' },
  ];

  const handleEmergencyCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleGetLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(`Lat: ${latitude}, Long: ${longitude}`);
          setIsLoading(false);
        },
        (error) => {
          console.error(error);
          setLocation('Unable to retrieve location');
          setIsLoading(false);
        }
      );
    } else {
      setLocation('Geolocation is not supported by this browser.');
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!emergencyType) newErrors.emergencyType = 'Please select an emergency type.';
    if (!location.trim()) newErrors.location = 'Location is required.';
    if (!description.trim()) newErrors.description = 'A description is required.';
    return newErrors;
  };

  const handleSubmitEmergency = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    // Simulate an API call to send data to a backend service
    new Promise((resolve, reject) => {
      setTimeout(() => {
        // Here you would send a POST request with the form data
        // For demonstration, we'll simulate a success
        if (Math.random() > 0.1) { // 90% chance of success
          resolve('Emergency report sent successfully!');
        } else {
          reject('Failed to submit emergency report. Please call 911 directly.');
        }
      }, 2000);
    })
    .then(message => {
      setFormMessage({ type: 'success', text: message as string });
      setTimeout(onClose, 2500); // Close modal after success
    })
    .catch(error => {
      setFormMessage({ type: 'error', text: error as string });
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <div className="bg-red-600 p-2 rounded-lg animate-pulse">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-900">Emergency SOS</h2>
              <p className="text-sm text-red-700">Get immediate help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-red-600" />
          </button>
        </div>

        <div className="p-6">
          {/* Form Messages */}
          {formMessage && (
            <div className={`p-3 rounded-lg text-center mb-4 ${
              formMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {formMessage.text}
            </div>
          )}

          {/* Quick Emergency Contacts */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-red-600" />
              Quick Emergency Contacts
            </h3>
            <div className="grid gap-3">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <h4 className="font-semibold text-red-900">{contact.name}</h4>
                    <p className="text-sm text-red-700">{contact.type}</p>
                  </div>
                  <button
                    onClick={() => handleEmergencyCall(contact.number)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{contact.number}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Report Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Report Emergency
            </h3>
            <form onSubmit={handleSubmitEmergency} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Type *
                </label>
                <select
                  value={emergencyType}
                  onChange={(e) => {
                    setEmergencyType(e.target.value);
                    if (errors.emergencyType) setErrors(prev => ({ ...prev, emergencyType: '' }));
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.emergencyType ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="">Select emergency type</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="accident">Accident</option>
                  <option value="fire">Fire</option>
                  <option value="crime">Crime/Violence</option>
                  <option value="mental-health">Mental Health Crisis</option>
                  <option value="other">Other</option>
                </select>
                {errors.emergencyType && <p className="mt-1 text-sm text-red-600">{errors.emergencyType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location *
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => {
                        setLocation(e.target.value);
                        if (errors.location) setErrors(prev => ({ ...prev, location: '' }));
                      }}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your current location"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
                  </button>
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                  }}
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the emergency situation..."
                  required
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Name
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Contact person name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Contact phone number"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Submit Emergency</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Important Notice */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-900">Important Notice</h4>
                <p className="text-sm text-yellow-800 mt-1">
                  For immediate life-threatening emergencies, call 911 directly. This form is for 
                  reporting and tracking purposes and may not provide immediate response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;