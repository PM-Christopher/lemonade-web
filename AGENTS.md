<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

# Lemonade Web — Agent Guidance

Work as a Lead / Principal Frontend Engineer. Follow `.cursor/rules/lemonade-web.mdc`,
`.cursor/rules/principal-frontend.mdc`, and `CLAUDE.md`.

## Non-negotiables for UI work

- Use `routes.*` from `src/lib/routes.ts` for every in-app navigation.
- Use `images.*` from `src/lib/images.ts` for every public `/images/*` path.
- Prefer `useNavigation`, `useIsMobile`, and `useAuthReady` over ad-hoc copies.
- Do not introduce npm-style installs in this pnpm monorepo; run from the root with `pnpm`.
- Backend owns business rules; frontend displays and interacts.

## Code comments

- Brief, direct, human-friendly one-liners that say what the code does.
- No lengthy or multi-line comment blocks.
- Readable for technical and non-technical readers.
- Rewrite comments in any file you touch to match.
