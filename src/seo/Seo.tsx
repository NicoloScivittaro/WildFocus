import { Helmet } from 'react-helmet-async'

interface SeoProps {
  title: string
  description: string
  path?: string
  jsonLd?: Record<string, unknown>
}

const SITE_URL_PLACEHOLDER = '[URL SITO WILDFOCUS]'

export function Seo({ title, description, path = '/', jsonLd }: SeoProps) {
  const url = `${SITE_URL_PLACEHOLDER}${path}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
