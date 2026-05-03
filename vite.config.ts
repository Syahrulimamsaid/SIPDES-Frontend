import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    VitePWA({
      outDir: "dist",
      workbox: {
        globDirectory: "dist",
      },
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico"],
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "SIPDES Presensi",
        short_name: "Presensi",
        theme_color: "#4f46e5",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        // icons: [
        //   {
        //     src: "/pwa-192.png",
        //     sizes: "192x192",
        //     type: "image/png",
        //   },
        //   {
        //     src: "/pwa-512.png",
        //     sizes: "512x512",
        //     type: "image/png",
        //   },
        // ],
      },
    }),
  ],
});
