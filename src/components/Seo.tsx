export function Seo({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
      <meta property="og:title" content={title} />
      <meta property="og:type" content="website" />
      {description ? <meta property="og:description" content={description} /> : null}
    </>
  )
}
