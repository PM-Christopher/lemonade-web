import React, {useEffect, useState} from "react";
import SearchIcon from "@/images/icons/search.svg";
import AgentEventCard from "@/components/events/AgentEventCard";
import Link from "next/link";
import {AffiliateEventsSkeleton} from "@/components/Skeletons";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {searchAffiliateEvent, clearAffiliateEventSearch} from "@/features/events/event.slice";

function FindEventSubMenu() {
    const [search, setSearch] = useState("");
    const [hasSearched, setHasSearched] = useState(false);

    const dispatch = useAppDispatch();
    const {affiliateEvents, affiliateLoading: loading} = useSelector(
        (state: RootState) => state.event
    );

    const isEmpty = search.trim().length === 0;

    // ✅ When cleared, reset UI + results
    useEffect(() => {
        if (isEmpty) {
            setHasSearched(false);
            dispatch(clearAffiliateEventSearch());
        }
    }, [isEmpty, dispatch]);

    const handleSearch = () => {
        const term = search.trim();
        if (!term) {
            // keep user in "start searching" view
            setHasSearched(false);
            dispatch(clearAffiliateEventSearch());
            return;
        }

        setHasSearched(true);
        dispatch(searchAffiliateEvent({data: {search: term}}));
    };

    console.log({
        affiliateEvents
    })

    return (
        <div className="flex flex-col">
            {/* Search */}
            <div className="sticky top-0 z-10 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/50">
                <div
                    className="flex items-center gap-3 rounded-2xl bg-light_grey px-4 py-3 ring-1 ring-black/5 shadow-sm">
                    <span className="shrink-0 text-gray-500">
                        <SearchIcon/>
                    </span>
                    <input
                        id="search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                        className="w-full bg-transparent text-[14px] outline-none placeholder:text-gray-400"
                        placeholder="Search events..."
                    />

                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={loading || isEmpty}
                        className="shrink-0 rounded-xl bg-white px-3 py-2 text-[13px] font-medium text-gray-700 ring-1 ring-black/5 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* Results */}
            <div>
                {/* Empty state BEFORE searching */}
                {!loading && !hasSearched && (
                    <div
                        className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-mid-grey/70 bg-white p-6 text-center">
                        <div className="mb-3 rounded-2xl bg-light_grey p-3 text-gray-600">
                            <SearchIcon/>
                        </div>
                        <p className="font-sans text-[14px] sm:text-[15px] text-gray-700">
                            Press{" "}
                            <span className="rounded-md bg-light_grey px-2 py-0.5 font-medium">
                                Enter
                            </span>{" "}
                            to start searching
                        </p>
                        <p className="mt-1 text-[13px] text-gray-500">
                            Type an event name or keyword.
                        </p>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 laptop:grid-cols-3 gap-4 mt-4">
                        <AffiliateEventsSkeleton count={6}/>
                    </div>
                )}

                {/* Empty state AFTER searching */}
                {!loading && hasSearched && !isEmpty && (!affiliateEvents || affiliateEvents.length === 0) && (
                    <div
                        className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-mid-grey/70 bg-white p-6 text-center">
                        <div className="mb-3 rounded-2xl bg-light_grey p-3 text-gray-600">
                            <SearchIcon/>
                        </div>
                        <p className="font-sans text-[15px] font-medium text-gray-800">
                            No events found
                        </p>
                        <p className="mt-1 text-[13px] text-gray-500">
                            Try a different keyword.
                        </p>
                    </div>
                )}

                {/* Data */}
                {!loading && affiliateEvents?.length > 0 && (
                    <div className="grid grid-cols-2 laptop:grid-cols-3 gap-4 mt-4">
                        {affiliateEvents.map((item: any, index: number) => (
                            <div key={index} className="min-w-0">
                                <Link href={`/event/${item.id}/agent-details`}>
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
