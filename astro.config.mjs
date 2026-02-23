import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  adapter: vercel({
    imageService: true,
    isr: {
      exclude: ["/apod"],
    },
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
