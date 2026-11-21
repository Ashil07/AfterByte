/**
 * The visible element with this id, if any. With `cacheComponents`, Next keeps
 * previously visited pages mounted but hidden (React Activity), so an id can
 * exist more than once in the document; only the current page's copy is laid out.
 */
export function visibleById(id: string): HTMLElement | null {
  for (const el of document.querySelectorAll<HTMLElement>(`[id="${id}"]`)) {
    if (el.getClientRects().length > 0) return el;
  }
  return null;
}
