import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="frame flex min-h-[80svh] flex-col justify-end pb-20 pt-40">
      <p className="label text-mute">404 — Page not found</p>
      <h1 className="display-l mt-6 max-w-[14ch]">This chapter hasn’t been written.</h1>
      <p className="mt-6 max-w-[40ch] text-paper/70">The page you were looking for doesn’t exist or has moved.</p>
      <ButtonLink href="/" className="mt-10 self-start">
        Back to the beginning
      </ButtonLink>
    </section>
  );
}
