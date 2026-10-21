import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { mergeConfig, defineConfig } from "vitest/config";
import base from "@lemonade/config/vitest.base";

// SVG imports render as an empty component in tests.
const svgAsComponent = {
  name: "svg-as-component",
  enforce: "pre" as const,
  load(id: string) {
    return id.endsWith(".svg") ? "export default function Svg() { return null; }" : null;
  },
};

export default mergeConfig(
  base,
  defineConfig({
    plugins: [svgAsComponent, react()],
    test: {
      environment: "jsdom",
      setupFiles: ["./vitest.setup.ts"],
      // App code isn't gated on coverage — see CLAUDE.md's Testing
      // Requirements ("no coverage threshold on app code as a merge
      // gate"). The 90% bar in @lemonade/config/vitest.base is for
      // packages/*.
      coverage: { enabled: false },
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  }),
);
