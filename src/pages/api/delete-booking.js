import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const { BookingID } = req.body;

  const { data: booking, error: fetchErr } = await supabase
    .from('Booking')
    .select('CustomerID')
    .eq('BookingID', BookingID)
    .single();

  if (fetchErr) return res.status(500).json({ error: fetchErr });

  const { error: deleteBookingErr } = await supabase
    .from('Booking')
    .delete()
    .eq('BookingID', BookingID);

  if (deleteBookingErr) return res.status(500).json({ error: deleteBookingErr });

  const { error: deleteCustomerErr } = await supabase
    .from('Customer')
    .delete()
    .eq('CustomerID', booking.CustomerID);

  if (deleteCustomerErr) return res.status(500).json({ error: deleteCustomerErr });

  res.status(200).json({ success: true });
}
