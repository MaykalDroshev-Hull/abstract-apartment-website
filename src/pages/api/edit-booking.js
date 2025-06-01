import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).end();

  const { BookingID, newCheckInDT, newCheckOutDT, FullPrice, PaidPrice, Comments } = req.body;

  const { error } = await supabase
    .from('Booking')
    .update({ CheckInDT: newCheckInDT, CheckOutDT: newCheckOutDT, FullPrice, PaidPrice, Comments })
    .eq('BookingID', BookingID);

  if (error) return res.status(500).json({ error });

  res.status(200).json({ success: true });
}
