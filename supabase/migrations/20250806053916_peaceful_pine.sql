/*
  # Create health reports table

  1. New Tables
    - `health_reports`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `report_type` (text)
      - `report_date` (date)
      - `file_url` (text)
      - `notes` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `health_reports` table
    - Add policy for users to read/write their own reports
*/

CREATE TABLE IF NOT EXISTS health_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  report_type text NOT NULL,
  report_date date NOT NULL,
  file_url text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE health_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own health reports"
  ON health_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own health reports"
  ON health_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own health reports"
  ON health_reports
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete own health reports"
  ON health_reports
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS health_reports_user_id_idx ON health_reports(user_id);
CREATE INDEX IF NOT EXISTS health_reports_date_idx ON health_reports(report_date);