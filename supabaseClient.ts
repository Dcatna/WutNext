import {SupabaseClient, createClient} from '@supabase/supabase-js'

const supabaseUrl = "https://ghasvemjqkfxpkkafnbg.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoYXN2ZW1qcWtmeHBra2FmbmJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU0NTg3MzIsImV4cCI6MjAyMTAzNDczMn0.6b_ouVg6R7ubRh6N96qSfJBzr8MNlgRLWAdiJFNoyXw"

export function initializeSupabaseClient(userToken: string): SupabaseClient {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${userToken}`,
                'apikey': supabaseAnonKey,
            },
        },
    });
}