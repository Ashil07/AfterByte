"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { chapters, navigation } from "@/content/chapters";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

/**
 * Fixed header. Transparent over the opening (where the large wordmark lives),
 * solid after it. On desktop the centre shows the current chapter, updated by
 * IntersectionObservers writing directly to the DOM (no React re-render on scroll).
 */
export function SiteHeader() {
  const headerRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;
      // Solid header once the opening no longer reaches into the top 12% of the viewport.
      const hero = document.getElementById("top");
      const heroIo = new IntersectionObserver(([entry]) => (header.dataset.past = String(!entry.isIntersecting)), {
        rootMargin: "0px 0px -88% 0px",
      });
      if (hero) heroIo.observe(hero);
      else header.dataset.past = "true";

      // Current chapter = the section crossing a line 45% down the viewport.
      // IntersectionObserver is unaffected by pin spacing and costs nothing per frame.
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const c = chapters.find((ch) => ch.id === entry.target.id);
            if (!c || !numberRef.current || !titleRef.current || numberRef.current.textContent === c.number) continue;
            numberRef.current.textContent = c.number;
            titleRef.current.textContent = c.title;
            gsap.fromTo(titleRef.current, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.4, overwrite: true });
          }
        },
        { rootMargin: "-45% 0px -55% 0px" },
      );
      chapters.forEach((c) => {
        const el = document.getElementById(c.id);
        if (el) io.observe(el);
      });
      return () => {
        io.disconnect();
        heroIo.disconnect();
      };
    },
    { scope: headerRef },
  );

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Mobile menu: Escape closes, focus stays inside, page does not scroll behind it.
  useEffect(() => {
    if (!open) return;
    const menu = menuRef.current;
    const focusables = () => Array.from(menu?.querySelectorAll<HTMLElement>("a, button") ?? []);
    focusables()[0]?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close();
      if (e.key !== "Tab") return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <header
      ref={headerRef}
      data-past="false"
      className="group/header fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-colors duration-500 data-[past=true]:border-b data-[past=true]:border-line data-[past=true]:bg-ink/92"
    >
      <div className="frame flex h-full items-center justify-between gap-6">
        <a
          href="#top"
          className="relative flex h-11 items-center transition-opacity duration-500 lg:group-data-[past=false]/header:pointer-events-none lg:group-data-[past=false]/header:opacity-0"
          aria-label="AfterByte — back to top"
        >
          <Image src="/brand/wordmark.png" alt="" width={1706} height={514} className="h-6 w-auto" priority />
        </a>

        <p aria-hidden className="label hidden items-center gap-3 text-mute lg:flex">
          <span ref={numberRef} className="text-paper">
            01
          </span>
          <span className="h-px w-6 bg-line-strong" />
          <span ref={titleRef}>Opening</span>
        </p>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-7">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="py-2 text-[0.875rem] text-mute transition-colors duration-300 hover:text-paper"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href="#contact" className="h-10 px-4 text-[0.875rem]">
            Start a project
          </ButtonLink>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="label flex h-11 items-center gap-3 text-paper lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          <span aria-hidden className="relative block h-2.5 w-5">
            <span
              className={cn(
                "absolute left-0 top-0 h-px w-full bg-current transition-transform duration-300",
                open && "translate-y-[5px] rotate-45",
              )}
            />
            <span
              className={cn(
                "absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300",
                open && "-translate-y-[4px] -rotate-45",
              )}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-ink lg:hidden"
      >
        <nav aria-label="Chapters" className="frame flex min-h-full flex-col justify-between gap-10 pb-10 pt-8">
          <ol className="flex flex-col">
            {chapters.slice(1).map((c) => (
              <li key={c.id} className="rule">
                <a href={`#${c.id}`} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-3.5">
                  <span className="label w-6 text-mute">{c.number}</span>
                  <span className="font-serif text-[2rem] leading-none">{c.title}</span>
                </a>
              </li>
            ))}
          </ol>
          <ButtonLink href="#contact" onClick={() => setOpen(false)} className="self-start">
            Start a project
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
