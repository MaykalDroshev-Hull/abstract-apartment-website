import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { data, error } = await supabase
    .from('Booking')
    .select(`
      BookingID,
      CheckInDT,
      CheckOutDT,
      CustomerID,
      Customer:CustomerID (
        FirstName,
        LastName,
        Telephone
      ),
      FullPrice,
      PaidPrice,
      Comments
    `)
    .gt('CheckOutDT', new Date().toISOString()).order('CheckInDT');

  if (error) {
    console.error('Error fetching bookings:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ bookings: data });
}
