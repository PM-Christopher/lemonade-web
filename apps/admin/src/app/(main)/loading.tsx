// Shown inside the console shell while a page loads, so the sidebar stays put.
export default function MainLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div
        role="status"
        aria-label="Loading"
        className="border-grey-20 border-t-step-color h-8 w-8 animate-spin rounded-full border-2"
      />
    </div>
  );
}
