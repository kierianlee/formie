import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "formie",
    name: "formie",
    description: "Zero setup form backend.",
    display: "standalone",
    orientation: "portrait",
    icons: [
      {
        src: "/logo-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    start_url: "/",
    theme_color: "#75bd82",
    background_color: "#1b1b1c",
  };
}
