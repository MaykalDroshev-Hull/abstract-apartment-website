import { supabaseAdmin } from './supabase-admin';
import { transporter } from '../../components/config/nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const now = new Date().toISOString();
  const payload = {
    source: 'vercel-cron',
    note: 'Automatic heartbeat',
    created_at: now,
  };

  async function sendAlertEmail(message) {
    try {
      await transporter.sendMail({
        from: `Heartbeat Monitor <${process.env.NEXT_PUBLIC_EMAIL}>`,
        to: 'mdroshev@gmail.com',
        subject: 'Supabase Heartbeat Failure',
        text: `Time: ${now}\nError: ${message}`,
      });
    } catch (mailErr) {
      // eslint-disable-next-line no-console
      console.error('Failed to send heartbeat alert email:', mailErr);
    }
  }

  const withTimeout = (promise, ms) =>
    Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(`Timeout after ${ms} ms`)), ms)),
    ]);

  try {
    const { error } = await withTimeout(
      supabaseAdmin.from('heartbeat').insert(payload),
      8000
    );
    if (error) {
      await sendAlertEmail(error.message || 'Unknown Supabase error');
      return res.status(500).json({ ok: false, error: error.message });
    }
    return res.status(200).json({ ok: true, inserted_at: now });
  } catch (err) {
    await sendAlertEmail(err.message || 'Unknown failure');
    return res.status(500).json({ ok: false, error: err.message });
  }
}

