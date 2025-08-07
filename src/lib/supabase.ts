import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file and ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are properly set.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Appointment {
  id?: string;
  patient_name: string;
  patient_age: number;
  patient_email: string;
  patient_phone: string;
  doctor_name: string;
  doctor_specialization: string;
  location: string;
  appointment_date: string;
  appointment_time: string;
  previous_reports?: string[];
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at?: string;
  user_id?: string;
}

export interface Doctor {
  id?: string;
  name: string;
  specialization: string;
  location: string;
  available_times: string[];
  rating: number;
  experience_years: number;
  image_url?: string;
}

export interface HealthReport {
  id?: string;
  user_id: string;
  report_type: string;
  report_date: string;
  file_url: string;
  notes?: string;
  created_at?: string;
}