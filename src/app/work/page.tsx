import type { Metadata } from "next";
import { Work } from "@/components/chapters/Work";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Selected work",
  description: `Websites, apps and business systems designed and built by AfterByte, ${site.location.city} (${site.location.cityAlt}).`,
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return <Work page />;
}
