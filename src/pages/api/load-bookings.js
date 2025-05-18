import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { data, error } = await supabase
    .from('Booking')
    .select('Date, IsBooked');

  if (error) {
    console.error('Supabase load error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }

  const bookedDates = {};
  data.forEach(({ Date, IsBooked }) => {
    if (IsBooked) bookedDates[Date] = true;
  });

  res.status(200).json({ success: true, bookedDates });
}
