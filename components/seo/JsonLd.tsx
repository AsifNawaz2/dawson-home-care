/** Renders JSON-LD nodes (lib/schema.ts) as one <script type="application/ld+json"> each. */
export function JsonLd({ data }: { data: (Record<string, unknown> | null)[] }) {
  return (
    <>
      {data.filter(Boolean).map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON-LD must be raw JSON; "<" is escaped so the text can't close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
