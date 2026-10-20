"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, SearchIcon } from "lucide-react";

interface CategoryPickerProps {
  id?: string;
  value: string;
  options: ReadonlyArray<string>;
  onChange: (value: string) => void;
}

// A dropdown with a search box for long category lists.
export function CategoryPicker({ id, value, options, onChange }: CategoryPickerProps) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const shown = options.filter((option) =>
    option.toLowerCase().includes(term.trim().toLowerCase()),
  );

  return (
    <div className="relative" ref={ref}>
      <button
        id={id}
        type="button"
        aria-label="Category"
        className="bg-light_grey flex h-12 w-full cursor-pointer items-center justify-between rounded-xl px-3"
        onClick={() => setOpen((current) => !current)}
      >
        <span className={`text-body-s ${value ? "" : "text-text-grey"}`}>
          {value || "Select category"}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-xl bg-white p-3 shadow-lg">
          <p className="text-body-s font-semibold">Select category</p>
          <div className="bg-light-grey mt-2 flex items-center gap-2 rounded-lg px-2">
            <SearchIcon className="text-grey-40 h-3.5 w-3.5" />
            <input
              autoFocus
              aria-label="Search category"
              className="text-body-s h-9 w-full bg-transparent focus:outline-none"
              placeholder="Search category"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
            />
          </div>
          <ul className="mt-2 max-h-52 overflow-y-auto">
            {shown.length > 0 ? (
              shown.map((option) => (
                <li key={option}>
                  <button
                    type="button"
                    className="text-body-s w-full cursor-pointer rounded px-2 py-2 text-left hover:bg-gray-100"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                      setTerm("");
                    }}
                  >
                    {option}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-text-grey text-body-s px-2 py-2">No matches</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
