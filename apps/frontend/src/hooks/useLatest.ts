import { useEffect, useRef } from "react";

// Ref holding the latest value, so an effect can call fresh callbacks without re-running.
export function useLatest<T>(value: T) {
  const ref = useRef(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref;
}
