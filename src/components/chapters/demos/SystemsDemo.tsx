import { gsap } from "@/components/motion/gsap";
import { DemoShell } from "./DemoShell";

const inventory = [
  ["Linen shirt · M", "LS-M-01", 12, "In stock"],
  ["Linen shirt · L", "LS-L-01", 3, "Low"],
  ["Denim jacket", "DJ-02", 4, "In stock"],
  ["Cotton tee · S", "CT-S-04", 0, "Reordered"],
  ["Canvas tote", "CT-09", 21, "In stock"],
] as const;

const bookings = [
  ["10:00", "Fitting — R. Nair", "Confirmed"],
  ["12:30", "Pickup — order 1186", "Ready"],
  ["16:00", "Alterations — S. Paul", "Confirmed"],
] as const;

/**
 * Service demo 03 — scattered records settle into an organised dashboard.
 * Fictional shop data.
 */
export function SystemsDemo() {
  return (
    <DemoShell caption="Example dashboard · fictional shop data" className="aspect-[16/10.5]">
      <div className="grid h-full grid-cols-[9em_1fr] border border-line-strong bg-ink">
        <aside data-s-panel className="flex flex-col gap-[0.35em] border-r border-line p-[1.1em] text-[0.95em]">
          <span className="mb-[1em] font-serif text-[1.45em] leading-none">Thread &amp; Co.</span>
          {["Overview", "Bookings", "Inventory", "Invoices", "Customers"].map((n) => (
            <span key={n} className={n === "Overview" ? "text-paper" : "text-mute"}>
              {n === "Overview" && <span className="mr-[0.5em] inline-block size-[0.45em] bg-ice align-middle" />}
              {n}
            </span>
          ))}
        </aside>

        <div className="grid min-h-0 grid-rows-[auto_1fr] gap-[1em] p-[1.2em]">
          <div data-s-panel className="grid grid-cols-3 gap-[0.8em]">
            {[
              ["Bookings today", "3"],
              ["Low stock", "1 item"],
              ["Unpaid invoices", "2"],
            ].map(([k, v]) => (
              <div key={k} className="border border-line px-[0.8em] py-[0.6em]">
                <p className="text-[0.85em] text-mute">{k}</p>
                <p className="font-serif text-[1.8em] leading-none">{v}</p>
              </div>
            ))}
          </div>

          <div className="grid min-h-0 grid-cols-[1.45fr_1fr] gap-[1em]">
            <div className="border border-line">
              <div className="flex justify-between border-b border-line px-[0.8em] py-[0.5em]">
                <span className="text-[0.95em]">Inventory</span>
                <span className="font-mono text-[0.8em] text-mute">synced 09:41</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-[1em] px-[0.8em] pt-[0.5em] font-mono text-[0.75em] uppercase tracking-[0.1em] text-mute">
                <span>Item</span>
                <span>Qty</span>
                <span className="w-[5.5em]">Status</span>
              </div>
              <ul className="px-[0.8em]">
                {inventory.map(([name, sku, qty, status]) => (
                  <li
                    key={sku}
                    data-s-row
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-x-[1em] border-b border-line py-[0.45em] last:border-0"
                  >
                    <span>
                      <span className="block text-[0.95em]">{name}</span>
                      <span className="font-mono text-[0.75em] text-mute">{sku}</span>
                    </span>
                    <span className="font-mono text-[0.95em] text-paper/80">{qty}</span>
                    <span className={`w-[5.5em] text-[0.85em] ${status === "In stock" ? "text-paper/60" : "text-ice"}`}>{status}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex min-h-0 flex-col gap-[1em]">
              <div className="border border-line">
                <div className="border-b border-line px-[0.8em] py-[0.5em] text-[0.95em]">Today</div>
                <ul className="px-[0.8em]">
                  {bookings.map(([t, what, s]) => (
                    <li key={t} data-s-row className="flex gap-[0.8em] border-b border-line py-[0.45em] last:border-0">
                      <span className="font-mono text-[0.85em] text-mute">{t}</span>
                      <span className="flex-1 text-[0.9em]">
                        {what}
                        <span className="block text-[0.85em] text-paper/50">{s}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div data-s-row className="flex items-center justify-between border border-line px-[0.8em] py-[0.6em]">
                <span>
                  <span className="block font-mono text-[0.8em] text-mute">INV-0142</span>
                  <span className="text-[0.95em]">Alterations — S. Paul</span>
                </span>
                <span className="text-[0.85em] text-ice">Paid</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoShell>
  );
}

// Deterministic "loose paper" offsets for each record before it is filed.
const scatter = [
  [-60, -40, -7],
  [80, 30, 5],
  [-30, 70, 3],
  [110, -50, -6],
  [-90, 20, 8],
  [50, 90, -4],
  [-120, -10, 6],
  [70, -80, -5],
  [-40, 50, 4],
];

export function assembleSystems(root: Element) {
  const rows = Array.from(root.querySelectorAll("[data-s-row]"));
  const tl = gsap.timeline({ paused: true });
  tl.from(root.querySelectorAll("[data-s-panel]"), { opacity: 0, duration: 0.6, stagger: 0.15, ease: "power1.out" }).fromTo(
    rows,
    {
      x: (i) => scatter[i % scatter.length][0],
      y: (i) => scatter[i % scatter.length][1],
      rotation: (i) => scatter[i % scatter.length][2],
      opacity: 0.35,
    },
    { x: 0, y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: "power3.inOut", stagger: 0.08 },
    0,
  );
  return tl;
}
