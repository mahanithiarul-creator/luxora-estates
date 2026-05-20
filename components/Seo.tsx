'use client';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { siteMetadata } from '../lib/site-metadata';

type Props = {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  keywords?: string[];
  noIndex?: boolean;
};

export default function Seo({
  title,
  description,
  image,
  type = 'website',
  keywords = ['luxury', 'real estate', '3D', 'portfolio', 'premium', 'property', 'investment'],
  noIndex = false,
}: Props) {
  const router = useRouter();
  const canonicalUrl = `${siteMetadata.siteUrl}${router.asPath.split('?')[0]}`;
  const pageTitle = title ? `${title} | ${siteMetadata.title}` : siteMetadata.title;
  const pageDescription = description || siteMetadata.description;
  const pageImage = image || siteMetadata.image;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: siteMetadata.siteUrl,
    name: siteMetadata.title,
    description: pageDescription,
    publisher: {
      '@type': 'Organization',
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteMetadata.siteUrl}/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:locale" content={siteMetadata.locale} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={`${siteMetadata.siteUrl}${pageImage}`} />
      <meta property="og:image:alt" content="LUXORA ESTATES luxury real estate preview" />
      <meta property="og:site_name" content={siteMetadata.title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={siteMetadata.twitterHandle} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={`${siteMetadata.siteUrl}${pageImage}`} />

      <meta name="theme-color" content="#000000" />
      <link rel="icon" href="/preview.svg" />
      <link rel="preload" href="/preview.svg" as="image" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
    </Head>
  );
}
