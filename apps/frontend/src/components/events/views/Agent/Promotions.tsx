import React from "react";
import { EventInterface } from "@/interfaces/EventInterface";
import AffiliateItems from "@/components/events/AffiliateItems";
import { AffiliateItemSkeleton } from "@/components/Skeletons";

const PromotionsSubMenu = ({ events, loading }: { events: EventInterface[]; loading: boolean }) => {
  const itemLoading = true;
  return (
    <div className="hide-scrollbar max-h-screen overflow-y-auto">
      {loading ? (
        <AffiliateItemSkeleton count={5} />
      ) : events.length > 0 ? (
        events?.map((event, index: number) => <AffiliateItems event={event} key={index} />)
      ) : (
        <div className="col-span-3 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-10">
          <svg
            className="mb-3 h-12 w-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2h6v2m-7 4h8a2 2 0 002-2v-6H5v6a2 2 0 002 2zM9 9V7a3 3 0 016 0v2m6 4H3"
            />
          </svg>
          <p className="font-medium text-gray-600">No events promotions</p>
          <p className="mt-1 text-sm text-gray-400">Check back later for upcoming promotions.</p>
        </div>
      )}
    </div>
  );
};

export default PromotionsSubMenu;
