import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'

// Public client (Anon)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client (Service Role) - Use only in server-side routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
