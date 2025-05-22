import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { CheckInDT, CheckOutDT, FirstName, LastName, Telephone } = req.body;

  const { data: customer, error: custErr } = await supabase
    .from('Customer')
    .insert([{ FirstName, LastName, Telephone }])
    .select()
    .single();

  if (custErr) return res.status(500).json({ error: custErr });

  const { error: bookErr } = await supabase
    .from('Booking')
    .insert([{ CheckInDT, CheckOutDT, CustomerID: customer.CustomerID }]);

  if (bookErr) return res.status(500).json({ error: bookErr });

  res.status(200).json({ success: true });
}
