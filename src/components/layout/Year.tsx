"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** Current year, resolved on the client so the page can stay fully prerendered. */
export function Year() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <span suppressHydrationWarning>{year ?? ""}</span>;
}
