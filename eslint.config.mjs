import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// ESLint 9 flat config; eslint-config-next 16 ships native flat arrays (same as apps/web in the SaaS repo).
const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", "out/**", "test-results/**", "next-env.d.ts"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
