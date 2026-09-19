// Barrel for the generated output — import from "@lemonade/api-types/generated",
// not the top-level package export, so these never collide with the
// hand-maintained constants in ../routes.ts (several groups share a name,
// e.g. adminAuthRoutes) while any call site still hasn't migrated off it.
// See this directory's sibling tooling/generate-api-types/README.md.
export * from "./routes.generated";
export * from "./requests.generated";
export { buildPath } from "../build-path";
