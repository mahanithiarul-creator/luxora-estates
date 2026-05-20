import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../lib/supabaseAdminClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { q, featured } = req.query;
  let query = supabaseAdmin.from('properties').select('id,title,location,price,image,bedrooms,bathrooms,area,category,featured,short_description');

  if (featured === 'true') {
    query = query.eq('featured', true).order('created_at', { ascending: false });
  }

  if (q && typeof q === 'string') {
    query = query.ilike('title', `%${q}%`).or(`location.ilike.%${q}%`);
  }

  const { data, error } = await query.limit(18);
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ data });
}
