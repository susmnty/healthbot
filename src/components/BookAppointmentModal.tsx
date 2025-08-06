import React, { useState, useEffect } from 'react';
import { X, Calendar, User, MapPin, Clock, Upload, Loader } from 'lucide-react';
import { supabase, type Appointment, type Doctor } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface BookAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    patient_name: user?.name || '',
    patient_age: '',
    patient_email: user?.email || '',
    patient_phone: user?.phone || '',
    doctor_name: '',
    doctor_specialization: '',
    location: '',
    appointment_date: '',
    appointment_time: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sample doctors data - in real app, this would come from Supabase
  useEffect(() => {
    if (isOpen) {
      setDoctors([
        {
          name: 'Dr. Sarah Johnson',
          specialization: 'Cardiology',
          location: 'City Hospital, New York',
          available_times: ['09:00', '10:00', '11:00', '14:00', '15:00'],
          rating: 4.8,
          experience_years: 15
        },
        {
          name: 'Dr. Michael Chen',
          specialization: 'Dermatology',
          location: 'Skin Care Clinic, Los Angeles',
          available_times: ['10:00', '11:00', '13:00', '16:00', '17:00'],
          rating: 4.9,
          experience_years: 12
        },
        {
          name: 'Dr. Emily Rodriguez',
          specialization: 'Pediatrics',
          location: 'Children\'s Hospital, Chicago',
          available_times: ['08:00', '09:00', '10:00', '14:00', '15:00'],
          rating: 4.7,
          experience_years: 18
        },
        {
          name: 'Dr. David Kumar',
          specialization: 'Orthopedics',
          location: 'Bone & Joint Center, Houston',
          available_times: ['09:00', '11:00', '13:00', '15:00', '16:00'],
          rating: 4.6,
          experience_years: 20
        }
      ]);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-fill doctor details when doctor is selected
    if (name === 'doctor_name') {
      const selectedDoctor = doctors.find(doc => doc.name === value);
      if (selectedDoctor) {
        setFormData(prev => ({
          ...prev,
          doctor_specialization: selectedDoctor.specialization,
          location: selectedDoctor.location
        }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.patient_name.trim()) newErrors.patient_name = 'Name is required';
    if (!formData.patient_age) newErrors.patient_age = 'Age is required';
    if (!formData.patient_email.trim()) newErrors.patient_email = 'Email is required';
    if (!formData.patient_phone.trim()) newErrors.patient_phone = 'Phone is required';
    if (!formData.doctor_name) newErrors.doctor_name = 'Please select a doctor';
    if (!formData.appointment_date) newErrors.appointment_date = 'Date is required';
    if (!formData.appointment_time) newErrors.appointment_time = 'Time is required';

    return newErrors;
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('medical-reports')
        .upload(fileName, file);

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('medical-reports')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Upload files if any
      let fileUrls: string[] = [];
      if (selectedFiles.length > 0) {
        fileUrls = await uploadFiles(selectedFiles);
      }

      // Create appointment
      const appointmentData: Appointment = {
        ...formData,
        patient_age: parseInt(formData.patient_age),
        previous_reports: fileUrls,
        status: 'pending',
        user_id: user?.id
      };

      const { error } = await supabase
        .from('appointments')
        .insert([appointmentData]);

      if (error) throw error;

      // Success
      alert('Appointment booked successfully!');
      onClose();
      
      // Reset form
      setFormData({
        patient_name: user?.name || '',
        patient_age: '',
        patient_email: user?.email || '',
        patient_phone: user?.phone || '',
        doctor_name: '',
        doctor_specialization: '',
        location: '',
        appointment_date: '',
        appointment_time: '',
      });
      setSelectedFiles([]);
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDoctor = doctors.find(doc => doc.name === formData.doctor_name);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-2 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Book Appointment</h2>
              <p className="text-sm text-gray-600">Schedule your consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Patient Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.patient_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter patient name"
                />
                {errors.patient_name && <p className="mt-1 text-sm text-red-600">{errors.patient_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age *
                </label>
                <input
                  type="number"
                  name="patient_age"
                  value={formData.patient_age}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.patient_age ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter age"
                  min="1"
                  max="120"
                />
                {errors.patient_age && <p className="mt-1 text-sm text-red-600">{errors.patient_age}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="patient_email"
                  value={formData.patient_email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.patient_email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email"
                />
                {errors.patient_email && <p className="mt-1 text-sm text-red-600">{errors.patient_email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="patient_phone"
                  value={formData.patient_phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.patient_phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.patient_phone && <p className="mt-1 text-sm text-red-600">{errors.patient_phone}</p>}
              </div>
            </div>
          </div>

          {/* Doctor Selection */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Doctor Selection
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor *
                </label>
                <select
                  name="doctor_name"
                  value={formData.doctor_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.doctor_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map((doctor, index) => (
                    <option key={index} value={doctor.name}>
                      {doctor.name} - {doctor.specialization} ({doctor.location})
                    </option>
                  ))}
                </select>
                {errors.doctor_name && <p className="mt-1 text-sm text-red-600">{errors.doctor_name}</p>}
              </div>

              {selectedDoctor && (
                <div className="bg-white p-4 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{selectedDoctor.name}</h4>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600">{selectedDoctor.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Specialization:</strong> {selectedDoctor.specialization}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Experience:</strong> {selectedDoctor.experience_years} years
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Location:</strong> {selectedDoctor.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Appointment Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.appointment_date ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.appointment_date && <p className="mt-1 text-sm text-red-600">{errors.appointment_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <select
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.appointment_time ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select time</option>
                  {selectedDoctor?.available_times.map((time, index) => (
                    <option key={index} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.appointment_time && <p className="mt-1 text-sm text-red-600">{errors.appointment_time}</p>}
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Previous Reports (Optional)
            </h3>
            <div>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-2 text-sm text-gray-600">
                Upload previous medical reports (PDF, JPG, PNG). Max 5 files.
              </p>
              {selectedFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Selected files:</p>
                  <ul className="text-sm text-gray-600">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>• {file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
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
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              <span>{loading ? 'Booking...' : 'Book Appointment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookAppointmentModal;