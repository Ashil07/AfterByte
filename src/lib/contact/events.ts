import type { ServiceId } from "@/content/services";

export const SERVICE_EVENT = "afterbyte:select-service";

/** Ask the contact form to preselect a service (sent by service CTAs). */
export function selectService(id: ServiceId) {
  window.dispatchEvent(new CustomEvent<ServiceId>(SERVICE_EVENT, { detail: id }));
}
