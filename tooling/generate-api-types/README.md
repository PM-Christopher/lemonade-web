# generate-api-types (placeholder)

Reads the backend contract (`lemonade-backend`'s Postman collection today,
ideally an OpenAPI export later) and generates `packages/api-types/src`.

Not implemented yet — depends on `lemonade-backend`'s
`postman/generate-collection.mjs` output being available as a build input.
See `docs/ARCHITECTURE.md` §7 (`@lemonade/api-types`) and §19 (the
contract-drift CI check this feeds).
