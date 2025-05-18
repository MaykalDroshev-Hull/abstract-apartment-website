import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { bookings } = req.body;

  if (!Array.isArray(bookings)) {
    return res.status(400).json({ success: false, message: 'Invalid format' });
  }

  // Upsert each booking individually
  const upserts = bookings.map(({ date, isBooked }) => ({
    Date: date,
    IsBooked: isBooked,
  }));

  const { error } = await supabase
    .from('Booking')
    .upsert(upserts, { onConflict: 'Date' });

  if (error) {
    console.error('Supabase save error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }

  res.status(200).json({ success: true });
}
