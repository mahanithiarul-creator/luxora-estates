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

  const { propertyId, name, email, phone, message } = req.body;

  if (!propertyId || !name || !email || !message) {
    return res.status(400).json({ error: 'propertyId, name, email, and message are required' });
  }

  const { data, error } = await supabaseAdmin.from('inquiries').insert([
    {
      property_id: propertyId,
      user_id: userId,
      name,
      email,
      phone,
      message,
      status: 'new',
    },
  ]);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ data });
}
