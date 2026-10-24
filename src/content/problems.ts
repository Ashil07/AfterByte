/**
 * Chapter 03 — the everyday complications. Each problem has a "messy" interface
 * fragment and a "clean" counterpart (see components/chapters/friction/faces.tsx).
 * `chaos` positions the fragment during the pinned accumulation on desktop,
 * relative to its final grid cell: x in % of the stage width, y in % of the
 * free height above the card row (-100 = top of the stage), r in degrees.
 *
 * The layout keeps text readable: each fragment stays over its own column, so
 * no two cross paths when they straighten. 04 and 05 rise into the empty
 * top-right beside the headline; 01–03 only tilt and jostle in place, because
 * the headline sits directly above them. Check several viewport sizes after
 * changing (1280×720 is the tightest).
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
    chaos: { x: -1, y: -3, r: -5 },
  },
  {
    id: "bookings",
    problem: "Bookings and payments are lost in chats.",
    solution: "Every booking in one place.",
    chaos: { x: 1, y: -9, r: 4 },
  },
  {
    id: "stock",
    problem: "Stock and daily work live in spreadsheets.",
    solution: "Stock you can trust.",
    chaos: { x: 1, y: -2, r: -4 },
  },
  {
    id: "repetition",
    problem: "Repetitive tasks eat up your day.",
    solution: "Routine work, handled.",
    chaos: { x: 1, y: -92, r: 5 },
  },
  {
    id: "direction",
    problem: "A good idea with no clear next step.",
    solution: "A clear first version.",
    chaos: { x: 2, y: -58, r: -6 },
  },
];
