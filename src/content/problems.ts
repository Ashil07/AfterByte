/**
 * Chapter 03 — the everyday complications. Each problem has a "messy" interface
 * fragment and a "clean" counterpart (see components/chapters/friction/faces.tsx).
 * `chaos` positions the fragment during the pinned accumulation on desktop,
 * relative to its final grid cell: x/y in % of the stage, r in degrees.
 */
export type Problem = {
  id: "visibility" | "bookings" | "stock" | "repetition" | "direction";
  problem: string;
  solution: string;
  chaos: { x: number; y: number; r: number };
};

export const problems: Problem[] = [
  {
    id: "visibility",
    problem: "Customers can’t find you online.",
    solution: "Found, understood, booked.",
    chaos: { x: 6, y: -8, r: -5 },
  },
  {
    id: "bookings",
    problem: "Bookings and payments are lost in chats.",
    solution: "Every booking in one place.",
    chaos: { x: 38, y: -42, r: 4 },
  },
  {
    id: "stock",
    problem: "Stock and daily work live in spreadsheets.",
    solution: "Stock you can trust.",
    chaos: { x: -14, y: -10, r: -3 },
  },
  {
    id: "repetition",
    problem: "Repetitive tasks eat up your day.",
    solution: "Routine work, handled.",
    chaos: { x: 16, y: -20, r: 6 },
  },
  {
    id: "direction",
    problem: "A good idea with no clear next step.",
    solution: "A clear first version.",
    chaos: { x: -38, y: -50, r: -6 },
  },
];
