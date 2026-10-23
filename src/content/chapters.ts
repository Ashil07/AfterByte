/** The narrative chapters, in page order. Ids are the section anchors. */
export const chapters = [
  { id: "top", number: "01", title: "Opening" },
  { id: "vision", number: "02", title: "The vision" },
  { id: "friction", number: "03", title: "Complications" },
  { id: "turning-point", number: "04", title: "Turning point" },
  { id: "services", number: "05", title: "What we build" },
  { id: "work", number: "06", title: "Selected work" },
  { id: "team", number: "07", title: "The team" },
  { id: "approach", number: "08", title: "Our approach" },
  { id: "contact", number: "09", title: "Next chapter" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export function chapter(id: ChapterId) {
  const found = chapters.find((c) => c.id === id);
  if (!found) throw new Error(`Unknown chapter: ${id}`);
  return found;
}

/** Primary navigation. */
export const navigation = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#approach", label: "Approach" },
  { href: "#team", label: "Team" },
] as const;
