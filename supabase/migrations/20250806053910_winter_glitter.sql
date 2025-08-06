/*
  # Create appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `patient_name` (text)
      - `patient_age` (integer)
      - `patient_email` (text)
      - `patient_phone` (text)
      - `doctor_name` (text)
      - `doctor_specialization` (text)
      - `location` (text)
      - `appointment_date` (date)
      - `appointment_time` (text)
      - `previous_reports` (text array)
      - `status` (text)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `appointments` table
    - Add policy for users to read/write their own appointments
*/

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text NOT NULL,
  patient_age integer NOT NULL,
  patient_email text NOT NULL,
  patient_phone text NOT NULL,
  doctor_name text NOT NULL,
  doctor_specialization text NOT NULL,
  location text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  previous_reports text[] DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  user_id uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own appointments"
  ON appointments
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own appointments"
  ON appointments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON appointments(user_id);
CREATE INDEX IF NOT EXISTS appointments_date_idx ON appointments(appointment_date);