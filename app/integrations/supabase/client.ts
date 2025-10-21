import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://izvvdcituxkaljyhxthe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6dnZkY2l0dXhrYWxqeWh4dGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5NjM2OTksImV4cCI6MjA3NjUzOTY5OX0.jfIVl5baf0fAwL2OWDbKiQ9TFWK9gmgHDE2E0Exebp0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
