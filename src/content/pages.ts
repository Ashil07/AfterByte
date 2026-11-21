/**
 * The site's pages, in reading order. The “Next chapter” panel above the
 * footer and the page-transition label read from this list. To add a page
 * (e.g. /about), add it here and create app/<slug>/page.tsx.
 */
export const pages = [
  { href: "/", title: "The story" },
  { href: "/work", title: "Selected work" },
  { href: "/contact", title: "Start a project" },
] as const;

/** Title shown while the transition covers the screen. */
export function pageTitle(pathname: string) {
  if (pathname.startsWith("/services/")) return "What we build";
  return pages.find((p) => p.href === pathname)?.title ?? "AfterByte";
}

/**
 * Where the “Next chapter” panel at the very bottom leads (scroll past the end,
 * or click it): Home → Work → Contact → back to Home; service pages → Contact.
 * Leaving Contact keeps a half-filled form: visited pages stay mounted (Activity).
 */
export function nextPage(pathname: string): { href: string; title: string } | null {
  if (pathname === "/") return pages[1];
  if (pathname === "/contact") return { href: "/", title: "Back to the beginning" };
  if (pathname === "/work" || pathname.startsWith("/services/")) return pages[2];
  return null;
}
