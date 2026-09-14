// @lemonade/domain
//
// Pure, synchronous, no React, no network. Mirrors backend rules; never
// originates them — if a rule can't be mirrored (uniqueness, entitlements,
// balance sufficiency), it does not belong here. See docs/ARCHITECTURE.md §7.

/**
 * Formats a minor-unit integer amount (matching `App\Support\Money`) as a
 * display string. The backend never sends floats for money — neither should
 * this function ever compute one; it only formats what the server sent.
 *
 * TODO(Phase 5): implement against the real currency list and locale rules.
 */
export function formatMoney(minorUnits: number, currency: string): string {
  const amount = minorUnits / 100;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format(amount);
}

export { formatCountry } from "./formatCountry";
export { checkError, handleTest } from "./checkError";
