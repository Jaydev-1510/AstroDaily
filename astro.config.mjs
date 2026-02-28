import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

import react from "@astrojs/react";

export default defineConfig({
  image: {
    domains: ["apod.nasa.gov", "astro.build"],
  },

  output: "server",

  adapter: vercel({
    imageService: true,
    isr: {
      exclude: ["/apod", "/random", "/gallery"],
    },
  }),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});