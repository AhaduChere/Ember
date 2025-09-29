import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      dirs: ["src/components", "src/pages"],
      deep: true,
      extensions: ["vue"],
    }),
  ],
});
