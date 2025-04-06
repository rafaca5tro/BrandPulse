
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client with hardcoded values instead of relying on env variables
// This ensures we always have a valid URL and key for the client
const supabaseUrl = 'https://wbvdiafpcydohgruueff.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidmRpYWZwY3lkb2hncnV1ZWZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2OTE1MzUsImV4cCI6MjA1OTI2NzUzNX0.0YY4R9d0dr8aoieD5K5sQweqtXXKIW_Ff8E5XyGJ-AM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
