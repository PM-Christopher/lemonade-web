import React from 'react';
import {EventInterface} from "@/interfaces/EventInterface";
import AffiliateItems from "@/components/events/AffiliateItems";
import {AffiliateItemSkeleton} from "@/components/Skeletons";

const PromotionsSubMenu = ({events, loading}: { events: EventInterface[], loading: boolean }) => {
    const itemLoading = true
    return (
        <div className="overflow-y-auto max-h-screen hide-scrollbar">
            {
                loading ? (
                    <AffiliateItemSkeleton count={5}/>
                ) : (
                    events.length > 0 ? (
                        events?.map((event, index: number) => (
                            <AffiliateItems event={event} key={index} />
                        ))
                    ) : (
                        <div className="col-span-3 flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                            <svg
                                className="w-12 h-12 text-gray-300 mb-3"
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
                            <p className="text-gray-600 font-medium">
                                No events promotions
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                Check back later for upcoming promotions.
                            </p>
                        </div>
                    )
                )
            }
        </div>
    );
}

export default PromotionsSubMenu;