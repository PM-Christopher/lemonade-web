// Maps a Laravel validation rule token list (as introspect.php dumps them —
// see FormRequest::rules()) to a TypeScript type. Deliberately conservative:
// an unrecognized token falls through to `unknown` rather than guessing,
// since a wrong generated type is worse than an honest "we don't know".

const BASE_TYPE_BY_RULE = {
  string: "string",
  email: "string",
  password: "string",
  url: "string",
  uuid: "string",
  date: "string",
  date_format: "string",
  digits: "string",
  digits_between: "string",
  integer: "number",
  numeric: "number",
  decimal: "number",
  boolean: "boolean",
  array: "unknown[]",
  file: "unknown",
  image: "unknown",
  mimes: "unknown",
};

/** @param {string[]} tokens */
export function inferFieldType(tokens) {
  const bases = tokens.map((t) => t.split(":")[0].toLowerCase());

  const inToken = tokens.find((t) => t.toLowerCase().startsWith("in:"));
  if (inToken) {
    const options = inToken.slice(3).split(",").filter(Boolean);
    if (options.length > 0) {
      return options.map((opt) => JSON.stringify(opt)).join(" | ");
    }
  }

  for (const base of bases) {
    if (BASE_TYPE_BY_RULE[base]) {
      return BASE_TYPE_BY_RULE[base];
    }
  }

  return "unknown";
}

/** @param {string[]} tokens */
export function isOptional(tokens) {
  const bases = tokens.map((t) => t.split(":")[0].toLowerCase());
  return bases.some(
    (b) =>
      b === "sometimes" ||
      b === "nullable" ||
      b.startsWith("required_if") ||
      b.startsWith("required_unless") ||
      b.startsWith("required_with") ||
      b.startsWith("required_without"),
  );
}

/** @param {string[]} tokens */
export function isNullable(tokens) {
  return tokens.some((t) => t.split(":")[0].toLowerCase() === "nullable");
}
