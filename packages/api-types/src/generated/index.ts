// Barrel for the generated-but-not-yet-consumed output — import from
// "@lemonade/api-types/generated", not the top-level package export, so
// these never collide with the hand-maintained constants in ../routes.ts
// (several groups share a name, e.g. adminAuthRoutes). See this directory's
// sibling tooling/generate-api-types/README.md for why.
export * from "./routes.generated";
export * from "./requests.generated";
