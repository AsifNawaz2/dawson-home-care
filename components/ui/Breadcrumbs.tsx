/** Breadcrumb trail (design 03-personal-care "crumbs"). The last item is the current page. */
import Link from "next/link";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs sm pt-2 lg:pt-4">
      <ol className="flex flex-wrap items-center gap-x-2.5">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted">
                ›
              </span>
            )}
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page" className="font-semibold text-plum-800">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
