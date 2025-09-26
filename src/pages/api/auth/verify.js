import { supabaseAdmin } from '../supabase-admin';
import { parse } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cookies = parse(req.headers.cookie || '');
    const sessionToken = cookies.admin_session;

    if (!sessionToken) {
      return res.status(401).json({ authenticated: false });
    }

    // Decode session token
    const decoded = Buffer.from(sessionToken, 'base64').toString('utf-8');
    const [userId, timestamp] = decoded.split(':');
    
    // Check if session is not expired (24 hours)
    const sessionAge = Date.now() - parseInt(timestamp);
    const maxAge = 60 * 60 * 24 * 1000; // 24 hours in milliseconds
    
    if (sessionAge > maxAge) {
      return res.status(401).json({ authenticated: false });
    }

    // Verify user still exists and is active
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('id, username, is_active')
      .eq('id', userId)
      .eq('is_active', true)
      .single();

    if (error || !user) {
      return res.status(401).json({ authenticated: false });
    }

    res.status(200).json({ 
      authenticated: true, 
      user: { id: user.id, username: user.username } 
    });

  } catch (error) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
