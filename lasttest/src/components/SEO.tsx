import { Helmet } from 'react-helmet-async';
import {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  SITE_URL,
  OG_IMAGE,
  SITE_NAME,
} from '../lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
  type?: string;
  children?: React.ReactNode;
}

export default function SEO({
  title,
  description,
  pathname = '',
  image = OG_IMAGE,
  type = 'website',
  children,
}: SEOProps) {
  const fullTitle = title || DEFAULT_TITLE;
  const canonical = `${SITE_URL}${pathname}`;
  const desc = description || DEFAULT_DESCRIPTION;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_KE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={image} />

      {children}
    </Helmet>
  );
}
