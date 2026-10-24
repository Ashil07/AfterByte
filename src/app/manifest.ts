import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.seoTitle,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#08090b",
    theme_color: "#08090b",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
