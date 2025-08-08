import React, { useState, useEffect } from 'react';
import { X, FileText, Upload, Download, Calendar, Loader, AlertTriangle } from 'lucide-react';
import { supabase, type HealthReport } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface HealthReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_FILE_SIZE_MB = 10;

const HealthReportsModal: React.FC<HealthReportsModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reportType, setReportType] = useState('');
  const [reportDate, setReportDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      fetchReports();
    }
  }, [isOpen, user]);

  const fetchReports = async () => {
    if (!user) return;
    
    setLoading(true);
    setFetchError(null);
    try {
      const { data, error } = await supabase
        .from('health_reports')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message || 'Failed to fetch reports.');
      }
      setReports(data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setFetchError('Failed to load your reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!reportType) newErrors.reportType = 'Report type is required.';
    if (!reportDate) newErrors.reportDate = 'Report date is required.';
    if (!selectedFile) newErrors.selectedFile = 'A file is required.';
    if (selectedFile && selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      newErrors.selectedFile = `File size must be under ${MAX_FILE_SIZE_MB}MB.`;
    }
    return newErrors;
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMessage(null);
    setErrors({});
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user || !selectedFile) return;

    setUploading(true);
    try {
      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('health-reports')
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw new Error(uploadError.message || 'File upload failed.');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('health-reports')
        .getPublicUrl(fileName);

      // Save report metadata to database
      const reportData: HealthReport = {
        user_id: user.id,
        report_type: reportType,
        report_date: reportDate,
        file_url: publicUrl,
        notes: notes || undefined
      };

      const { error: dbError } = await supabase
        .from('health_reports')
        .insert([reportData]);

      if (dbError) {
        throw new Error(dbError.message || 'Database insertion failed.');
      }

      setFormMessage({ type: 'success', text: 'Report uploaded successfully!' });
      
      // Reset form fields
      setSelectedFile(null);
      setReportType('');
      setReportDate('');
      setNotes('');
      // Manually reset file input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      fetchReports();
      
    } catch (error) {
      console.error('Error uploading report:', error);
      setFormMessage({ type: 'error', text: (error as Error).message });
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (fileUrl: string, reportType: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = `${reportType}-${Date.now()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Health Reports</h2>
              <p className="text-sm text-gray-600">Manage your medical documents</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          {formMessage && (
            <div className={`p-3 rounded-lg text-center mb-4 ${
              formMessage.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {formMessage.text}
            </div>
          )}

          {/* Upload Form */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload New Report
            </h3>
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type *
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => {
                      setReportType(e.target.value);
                      if (errors.reportType) setErrors(prev => ({ ...prev, reportType: '' }));
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.reportType ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="">Select report type</option>
                    <option value="Blood Test">Blood Test</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="MRI">MRI</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Ultrasound">Ultrasound</option>
                    <option value="ECG">ECG</option>
                    <option value="Prescription">Prescription</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.reportType && <p className="mt-1 text-sm text-red-600">{errors.reportType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Date *
                  </label>
                  <input
                    type="date"
                    value={reportDate}
                    onChange={(e) => {
                      setReportDate(e.target.value);
                      if (errors.reportDate) setErrors(prev => ({ ...prev, reportDate: '' }));
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.reportDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                    required
                  />
                  {errors.reportDate && <p className="mt-1 text-sm text-red-600">{errors.reportDate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File *
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    setSelectedFile(e.target.files?.[0] || null);
                    if (errors.selectedFile) setErrors(prev => ({ ...prev, selectedFile: '' }));
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.selectedFile ? 'border-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                <p className="mt-1 text-sm text-gray-600">
                  Supported formats: PDF, JPG, PNG (Max {MAX_FILE_SIZE_MB}MB)
                </p>
                {errors.selectedFile && <p className="mt-1 text-sm text-red-600">{errors.selectedFile}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Add any additional notes about this report..."
                />
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedFile || !reportType || !reportDate || !!errors.selectedFile}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
              >
                {uploading && <Loader className="w-4 h-4 animate-spin" />}
                <span>{uploading ? 'Uploading...' : 'Upload Report'}</span>
              </button>
            </form>
          </div>

          {/* Reports List */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Reports</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Loading reports...</span>
              </div>
            ) : fetchError ? (
              <div className="flex items-center justify-center py-8 text-red-600">
                <AlertTriangle className="w-6 h-6" />
                <span className="ml-2">{fetchError}</span>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No reports uploaded yet</p>
                <p className="text-sm">Upload your first medical report above</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {reports.map((report) => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{report.report_type}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(report.report_date).toLocaleDateString()}
                            </span>
                            <span>
                              Uploaded: {new Date(report.created_at!).toLocaleDateString()}
                            </span>
                          </div>
                          {report.notes && (
                            <p className="text-sm text-gray-600 mt-1">{report.notes}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDownload(report.file_url, report.report_type)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthReportsModal;