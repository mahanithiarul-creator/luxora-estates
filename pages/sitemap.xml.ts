import sample from '../lib/sample-data';
import { siteMetadata } from '../lib/site-metadata';
import type { GetServerSidePropsContext } from 'next';

export default function Sitemap() {
  return null;
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  const baseUrl = siteMetadata.siteUrl;
  const pages = ['/', '/properties', '/agents', '/about', '/contact', '/login', '/register', '/dashboard'];
  const urls = pages
    .map((path) => {
      return `  <url>
    <loc>${baseUrl}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`;
    })
    .join('\n');

  const properties = sample.properties
    .map((property) => {
      return `  <url>
    <loc>${baseUrl}/property/${property.id}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
${properties}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(xml);
  res.end();

  return { props: {} };
}
