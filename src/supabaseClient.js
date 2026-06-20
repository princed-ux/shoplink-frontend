import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://xofnbiypfsjyfdwrkgam.supabase.co" // Replace with your Supabase project URL
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvZm5iaXlwZnNqeWZkd3JrZ2FtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxMTQ1NDYsImV4cCI6MjA3OTY5MDU0Nn0.6M4XIO1wapjYFRXjRC0HN8N-CUNenw3i7JDKkX04oqE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true, // MUST BE TRUE FOR GOOGLE OAUTH TO WORK
    flowType: 'pkce',         // Safe auth flow
  },
})