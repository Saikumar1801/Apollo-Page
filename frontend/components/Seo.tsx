// frontend/components/Seo.tsx
import Head from 'next/head';

interface SeoProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  keywords?: string; // Though less impactful now, some still use it
  structuredData?: object; // For JSON-LD
}

const Seo: React.FC<SeoProps> = ({
  title,
  description,
  canonicalUrl,
  ogImageUrl = 'https://www.apollo247.com/images/og-image.jpg', // Default Apollo OG image
  keywords = "general physician, internal medicine, doctors, online consultation, book appointment",
  structuredData
}) => {
  const siteName = "Apollo247 Clone"; // Or your site's name
  const fullTitle = `${title} | ${siteName}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl || ''} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl || ''} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImageUrl} />

      {/* Favicon - place in public folder */}
      <link rel="icon" href="/favicon.ico" />
      {/* <link rel="apple-touch-icon" href="/apple-touch-icon.png" /> */}

      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
};

export default Seo;