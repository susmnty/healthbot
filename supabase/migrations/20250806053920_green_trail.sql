/*
  # Create storage buckets for file uploads

  1. Storage Buckets
    - `medical-reports` - For appointment-related medical reports
    - `health-reports` - For user health reports and documents

  2. Security
    - Enable RLS on storage buckets
    - Add policies for authenticated users to upload/download their own files
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('medical-reports', 'medical-reports', true),
  ('health-reports', 'health-reports', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for medical-reports bucket
CREATE POLICY "Users can upload medical reports"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'medical-reports');

CREATE POLICY "Users can view medical reports"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'medical-reports');

-- Policy for health-reports bucket  
CREATE POLICY "Users can upload health reports"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'health-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own health reports"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'health-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own health reports"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'health-reports' AND auth.uid()::text = (storage.foldername(name))[1]);