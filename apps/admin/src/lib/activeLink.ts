// Pure comparison, not a hook — callers get the current pathname once via
// usePathname() at the top of their component and pass it in here, since
// this used to call usePathname() itself from inside a .map() callback
// (BottomNav.tsx), which is a real react-hooks/rules-of-hooks violation
// (hooks can't be called from a loop/callback).
export const isActiveLink = (pathname: string, path: string, exact: boolean = false) => {
  return exact ? pathname === path : pathname.includes(path);
};
