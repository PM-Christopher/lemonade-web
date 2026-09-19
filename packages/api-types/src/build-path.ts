// Fills `{param}` placeholders in a generated route template with real
// values, e.g. `buildPath(adminUsersRoutes.SHOW, { id })` ->
// "/admin/users/42". Every generated route with a path parameter bakes its
// name into the string (see tooling/generate-api-types) instead of the
// hand-maintained routes.ts's old pattern of concatenating `/${id}` onto a
// BASE constant at the call site. A typo in a param name fails loudly (a
// literal "{id}" left in the URL, a real 404) rather than silently.
export function buildPath(template: string, params: Record<string, string | number>): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
