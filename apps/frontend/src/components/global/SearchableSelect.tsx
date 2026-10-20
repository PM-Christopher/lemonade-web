"use client";
import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface SearchableOption {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  id?: string;
  options: SearchableOption[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder: string;
  searchPlaceholder: string;
  emptyText?: string;
  ariaLabel: string;
  loading?: boolean;
  className?: string;
}

// Dropdown with a search box; shows the label of the selected option.
export function SearchableSelect({
  id,
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  searchPlaceholder,
  emptyText = "Nothing found",
  ariaLabel,
  loading = false,
  className = "",
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        onBlur?.();
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open, onBlur]);

  const query = term.trim().toLowerCase();
  const visible = options.filter((item) => item.label.toLowerCase().includes(query));
  const selected = options.find((item) => item.value === value);

  const pick = (next: string) => {
    onChange(next);
    setOpen(false);
    setTerm("");
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((current) => !current)}
        className="bg-light_grey text-body-s flex h-12 w-full cursor-pointer items-center justify-between rounded-xl px-4 text-left font-sans"
      >
        <span className={selected ? "text-black-light" : "text-text-grey"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className="text-text-grey h-4 w-4 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-gray-100 bg-white p-2 shadow-lg">
          <div className="bg-light_grey flex items-center gap-2 rounded-lg px-3 py-2">
            <Search className="text-text-grey h-4 w-4 shrink-0" />
            <input
              type="text"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="text-body-s w-full bg-transparent outline-none"
              autoFocus
            />
          </div>
          <ul role="listbox" className="mt-2 max-h-60 overflow-y-auto">
            {loading ? (
              <li className="text-text-grey text-body-s px-3 py-2">Loading...</li>
            ) : visible.length === 0 ? (
              <li className="text-text-grey text-body-s px-3 py-2">{emptyText}</li>
            ) : (
              visible.map((item) => (
                <li
                  key={item.value}
                  role="option"
                  aria-selected={item.value === value}
                  onClick={() => pick(item.value)}
                  className={`text-body-s cursor-pointer rounded-lg px-3 py-2 hover:bg-gray-50 ${
                    item.value === value ? "text-light-green font-semibold" : ""
                  }`}
                >
                  {item.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
