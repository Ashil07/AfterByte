import type { Metadata } from "next";
import { Contact } from "@/components/chapters/contact/Contact";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact — start a project",
  description: `Tell us about your project. AfterByte, ${site.location.city}, ${site.location.region}: call ${site.phone.display}, message us on WhatsApp or send the form.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <Contact page />;
}
