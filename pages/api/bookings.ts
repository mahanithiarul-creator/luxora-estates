import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdminClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const token = req.headers.authorization?.split(' ')[1] || null;
  const userResponse = token ? await supabaseAdmin.auth.getUser(token) : null;
  const userId = userResponse?.data.user?.id ?? null;

  const { propertyId, name, email, phone, date, message } = req.body;

  if (!propertyId || !email || !date) {
    return res.status(400).json({ error: 'propertyId, email, and date are required' });
  }

  const { data, error } = await supabaseAdmin.from('bookings').insert([
    {
      property_id: propertyId,
      user_id: userId,
      name,
      email,
      phone,
      booking_date: date,
      message,
      status: 'pending',
    },
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ data });
}
