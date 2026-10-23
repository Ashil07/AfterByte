/**
 * Team members. Only add real people, with their consent, using their own
 * words for bios. Keep `placeholder: true` on empty slots so the UI labels them.
 */
export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  photo: { src: string; alt: string };
  links?: { label: string; href: string }[];
  placeholder?: boolean;
};

export const team: TeamMember[] = [
  {
    name: "Team member",
    role: "Role to be added",
    bio: "Placeholder — a short bio in the person’s own words.",
    photo: { src: "/team/placeholder.webp", alt: "Placeholder portrait" },
    placeholder: true,
  },
  {
    name: "Team member",
    role: "Role to be added",
    bio: "Placeholder — a short bio in the person’s own words.",
    photo: { src: "/team/placeholder.webp", alt: "Placeholder portrait" },
    placeholder: true,
  },
  {
    name: "Team member",
    role: "Role to be added",
    bio: "Placeholder — a short bio in the person’s own words.",
    photo: { src: "/team/placeholder.webp", alt: "Placeholder portrait" },
    placeholder: true,
  },
];
