import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key.
// IMPORTANT: Set SUPABASE_SERVICE_ROLE_KEY in your server env. Never expose it to the client.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  // Avoid throwing in production runtime; just make failures explicit on usage
  // eslint-disable-next-line no-console
  console.warn('Supabase admin client missing configuration: check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

