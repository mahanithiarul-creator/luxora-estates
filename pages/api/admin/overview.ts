import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseAdminClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const [{ count: bookingCount, error: bookingError }, { count: inquiryCount, error: inquiryError }, { count: propertyCount, error: propertyError }, { count: favoriteCount, error: favoriteError }] = await Promise.all([
    supabaseAdmin.from('bookings').select('id', { count: 'exact'}),
    supabaseAdmin.from('inquiries').select('id', { count: 'exact'}),
    supabaseAdmin.from('properties').select('id', { count: 'exact'}),
    supabaseAdmin.from('favorites').select('id', { count: 'exact'}),
  ]);

  if (bookingError || inquiryError || propertyError || favoriteError) {
    return res.status(500).json({
      error: bookingError?.message || inquiryError?.message || propertyError?.message || favoriteError?.message,
    });
  }

  const { data: recentInquiries } = await supabaseAdmin.from('inquiries').select('id,name,email,property_id,created_at').order('created_at', { ascending: false }).limit(5);
  const { data: recentBookings } = await supabaseAdmin.from('bookings').select('id,name,email,property_id,booking_date,status,created_at').order('created_at', { ascending: false }).limit(5);

  return res.status(200).json({
    bookings: bookingCount ?? 0,
    inquiries: inquiryCount ?? 0,
    properties: propertyCount ?? 0,
    favorites: favoriteCount ?? 0,
    recentInquiries: recentInquiries ?? [],
    recentBookings: recentBookings ?? [],
  });
}
