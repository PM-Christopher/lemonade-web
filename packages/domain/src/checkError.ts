// Structural rather than importing Formik's own types — this package stays
// framework-agnostic; any object shaped like { touched, errors } works
// (which is exactly what useFormik()'s return value looks like).
interface FormikErrorLike {
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

/** True (and the error message) when a known Formik field has been touched and has a validation error. */
export function checkError(value: string, formik: FormikErrorLike): unknown {
  if (!(CHECKED_FIELDS as readonly string[]).includes(value)) return null;
  const field = value as CheckedField;
  return formik.touched[field] && formik.errors[field];
}

interface PasswordFormikLike {
  values: { password: string };
}

/** Password-strength predicates used by signup's live-requirements checklist. */
export function handleTest(
  type: "lower" | "upper" | "number" | "special" | "eight",
  formik: PasswordFormikLike,
): boolean | undefined {
  if (type === "lower") {
    return /[a-z]/.test(formik.values.password);
  }
  if (type === "upper") {
    return /[A-Z]/.test(formik.values.password);
  }
  if (type === "number") {
    return /\d/.test(formik.values.password);
  }
  if (type === "special") {
    return /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(formik.values.password);
  }
  if (type === "eight") {
    return /^.{8,}$/.test(formik.values.password);
  }
}
