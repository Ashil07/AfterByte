/**
 * The narrative chapters, in page order. Ids are the section anchors.
 *
 * Set `enabled: false` to take a chapter off the page without deleting its
 * component or content. Numbers are assigned to enabled chapters only, so the
 * sequence never skips, and navigation links to hidden chapters disappear.
 */
const allChapters = [
  { id: "top", title: "Opening", enabled: true },
  { id: "vision", title: "The vision", enabled: true },
  { id: "friction", title: "Complications", enabled: true },
  // Off: its closing line (“Where we come in”) now ends chapter 03 instead.
  { id: "turning-point", title: "Turning point", enabled: false },
  { id: "services", title: "What we build", enabled: true },
  // Hidden until real projects are ready — content lives in src/content/projects.ts.
  { id: "work", title: "Selected work", enabled: false },
  // Hidden until real team profiles are ready — content lives in src/content/team.ts.
  { id: "team", title: "The team", enabled: false },
  { id: "approach", title: "Our approach", enabled: true },
  { id: "contact", title: "Next chapter", enabled: true },
] as const;

export type ChapterId = (typeof allChapters)[number]["id"];

export const chapters = allChapters
  .filter((c) => c.enabled)
  .map((c, i) => ({ id: c.id as ChapterId, title: c.title, number: String(i + 1).padStart(2, "0") }));

export function isChapterEnabled(id: ChapterId) {
  return chapters.some((c) => c.id === id);
}

export function chapter(id: ChapterId) {
  const found = chapters.find((c) => c.id === id);
  if (!found) throw new Error(`Chapter "${id}" is not enabled`);
  return found;
}

/** Primary navigation. Links to disabled chapters are dropped automatically. */
export const navigation = (
  [
    { chapter: "services", label: "Services" },
    { chapter: "work", label: "Work" },
    { chapter: "approach", label: "Approach" },
    { chapter: "team", label: "Team" },
  ] as const
)
  .filter((n) => isChapterEnabled(n.chapter))
  .map((n) => ({ href: `#${n.chapter}`, label: n.label }));
