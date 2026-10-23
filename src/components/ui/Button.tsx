import { ArrowRight, ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "text";
type Arrow = "right" | "down" | "up" | "none";

const base =
  "group/btn relative inline-flex items-center gap-3 font-sans text-[0.9375rem] leading-none tracking-[-0.005em] transition-[background-color,color,border-color,transform] duration-300 ease-out-soft select-none disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "h-12 rounded-[2px] bg-paper px-5 text-ink hover:-translate-y-px hover:bg-ice active:translate-y-0",
  outline:
    "h-12 rounded-[2px] border border-line-strong px-5 text-paper hover:-translate-y-px hover:border-paper/60 active:translate-y-0",
  text: "min-h-11 py-2 text-paper after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:scale-x-[0.35] after:bg-current after:transition-transform after:duration-500 after:ease-out-soft hover:after:scale-x-100",
};

const arrows = { right: ArrowRight, down: ArrowDownRight, up: ArrowUpRight } as const;

function ArrowIcon({ arrow }: { arrow: Arrow }) {
  if (arrow === "none") return null;
  const Icon = arrows[arrow];
  const motion =
    arrow === "right"
      ? "group-hover/btn:translate-x-1"
      : arrow === "down"
        ? "group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5"
        : "group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5";
  return (
    <Icon
      aria-hidden
      strokeWidth={1.5}
      className={cn("size-4 shrink-0 transition-transform duration-300 ease-out-soft", motion)}
    />
  );
}

type Common = { variant?: Variant; arrow?: Arrow; children: ReactNode; className?: string };

export function ButtonLink({
  variant = "primary",
  arrow = "right",
  children,
  className,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, variants[variant], className)} {...rest}>
      <span>{children}</span>
      <ArrowIcon arrow={arrow} />
    </a>
  );
}

export function Button({
  variant = "primary",
  arrow = "right",
  children,
  className,
  type = "button",
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      <span>{children}</span>
      <ArrowIcon arrow={arrow} />
    </button>
  );
}
