import { useState } from "react";
import useDebounce from "@/hooks/useDebounce";

const DELAY_MS = 400;

// What is typed in a search box, plus the trimmed term to send once typing pauses.
export function useSearchTerm() {
  const [value, setValue] = useState("");
  const { debouncedValue } = useDebounce(value, DELAY_MS);

  return { value, setValue, term: debouncedValue.trim() };
}
