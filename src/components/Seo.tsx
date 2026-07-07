export function Seo({ title, description }: { title: string; description?: string }) {
  return (
    <>
      <title>{title}</title>
      {description ? <meta name="description" content={description} /> : null}
    </>
  )
}
