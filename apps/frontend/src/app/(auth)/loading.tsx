export default function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-light_grey">
      <div
        role="status"
        aria-label="Loading"
        className="h-8 w-8 animate-spin rounded-full border-2 border-grey-20 border-t-step-color"
      />
    </div>
  );
}
