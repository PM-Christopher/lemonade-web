"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import SearchIcon from "@/images/icons/search.svg";
import useDebounce from "@/hooks/useDebounce";
import { useFindUsersQuery } from "@/features/connect/queries";
import type { FoundUser } from "@/features/connect/api";

type UserSearchProps = {
  onSelect: (user: FoundUser) => void;
};

// Search box that lists matching usernames as you type.
const UserSearch: React.FC<UserSearchProps> = ({ onSelect }) => {
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const { debouncedValue } = useDebounce(value.trim(), 300);
  const { data: users = [], isFetching } = useFindUsersQuery(debouncedValue);

  const isSearching = debouncedValue.length >= 2;
  const showList = isOpen && isSearching;

  // Close the list on a click anywhere outside the search box.
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const handleSelect = (user: FoundUser) => {
    setIsOpen(false);
    setValue("");
    onSelect(user);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="bg-light_grey flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm ring-1 ring-black/5">
        <span className="shrink-0 text-gray-500">
          <SearchIcon />
        </span>
        <input
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          className="text-body-s w-full bg-transparent outline-none placeholder:text-gray-400"
          placeholder="Search user, chat..."
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
        />
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-gray-100 bg-white py-1 shadow-lg"
        >
          {users.map((user) => (
            <li key={user.id} role="option" aria-selected={false}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-4 py-2 text-left hover:bg-gray-50"
                onClick={() => handleSelect(user)}
              >
                <span className="min-w-0">
                  <span className="text-body-s block truncate font-semibold text-gray-900">
                    {user.username}
                  </span>
                  <span className="text-meta block truncate leading-normal text-gray-500">
                    {user.fullname}
                  </span>
                </span>
                {user.hasConnected && (
                  <span className="text-meta shrink-0 leading-normal text-gray-500">Connected</span>
                )}
              </button>
            </li>
          ))}
          {users.length === 0 && (
            <li className="text-body-s px-4 py-3 text-gray-500">
              {isFetching ? "Searching..." : "No users found"}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
