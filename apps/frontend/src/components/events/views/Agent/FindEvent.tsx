import React, { useEffect, useState } from "react";
import SearchIcon from "@/images/icons/search.svg";
import AgentEventCard from "@/components/events/AgentEventCard";
import Link from "next/link";
import { AffiliateEventsSkeleton } from "@/components/Skeletons";
import { useSearchAffiliateEventsMutation } from "@/features/events/mutations";
import type { EventInterface } from "@/interfaces/EventInterface";
import { routes } from "@/lib/routes";

function FindEventSubMenu() {
  const [search, setSearch] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const searchAffiliateEventsMutation = useSearchAffiliateEventsMutation();
  const affiliateEvents = searchAffiliateEventsMutation.data?.events ?? [];
  const loading = searchAffiliateEventsMutation.isPending;
  const { reset: resetSearch } = searchAffiliateEventsMutation;

  const isEmpty = search.trim().length === 0;

  if (isEmpty && hasSearched) {
    setHasSearched(false);
  }

  useEffect(() => {
    if (isEmpty) resetSearch();
  }, [isEmpty, resetSearch]);

  const handleSearch = () => {
    const term = search.trim();
    if (!term) {
      // keep user in "start searching" view
      setHasSearched(false);
      searchAffiliateEventsMutation.reset();
      return;
    }

    setHasSearched(true);
    searchAffiliateEventsMutation.mutate(term);
  };

  return (
    <div className="flex flex-col">
      {/* Search */}
      <div className="sticky top-0 z-10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
        <div className="bg-light_grey flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm ring-1 ring-black/5">
          <span className="shrink-0 text-gray-500">
            <SearchIcon />
          </span>
          <input
            id="search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="text-body-s w-full bg-transparent outline-none placeholder:text-gray-400"
            placeholder="Search events..."
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || isEmpty}
            className="text-meta shrink-0 rounded-xl bg-white px-3 py-2 leading-normal font-medium text-gray-700 ring-1 ring-black/5 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      <div>
        {/* Empty state BEFORE searching */}
        {!loading && !hasSearched && (
          <div className="border-mid-grey/70 flex min-h-55 w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-6 text-center">
            <div className="bg-light_grey mb-3 rounded-2xl p-3 text-gray-600">
              <SearchIcon />
            </div>
            <p className="text-body-s sm:text-body-s font-sans text-gray-700">
              Press <span className="bg-light_grey rounded-md px-2 py-0.5 font-medium">Enter</span>{" "}
              to start searching
            </p>
            <p className="text-meta mt-1 leading-normal text-gray-500">
              Type an event name or keyword.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="laptop:grid-cols-3 mt-4 grid grid-cols-2 gap-4">
            <AffiliateEventsSkeleton count={6} />
          </div>
        )}

        {/* Empty state AFTER searching */}
        {!loading &&
          hasSearched &&
          !isEmpty &&
          (!affiliateEvents || affiliateEvents.length === 0) && (
            <div className="border-mid-grey/70 flex min-h-55 w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-white p-6 text-center">
              <div className="bg-light_grey mb-3 rounded-2xl p-3 text-gray-600">
                <SearchIcon />
              </div>
              <p className="text-body-s font-sans font-medium text-gray-800">No events found</p>
              <p className="text-meta mt-1 leading-normal text-gray-500">
                Try a different keyword.
              </p>
            </div>
          )}

        {/* Data */}
        {!loading && affiliateEvents?.length > 0 && (
          <div className="laptop:grid-cols-3 mt-4 grid grid-cols-2 gap-4">
            {affiliateEvents.map((item: EventInterface, index: number) => (
              <div key={index} className="min-w-0">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default FindEventSubMenu;
