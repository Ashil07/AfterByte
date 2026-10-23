"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="frame flex min-h-[80svh] flex-col justify-end pb-20 pt-40">
      <p className="label text-mute">Something went wrong</p>
      <h1 className="display-l mt-6 max-w-[14ch]">We lost the thread for a moment.</h1>
      <p className="mt-6 max-w-[40ch] text-paper/70">An unexpected error stopped this page from loading. Please try again.</p>
      <Button onClick={reset} className="mt-10 self-start">
        Try again
      </Button>
    </section>
  );
}
