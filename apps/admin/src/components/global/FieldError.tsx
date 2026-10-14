// Shows a form field's validation message, if there is one.
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-left text-xs text-[#FF8D8D]">
      {message}
    </p>
  );
}
