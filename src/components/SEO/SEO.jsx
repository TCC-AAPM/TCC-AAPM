import { Helmet } from "react-helmet-async";

const SITE_NAME = "SISTEMA DE GESTAO E CONTROLE DE ARMARIOS DA AAPM";
const BASE_URL = "https://SEUDOMINIO.com.br";
const DEFAULT_IMAGE = `${BASE_URL}/src/assets/images/AAPM-Logo.png`;

export default function SEO({ title, description, path = "/" }) {
  const pageTitle = title
    ? `${title} | SENAI Osasco`
    : `${SITE_NAME} | SENAI Osasco`;
  const canonical = `${BASE_URL}${path === "/" ? "/" : path}`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={DEFAULT_IMAGE} />
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}
