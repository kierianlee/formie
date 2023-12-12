import "./src/env.mjs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const config = {
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/*": path.resolve(__dirname, "src"),
    };

    return config;
  },
};

export default config;
