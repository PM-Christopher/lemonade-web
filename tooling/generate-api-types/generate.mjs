#!/usr/bin/env node
// Generates route constants + request-body interfaces from a lemonade-backend
// route manifest (see introspect.php).
//
// Usage:
//   php introspect.php /path/to/lemonade-backend | node generate.mjs
//   node generate.mjs --manifest ./manifest.snapshot.json
//   node generate.mjs --backend /path/to/lemonade-backend
//
// Writes packages/api-types/src/generated/{routes,requests}.generated.ts.
// These are the canonical route-constant source for both apps — see this
// directory's README.
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { inferFieldType, isOptional, isNullable } from "./rules-to-type.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..", "..");
const outDir = join(repoRoot, "packages", "api-types", "src", "generated");

function readManifest() {
  const args = process.argv.slice(2);
  const backendIdx = args.indexOf("--backend");
  const manifestIdx = args.indexOf("--manifest");

  if (backendIdx !== -1) {
    const backendPath = args[backendIdx + 1];
    const json = execFileSync("php", [join(__dirname, "introspect.php"), backendPath], {
      maxBuffer: 1024 * 1024 * 32,
    });
    return JSON.parse(json.toString());
  }

  if (manifestIdx !== -1) {
    return JSON.parse(readFileSync(args[manifestIdx + 1], "utf8"));
  }

  if (!process.stdin.isTTY) {
    return JSON.parse(readFileSync(0, "utf8"));
  }

  throw new Error(
    "No manifest input — pass --backend <path>, --manifest <file>, or pipe JSON on stdin.",
  );
}

function toUpperSnake(segment) {
  return segment.replace(/-/g, "_").toUpperCase();
}

// "v1.admin.account.change-password" -> group "v1.admin.account", key "CHANGE_PASSWORD"
function splitRouteName(name) {
  const parts = name.split(".");
  const group = parts.slice(0, 3).join(".");
  const rest = parts.slice(3);
  const key = rest.length > 0 ? rest.map(toUpperSnake).join("_") : "BASE";
  return { group, key };
}

function groupConstName(group) {
  // "v1.admin.account" -> adminAccountRoutes
  const [, guard, domain] = group.split(".");
  const domainPascal = domain
    .split(/[-_]/)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  return `${guard}${domainPascal}Routes`;
}

function buildRouteGroups(manifest) {
  const groups = new Map(); // groupConstName -> { path, method }[keyed by KEY]

  for (const route of manifest) {
    if (!route.name) continue; // unnamed routes (webhooks etc.) aren't callable by a stable constant
    const { group, key } = splitRouteName(route.name);
    const constName = groupConstName(group);

    if (!groups.has(constName)) groups.set(constName, new Map());
    const entries = groups.get(constName);

    // Laravel route names are unique per route, but guard against a
    // (method, name) collision producing the same derived key anyway.
    let finalKey = key;
    let suffix = 2;
    while (entries.has(finalKey) && entries.get(finalKey).path !== route.uri.replace(/^\/v1/, "")) {
      finalKey = `${key}_${route.method}${suffix > 2 ? suffix : ""}`;
      suffix++;
    }

    entries.set(finalKey, { path: route.uri.replace(/^\/v1/, ""), method: route.method });
  }

  return groups;
}

function renderRoutesFile(groups) {
  const lines = [
    "// GENERATED FILE — do not hand-edit. Run `node tooling/generate-api-types/generate.mjs`.",
    "// Source: lemonade-backend's registered v1/* routes (introspect.php).",
    "//",
    "// Canonical route-constant source for both apps — import from",
    '// "@lemonade/api-types/generated", not the top-level package export.',
    "// See this directory's README.",
    "",
  ];

  for (const [constName, entries] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`export const ${constName} = Object.freeze({`);
    for (const [key, { path, method }] of [...entries.entries()].sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      lines.push(`  ${key}: "${path}", // ${method}`);
    }
    lines.push("});", "");
  }

  return lines.join("\n");
}

function classBasename(fqcn) {
  const parts = fqcn.split("\\");
  return parts[parts.length - 1];
}

// Laravel dot-notation field paths ("settings.email", "tickets.*.id") need
// real nesting, not a flat property literally named "tickets.*.id" — builds
// an object/array/leaf tree from the flat { path: tokens } map so each path
// segment becomes a real nested property, and a "*" segment means "the
// preceding key is an array of the following shape".
function buildFieldTree(fields) {
  const root = { kind: "object", children: new Map() };

  for (const [path, tokens] of Object.entries(fields)) {
    const segments = path.split(".");
    let node = root;

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg === "*") continue; // consumed via lookahead below; a leading "*" (malformed) is just skipped
      const isLast = i === segments.length - 1;
      const nextIsWildcard = segments[i + 1] === "*";

      if (nextIsWildcard) {
        // seg is an array of whatever the segments after "*" describe.
        let child = node.children.get(seg);
        if (!child || child.kind !== "array") {
          child = {
            kind: "array",
            of: { kind: "object", children: new Map() },
            optional: child ? child.optional : false,
          };
          node.children.set(seg, child);
        }
        node = child.of;
        continue;
      }

      if (isLast) {
        const optional = isOptional(tokens);
        let tsType = inferFieldType(tokens);
        if (isNullable(tokens) && !optional) tsType += " | null";
        node.children.set(seg, { kind: "leaf", tsType, optional });
      } else {
        let child = node.children.get(seg);
        if (!child || child.kind !== "object") {
          child = { kind: "object", children: new Map(), optional: child ? child.optional : false };
          node.children.set(seg, child);
        }
        node = child;
      }
    }
  }

  return root;
}

function renderObjectBody(node, indent) {
  const lines = [];
  for (const [key, child] of node.children) {
    const opt = child.optional ? "?" : "";
    lines.push(`${indent}  ${key}${opt}: ${renderNode(child, indent + "  ")};`);
  }
  return lines.join("\n");
}

function renderNode(node, indent) {
  if (node.kind === "leaf") return node.tsType;
  if (node.kind === "array") return `${renderNode(node.of, indent)}[]`;
  return `{\n${renderObjectBody(node, indent)}\n${indent}}`;
}

function renderRequestsFile(manifest) {
  const seen = new Map(); // basename -> { fqcn, fields }

  for (const route of manifest) {
    if (!route.formRequest || !route.fields) continue;
    const name = classBasename(route.formRequest);
    const existing = seen.get(name);
    if (existing) {
      if (existing.fqcn !== route.formRequest) {
        // Two different FormRequest classes share a basename (e.g.
        // Admin\CreateRequest and User\CreateRequest) — dedup-by-basename
        // would silently drop one's fields. Fail loudly instead of
        // guessing at a disambiguated name.
        throw new Error(
          `FormRequest basename collision: "${name}" resolves to both ${existing.fqcn} and ${route.formRequest}. Teach generate.mjs to namespace these before continuing.`,
        );
      }
      continue; // same class reused by multiple routes — one interface
    }
    seen.set(name, { fqcn: route.formRequest, fields: route.fields });
  }

  const lines = [
    "// GENERATED FILE — do not hand-edit. Run `node tooling/generate-api-types/generate.mjs`.",
    "// Source: lemonade-backend's FormRequest::rules() (introspect.php).",
    "//",
    "// Field types are inferred from validation rule tokens (see rules-to-type.mjs)",
    "// — a rule this generator doesn't recognize falls through to `unknown` rather",
    '// than guessing, so `unknown` here means "check the FormRequest by hand", not',
    '// "this field can be anything". Dot-notation fields (settings.email,',
    "// tickets.*.id) become real nested objects/arrays, not literal dotted keys.",
    "",
  ];

  for (const [name, { fields }] of [...seen.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const tree = buildFieldTree(fields);
    lines.push(`export interface ${name} {`);
    lines.push(renderObjectBody(tree, ""));
    lines.push("}", "");
  }

  return lines.join("\n");
}

const manifest = readManifest();
const groups = buildRouteGroups(manifest);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "routes.generated.ts"), renderRoutesFile(groups));
writeFileSync(join(outDir, "requests.generated.ts"), renderRequestsFile(manifest));

const requestCount = new Set(manifest.filter((r) => r.formRequest).map((r) => r.formRequest)).size;
console.log(
  `Generated ${groups.size} route groups (${manifest.filter((r) => r.name).length} named routes) and ${requestCount} request interfaces.`,
);
