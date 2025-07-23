import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "KNHS OnTime Pomodoro",
        short_name: "OnTime.",
        start_url: "/",
        id: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#be3d2a",
        icons: [
          {
            src: "/pwdTomato-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwdTomato-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "./screenshot1.png",
            sizes: "1920x1080",
            type: "image/png",
            title: "Focus on your tasks with Pomodoro",
            description:
              "A simple and effective way to manage your time and tasks.",
            form_factor: "wide",
          },
          {
            src: "./screenshot2.png",
            sizes: "562x1280",
            type: "image/png",
            title: "Track your progress",
            description: "Keep track of your completed tasks and Pomodoros.",
            form_factor: "narrow",
          },
        ],
      },
    }),
  ],
});
