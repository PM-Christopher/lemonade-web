import React from "react";
import Image from "next/image";
import { EventInterface } from "@/interfaces/EventInterface";
import AffiliateItems from "@/components/events/AffiliateItems";
import { AffiliateItemSkeleton } from "@/components/Skeletons";
import { images } from "@/lib/images";

type PromotionsProps = {
  events: EventInterface[];
  loading: boolean;
  onFindEvents: () => void;
};

const PromotionsSubMenu = ({ events, loading, onFindEvents }: PromotionsProps) => {
  return (
    <div className="hide-scrollbar max-h-screen overflow-y-auto">
      {loading ? (
        <AffiliateItemSkeleton count={5} />
      ) : events.length > 0 ? (
        events?.map((event, index: number) => <AffiliateItems event={event} key={index} />)
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Image
            src={images.AFFILIATE_LINK}
            alt=""
            width={140}
            height={140}
            className="h-35 w-35 object-contain"
          />
          <p className="text-body-xl mt-4 font-sans font-semibold">Join programs</p>
          <p className="text-text-grey text-meta mt-1 max-w-72 font-sans">
            Start earning by getting commissions from ticket sales through your affiliate link.
          </p>
          <button
            type="button"
            onClick={onFindEvents}
            className="bg-gradient-green text-body-s mt-4 h-10 cursor-pointer rounded-xl px-8 font-sans font-medium text-white"
          >
            Find events
          </button>
        </div>
      )}
    </div>
  );
};

export default PromotionsSubMenu;
