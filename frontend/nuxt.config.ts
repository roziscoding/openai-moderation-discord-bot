import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  imports: { scan: false },
  ssr: false,
  css: ["~/assets/css/app.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});
