import { chapter, type ChapterId } from "@/content/chapters";
import { cn } from "@/lib/cn";

/**
 * Small editorial chapter label: "03 — Complications". Phones and tablets only:
 * on desktop the header already shows the current chapter, so the label is
 * invisible there (it keeps its space, so section spacing is unchanged).
 */
export function ChapterMark({ id, className }: { id: ChapterId; className?: string }) {
  const c = chapter(id);
  return (
    <p className={cn("label flex items-center gap-3 text-mute lg:invisible", className)}>
      <span className="text-paper">{c.number}</span>
      <span aria-hidden className="h-px w-8 bg-line-strong" />
      <span>{c.title}</span>
    </p>
  );
}
