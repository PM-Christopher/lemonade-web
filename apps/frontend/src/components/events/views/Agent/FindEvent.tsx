import React, { useEffect, useState } from "react";
import SearchIcon from "@/images/icons/search.svg";
import AgentEventCard from "@/components/events/AgentEventCard";
import Link from "next/link";
import { AffiliateEventsSkeleton } from "@/components/Skeletons";
import { useSearchAffiliateEventsMutation } from "@/features/events/mutations";
import type { EventInterface } from "@/interfaces/EventInterface";
import { routes } from "@/lib/routes";
import useDebounce from "@/hooks/useDebounce";

const PAGE_SIZE = 12;

type FindEventProps = {
  initialEvents: EventInterface[];
  loading: boolean;
};

// Lists events open to affiliates; typing searches them on the server.
function FindEventSubMenu({ initialEvents, loading: initialLoading }: FindEventProps) {
  const [search, setSearch] = useState("");
  const { debouncedValue } = useDebounce(search.trim(), 350);
  const searchMutation = useSearchAffiliateEventsMutation();
  const { mutate: runSearch, reset: resetSearch } = searchMutation;

  const [visible, setVisible] = useState(PAGE_SIZE);
  useEffect(() => {
    if (debouncedValue) runSearch(debouncedValue);
    else resetSearch();
  }, [debouncedValue, runSearch, resetSearch]);

  const isSearching = debouncedValue.length > 0;
  const events = isSearching ? (searchMutation.data?.events ?? []) : initialEvents;
  const loading = isSearching ? searchMutation.isPending : initialLoading;

  return (
    <div className="flex flex-col">
      <div className="bg-light_grey flex items-center gap-3 rounded-xl px-4 py-3">
        <span className="shrink-0 text-gray-500">
          <SearchIcon />
        </span>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          className="text-body-s w-full bg-transparent outline-none placeholder:text-gray-400"
          placeholder="Search events"
        />
      </div>

      {loading ? (
        <div className="laptop:grid-cols-3 mt-4 grid grid-cols-2 gap-4">
          <AffiliateEventsSkeleton count={6} />
        </div>
      ) : events.length > 0 ? (
        <div className="laptop:grid-cols-3 mt-4 grid grid-cols-2 gap-4">
          {events.slice(0, visible).map((item: EventInterface) => (
            <div key={item.id} className="min-w-0">
              <Link href={routes.EVENT_AGENT_DETAILS(item.id)}>
                <AgentEventCard
                  image={item?.event_image}
                  name={item?.event_name}
                  amount={item?.minimum_price}
                  commission={item?.commission}
                />
              </Link>
            </div>
          ))}
          {events.length > visible && (
            <button
              type="button"
              onClick={() => setVisible((count) => count + PAGE_SIZE)}
              className="text-light-green text-body-s col-span-full mt-2 cursor-pointer font-sans font-semibold"
            >
              Show more
            </button>
          )}
        </div>
      ) : (
        <div className="flex min-h-55 w-full flex-col items-center justify-center p-6 text-center">
          <p className="text-body-s font-sans font-medium text-gray-800">No events found</p>
          <p className="text-meta mt-1 leading-normal text-gray-500">
            {isSearching ? "Try a different keyword." : "Check back later for new programs."}
          </p>
        </div>
      )}
    </div>
  );
}

export default FindEventSubMenu;
