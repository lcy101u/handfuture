import path from "node:path";
import { fileURLToPath } from "node:url";
import { configDefaults, defineConfig } from "vitest/config";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: { alias: { "@": path.resolve(projectRoot, "src") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    // Codex worktrees under .worktrees/ carry their own checkout and
    // node_modules. Collecting their tests loads a second copy of React
    // while `@` still aliases to this checkout's src, which breaks every
    // hook-using render. git ignores them; vitest does not, so exclude
    // them explicitly.
    exclude: [...configDefaults.exclude, "**/.worktrees/**"],
  },
});
