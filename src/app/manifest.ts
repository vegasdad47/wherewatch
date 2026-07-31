import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WhereWatch",
    short_name: "WhereWatch",
    description: "Find where movies and TV shows are streaming, renting, or available to buy.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0f",
    theme_color: "#3b82f6",
    orientation: "portrait-primary",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
