import { createClient } from '@supabase/supabase-js';
import { format, parseISO, addDays, isBefore } from 'date-fns';

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
    .select('CheckInDT, CheckOutDT');

  if (error) {
    console.error('Supabase load error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }

  const bookedDates = {};

  data.forEach(({ CheckInDT, CheckOutDT }) => {
    if (!CheckInDT || !CheckOutDT) return;

    let current = parseISO(CheckInDT);
    const end = parseISO(CheckOutDT);

    // Only include dates up to the day *before* CheckOutDT
    while (isBefore(current, end)) {
      const dateStr = format(current, 'yyyy-MM-dd');
      bookedDates[dateStr] = true;
      current = addDays(current, 1);
    }
  });

  res.status(200).json({ success: true, bookedDates });
}
