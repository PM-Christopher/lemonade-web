// @lemonade/ui
//
// Primitives, not features. If a component knows about an event, tribe,
// wallet or user, it belongs to an app, not here. No component in this
// package may import from @lemonade/api-client. See docs/ARCHITECTURE.md §7.
//
// Admin (dense, desktop) and the user app (spacious, mobile) have real
// visual differences — handle them via token values and variants, not
// forks, and never with an `isAdmin` prop.
//
// TODO(Phase 7): lift the settled shadcn style in here from whichever app
// converges first (admin: new-york, frontend: default — pick one).

export {};
