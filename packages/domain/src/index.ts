// @lemonade/domain
//
// Pure, synchronous, no React, no network. Mirrors backend rules; never
// originates them — if a rule can't be mirrored (uniqueness, entitlements,
// balance sufficiency), it does not belong here. See docs/ARCHITECTURE.md §7.

export { formatCountry } from "./formatCountry";
export {
  applyFormat,
  countWords,
  insertMedia,
  isSafeUrl,
  MAX_DESCRIPTION_WORDS,
  MAX_INDENT,
  parseBlocks,
  parseInline,
  type Block,
  type Edit,
  type FormatKind,
  type InlinePart,
  type Line,
} from "./richText";
