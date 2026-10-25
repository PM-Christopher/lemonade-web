"use client";
import { SearchIcon, XIcon } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

// The search field every list uses, with a clear button.
export function SearchBox({ value, onChange, placeholder, label }: SearchBoxProps) {
  return (
    <div className="bg-light_grey border-grey-20 flex h-10 w-71.25 shrink-0 items-center gap-3 rounded-xl border p-2 px-3">
      <SearchIcon className="text-grey-40 h-3 w-3 shrink-0" aria-hidden="true" />
      <input
        type="search"
        aria-label={label}
        className="text-body-s w-full bg-transparent focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") onChange("");
        }}
      />
      {value !== "" && (
        <button
          type="button"
          aria-label="Clear search"
          className="text-grey-40 hover:text-text-grey shrink-0 cursor-pointer"
          onClick={() => onChange("")}
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
