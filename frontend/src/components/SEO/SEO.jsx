import { Helmet } from "react-helmet-async";

const SITE_NAME = "AAPM SENAI Osasco";
const BASE_URL = "https://sitesin.com.br";
const DEFAULT_IMAGE = `${BASE_URL}/src/assets/images/AAPM-Logo.png`;

export default function SEO({ title, description, path = "/", noIndex = false }) {
  const pageTitle = title
    ? `${title} | ${SITE_NAME}`
    : SITE_NAME;
  const canonical = `${BASE_URL}${path === "/" ? "/" : path}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}
