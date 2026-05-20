import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseAdminClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing property id' });
  }

  const { data, error } = await supabaseAdmin.from('properties').select('*').eq('id', id).maybeSingle();
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ error: 'Property not found' });
  }

  return res.status(200).json({ data });
}
