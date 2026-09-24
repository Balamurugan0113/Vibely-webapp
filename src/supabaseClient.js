import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gepajhpnlkfaohudavja.supabase.co'
const supabaseKey = 'sb_publishable_0VIeoxYP3G8cRPZwICSTqA_FGCv9EYb'

export const supabase = createClient(supabaseUrl, supabaseKey)
