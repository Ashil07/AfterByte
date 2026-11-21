import type { ServiceId } from "@/content/services";
import { serviceValues } from "./schema";

/** Link to the contact page, optionally with a service preselected in the form. */
export function contactHref(service?: ServiceId) {
  return service ? `/contact?service=${service}` : "/contact";
}

/** The service named in the URL (`?service=app`), if it is a valid one. */
export function serviceFromUrl(search: string): string {
  const id = new URLSearchParams(search).get("service") ?? "";
  return (serviceValues as readonly string[]).includes(id) ? id : "";
}
