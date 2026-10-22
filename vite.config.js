import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    // keep the CRA output folder so firebase.json and the Dockerfiles still work
    outDir: "build",
  },
});
