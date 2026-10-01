// Shown while a Server Component page under (main) is still resolving its
// own awaits (prefetchQuery calls — see e.g. page.tsx's dashboard prefetch).
// Deliberately not wrapped in MainLayout: that would fire its own
// current-user fetch on every navigation, on top of the one the actual
// page already makes once it resolves.
export default function MainLoading() {
  return (
    <div className="bg-light_grey flex min-h-screen items-center justify-center">
      <div
        role="status"
        aria-label="Loading"
        className="border-grey-20 border-t-step-color h-8 w-8 animate-spin rounded-full border-2"
      />
    </div>
  );
}
