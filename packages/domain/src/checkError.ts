// Structural form-state shape — framework-agnostic ({ touched, errors } works for RHF too).
interface FieldErrorState {
  touched: Record<string, unknown>;
  errors: Record<string, unknown>;
}

const CHECKED_FIELDS = [
  "phone_number",
  "email",
  "fullname",
  "surname",
  "dob",
  "password",
  "confirm_password",
  "card_number",
  "cvv",
  "exp",
  "code",
  "address",
  "city",
  "country",
  "state",
  "skills",
  "interests",
] as const;

type CheckedField = (typeof CHECKED_FIELDS)[number];

/** Returns the error message when a known field has been touched and is invalid. */
export function checkError(value: string, form: FieldErrorState): unknown {
  if (!(CHECKED_FIELDS as readonly string[]).includes(value)) return null;
  const field = value as CheckedField;
  return form.touched[field] && form.errors[field];
}

interface PasswordValues {
  values: { password: string };
}

/** Password-strength predicates for a live requirements checklist. */
export function handleTest(
  type: "lower" | "upper" | "number" | "special" | "eight",
  form: PasswordValues,
): boolean | undefined {
  if (type === "lower") {
    return /[a-z]/.test(form.values.password);
  }
  if (type === "upper") {
    return /[A-Z]/.test(form.values.password);
  }
  if (type === "number") {
    return /\d/.test(form.values.password);
  }
  if (type === "special") {
    return /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(form.values.password);
  }
  if (type === "eight") {
    return /^.{8,}$/.test(form.values.password);
  }
}
