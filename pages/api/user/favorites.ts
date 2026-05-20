import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseAdminClient';

async function getUserIdFromHeader(req: NextApiRequest) {
  const token = req.headers.authorization?.split(' ')[1] || null;
  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;

  return data.user.id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = await getUserIdFromHeader(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  if (req.method === 'POST') {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'Missing propertyId in request body' });
    }

    const { data, error } = await supabaseAdmin.from('favorites').insert([{ property_id: propertyId, user_id: userId }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ data });
  }

  if (req.method === 'DELETE') {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({ error: 'Missing propertyId in request body' });
    }

    const { data, error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
