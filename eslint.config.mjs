import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      // Duplicate keys in the locale dictionaries silently dropped ~100 strings once.
      "no-dupe-keys": "error",
    },
  },
  {
    // Playwright fixtures call `use()`, which is not a React hook.
    files: ["e2e/**"],
    rules: { "react-hooks/rules-of-hooks": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "e2e/node_modules/**",
    "e2e/playwright-report/**",
    "e2e/test-results/**",
  ]),
]);

export default eslintConfig;
