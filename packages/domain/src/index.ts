// @lemonade/domain
//
// Pure, synchronous, no React, no network. Mirrors backend rules; never
// originates them — if a rule can't be mirrored (uniqueness, entitlements,
// balance sufficiency), it does not belong here. See docs/ARCHITECTURE.md §7.

export { formatCountry } from "./formatCountry";
