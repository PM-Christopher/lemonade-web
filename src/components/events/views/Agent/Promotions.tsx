import React from 'react';
import {EventInterface} from "@/interfaces/EventInterface";
import AffiliateItems from "@/components/events/AffiliateItems";
import {AffiliateItemSkeleton} from "@/components/Skeletons";

const PromotionsSubMenu = ({events, loading}: { events: EventInterface[], loading: boolean }) => {
    return (
        <div className="overflow-y-auto max-h-screen hide-scrollbar">
            {
                loading ? (
                    <AffiliateItemSkeleton count={5}/>
                ) : (
                    events?.map((event, index: number) => (
                        <AffiliateItems event={event} key={index} />
                    ))
                )
            }
        </div>
    );
}

export default PromotionsSubMenu;