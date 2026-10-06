import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Pin the workspace root to this app (no package.json further up the tree).
  turbopack: { root: fileURLToPath(new URL(".", import.meta.url)) },
  // Bundle shiki instead of linking it as an external package: on Windows, Turbopack's junction
  // for external packages fails on a cold `.next` ("failed to create junction point").
  transpilePackages: ["shiki"],
};

export default nextConfig;
