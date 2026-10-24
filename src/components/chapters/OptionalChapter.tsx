"use client";

import dynamic from "next/dynamic";

// Chapters that can be switched off in src/content/chapters.ts. Loaded through
// client-side dynamic imports, so their code only downloads when one is enabled
// and rendered (a server-side dynamic import still ships the chunk).
const views = {
  "turning-point": dynamic(() => import("./TurningPoint").then((m) => m.TurningPoint)),
  work: dynamic(() => import("./Work").then((m) => m.Work)),
  team: dynamic(() => import("./Team").then((m) => m.Team)),
};

export function OptionalChapter({ id }: { id: keyof typeof views }) {
  const View = views[id];
  return <View />;
}
