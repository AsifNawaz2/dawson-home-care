/**
 * A photo that hasn't arrived yet (11_ASSET_PLACEHOLDERS): a calm plum-100 frame with the
 * logo mark, and — only while placeholders are on — the planned photo's label. Decorative until
 * the real photo (same file name) replaces it, so it carries no alt text that would describe a
 * picture that isn't there.
 */
import { flags } from "@/content/site.config";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/cn";

export function PhotoSlot({
  label,
  ratio = "16/9",
  className,
}: {
  label: string;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col gap-2", className)}>
      <div
        aria-hidden="true"
        style={{ aspectRatio: ratio }}
        className="flex w-full items-center justify-center overflow-hidden rounded-[20px] bg-plum-100"
      >
        <Logo variant="mark" uid={`ps-${label.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`} className="h-auto w-[28%] max-w-[180px] opacity-90" />
      </div>
      {flags.showPlaceholders && <figcaption className="sm muted">{label}</figcaption>}
    </figure>
  );
}
