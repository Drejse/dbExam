import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;

const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient("https://smameejefvpsbpaijmtk.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtYW1lZWplZnZwc2JwYWlqbXRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODMzMjE4ODYsImV4cCI6MTk5ODg5Nzg4Nn0.Z07-6Vq3s-2T9sNJYM_G5P204Iym1tFSPEOoLil5M5k");
