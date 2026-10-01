export default function AuthLoading() {
  return (
    <div className="bg-light-grey flex min-h-screen items-center justify-center">
      <div
        role="status"
        aria-label="Loading"
        className="border-grey-20 border-t-step-color h-8 w-8 animate-spin rounded-full border-2"
      />
    </div>
  );
}
