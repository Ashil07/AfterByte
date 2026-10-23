import { Check, Search } from "lucide-react";
import type { ReactNode } from "react";
import type { Problem } from "@/content/problems";
import { cn } from "@/lib/cn";

/*
 * Interface fragments for chapter 03. Every fragment has a messy face (the
 * problem) and a clean face (the same job, handled by a better system).
 * All names and numbers are fictional sample data. Faces are decorative
 * (aria-hidden); the caption next to each card carries the meaning.
 */

function Frame({ app, meta, children, className }: { app: string; meta?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-full flex-col overflow-hidden border border-line bg-ink-2 text-[0.75rem] leading-snug", className)}>
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="label text-[0.625rem] text-mute">{app}</span>
        {meta}
      </div>
      <div className="min-h-0 flex-1 p-3">{children}</div>
    </div>
  );
}

const Dot = ({ className }: { className?: string }) => <span className={cn("inline-block size-1.5 rounded-full", className)} />;

/* ---------------------------------- messy --------------------------------- */

function SearchMessy() {
  return (
    <Frame app="Search">
      <div className="flex items-center gap-2 border border-line px-2 py-1.5 text-paper/80">
        <Search aria-hidden className="size-3 text-mute" strokeWidth={1.5} />
        custom cakes near me
      </div>
      <ul className="mt-2.5 space-y-2">
        <li>
          <p className="text-ice/90">Sweet Layers Bakery</p>
          <p className="text-mute">Order online · Open now</p>
        </li>
        <li>
          <p className="text-ice/90">The Cake Room</p>
          <p className="text-mute">Menu · Reviews · Directions</p>
        </li>
        <li className="border-t border-dashed border-line pt-2 opacity-50">
          <p className="text-paper/70">Your business</p>
          <p className="text-mute">No website · page 3</p>
        </li>
      </ul>
    </Frame>
  );
}

function MessagesMessy() {
  const msgs = [
    ["Hi! is sat 4pm still free?", "9:12"],
    ["sent the advance, pls check", "10:41"],
    ["can we do sunday instead??", "11:03"],
    ["Hello?", "13:20"],
  ];
  return (
    <Frame app="Messages" meta={<span className="label rounded-[2px] bg-paper px-1.5 text-[0.625rem] text-ink">14</span>}>
      <ul className="space-y-1.5">
        {msgs.map(([m, t], i) => (
          <li key={t} className={cn("flex items-end gap-2", i % 2 === 1 && "pl-4")}>
            <span className="rounded-[10px] rounded-bl-[2px] bg-ink-3 px-2.5 py-1.5 text-paper/85">{m}</span>
            <span className="font-mono text-[0.625rem] text-mute">{t}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function SheetMessy() {
  const rows = [
    ["Linen shirt M", "12", "?"],
    ["Linen shirt L", "#REF!", ""],
    ["Denim jacket", "4", "ask R."],
    ["Cotton tee S", "-2", "??"],
  ];
  return (
    <Frame app="stock_FINAL_v3 (2).xlsx" className="font-mono">
      <table className="w-full border-collapse text-[0.6875rem]">
        <thead>
          <tr className="text-mute">
            {["Item", "Qty", "Note"].map((h) => (
              <th key={h} className="border border-line px-1.5 py-1 text-left font-normal">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={cn(
                    "border border-line px-1.5 py-1 text-paper/75",
                    (c === "#REF!" || c === "-2") && "bg-warm/10 text-warm",
                  )}
                >
                  {c || " "}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Frame>
  );
}

function RemindersMessy() {
  const items = ["Copy today’s orders into the sheet", "Send payment reminders (6)", "Reply again: “Open on Sunday?”", "Update stock after delivery"];
  return (
    <Frame app="Reminders" meta={<span className="font-mono text-[0.625rem] text-mute">4 overdue</span>}>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li
            key={it}
            className="flex items-start gap-2 border border-line bg-ink px-2 py-1.5 text-paper/80"
            style={{ marginLeft: `${(i % 2) * 6}px` }}
          >
            <span aria-hidden className="mt-1 size-2 shrink-0 rounded-full border border-mute" />
            {it}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function NoteMessy() {
  return (
    <div className="flex h-full flex-col bg-warm p-4 text-ink shadow-[0_1px_0_rgba(0,0,0,0.2)]">
      <p className="font-serif text-[1.375rem] italic leading-none">app idea —</p>
      <p className="mt-2.5 font-serif text-[1.0625rem] italic leading-tight text-ink/80">loyalty card? bookings? both??</p>
      <p className="mt-1.5 font-serif text-[1.0625rem] italic leading-tight text-ink/50 line-through">website first or app first</p>
      <p className="mt-auto font-serif text-[1.0625rem] italic leading-tight text-ink/80">where do I even start</p>
    </div>
  );
}

/* ---------------------------------- clean --------------------------------- */

function SearchClean() {
  return (
    <Frame app="Search" meta={<span className="font-mono text-[0.625rem] text-ice">1st result</span>}>
      <p className="font-mono text-[0.625rem] text-mute">yourbusiness.com</p>
      <p className="mt-0.5 text-[0.875rem] text-ice">Your business — custom cakes, made to order</p>
      <p className="mt-1 text-mute">Open today 9:00–19:00 · Order online for pickup or delivery.</p>
      <div className="mt-2.5 flex gap-1.5">
        {["Menu", "Order", "Visit"].map((s) => (
          <span key={s} className="border border-line px-2 py-1 text-paper/80">
            {s}
          </span>
        ))}
      </div>
    </Frame>
  );
}

function BookingsClean() {
  const rows = [
    ["Sat 26", "16:00", "Priya S.", "Paid", "bg-ice"],
    ["Sun 27", "11:00", "Arjun K.", "Confirmed", "bg-paper"],
    ["Sun 27", "14:30", "Meera T.", "Deposit due", "bg-warm/60"],
  ];
  return (
    <Frame app="Bookings" meta={<span className="font-mono text-[0.625rem] text-mute">This week</span>}>
      <ul className="divide-y divide-line">
        {rows.map(([d, t, n, s, c]) => (
          <li key={n} className="grid grid-cols-[3.25rem_1fr_auto] items-center gap-2 py-1.5">
            <span className="font-mono text-[0.6875rem] text-mute">
              {d}
              <br />
              {t}
            </span>
            <span className="text-paper/90">{n}</span>
            <span className="flex items-center gap-1.5 text-paper/70">
              <Dot className={c} />
              {s}
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function InventoryClean() {
  const rows: [string, number, string?][] = [
    ["Linen shirt · M", 12],
    ["Linen shirt · L", 3, "Low"],
    ["Denim jacket", 4],
    ["Cotton tee · S", 0, "Reordered"],
  ];
  return (
    <Frame app="Inventory" meta={<span className="font-mono text-[0.625rem] text-mute">Updated just now</span>}>
      <ul className="space-y-2">
        {rows.map(([name, qty, flag]) => (
          <li key={name}>
            <div className="flex items-baseline justify-between">
              <span className="text-paper/90">{name}</span>
              <span className="font-mono text-[0.6875rem] text-paper/70">{flag ? <span className="text-ice">{flag}</span> : qty}</span>
            </div>
            <div className="mt-1 h-px bg-line">
              <div className="h-px bg-paper/60" style={{ width: `${Math.min(100, (qty / 12) * 100)}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function AutomationClean() {
  const rows = [
    ["Order saved to records", "09:14"],
    ["Payment reminders sent", "09:15"],
    ["Opening hours auto-reply", "09:20"],
    ["Stock updated from delivery", "11:02"],
  ];
  return (
    <Frame app="Automations" meta={<span className="flex items-center gap-1.5 font-mono text-[0.625rem] text-ice"><Dot className="bg-ice" />Running</span>}>
      <ul className="space-y-2">
        {rows.map(([r, t]) => (
          <li key={r} className="flex items-center gap-2">
            <Check aria-hidden className="size-3 shrink-0 text-ice" strokeWidth={2} />
            <span className="flex-1 text-paper/85">{r}</span>
            <span className="font-mono text-[0.625rem] text-mute">{t}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

function PlanClean() {
  return (
    <Frame app="Project plan" meta={<span className="font-mono text-[0.625rem] text-mute">v1</span>}>
      <p className="font-serif text-[1.125rem] leading-none text-paper">First version</p>
      <ul className="mt-2.5 space-y-1.5">
        {["Customer booking page", "Staff calendar", "Payment links"].map((s) => (
          <li key={s} className="flex items-center gap-2 text-paper/85">
            <span aria-hidden className="size-2.5 border border-ice/80 bg-ice/20" />
            {s}
          </li>
        ))}
      </ul>
      <p className="mt-2.5 border-t border-line pt-2 text-mute">Later: loyalty card</p>
    </Frame>
  );
}

export const messyFaces: Record<Problem["id"], () => ReactNode> = {
  visibility: SearchMessy,
  bookings: MessagesMessy,
  stock: SheetMessy,
  repetition: RemindersMessy,
  direction: NoteMessy,
};

export const cleanFaces: Record<Problem["id"], () => ReactNode> = {
  visibility: SearchClean,
  bookings: BookingsClean,
  stock: InventoryClean,
  repetition: AutomationClean,
  direction: PlanClean,
};
