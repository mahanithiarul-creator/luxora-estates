import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, supabaseAdminReady } from '../../../lib/supabaseAdminClient';
import sample from '../../../lib/sample-data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { propertyId, q } = req.query;

  if (!supabaseAdminReady || !supabaseAdmin) {
    const fallback = sample.properties
      .filter((property) => property.id !== (propertyId as string))
      .filter((property) => {
        if (!q || typeof q !== 'string') return true;
        const query = q.toLowerCase();
        return property.title.toLowerCase().includes(query) || property.location.toLowerCase().includes(query);
      })
      .slice(0, 4)
      .map((property) => ({
        id: property.id,
        title: `Refine your search with ${property.title}`,
        summary: `A premium option in ${property.location} with elite amenities for a cinematic investor showcase.`,
        image: property.image,
      }));

    return res.status(200).json({ recommendations: fallback });
  }

  let query = supabaseAdmin.from('properties').select('id,title,location,price,image,short_description').neq('id', propertyId as string).limit(4);

  if (q && typeof q === 'string') {
    query = query.ilike('title', `%${q}%`).or(`location.ilike.%${q}%`);
  } else {
    query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const recommendations = (data ?? []).map((property: any) => ({
    id: property.id,
    title: `Refine your search with ${property.title}`,
    summary: `A premium option in ${property.location} with ${property.short_description ?? 'elite amenities'} for a cinematic investor showcase.`,
    image: property.image,
  }));

  return res.status(200).json({ recommendations });
}
