import React from "react";
import DataCard from "@/components/global/DataCard";
import GlobalTable from "@/components/global/GlobalTable";
import { promotionMainHeaders } from "@/data/tableData";
import type {
  EventAffiliatesResponse,
  EventListResponse,
  EventPromotionsQueueResponse,
} from "@/features/events/api";

interface PromotionViewProps {
  pageData: EventListResponse | EventAffiliatesResponse | EventPromotionsQueueResponse | undefined;
}

const PromotionView = ({ pageData: rawPageData }: PromotionViewProps) => {
  // EventsClient.tsx only renders this view for the "promotions" tab, where
  // getEventData always resolves to EventPromotionsQueueResponse — the
  // union prop type comes from eventData being shared across three sibling
  // views that each render for exactly one tab.
  const pageData = rawPageData as EventPromotionsQueueResponse | undefined;
  return (
    <>
      <>
        <div className={"flex justify-between gap-[24px] px-[12px] pt-[8px] pb-[16px]"}>
          <DataCard
            styles={"w-full"}
            title={"Promotions Revenue"}
            count={pageData?.promotions_revenue || 0}
            isPrice={true}
          />
          <DataCard
            styles={"w-full"}
            title={"Total Promotions"}
            count={pageData?.total_promotions || 0}
          />
          <DataCard
            styles={"w-full"}
            title={"Offered Promotions"}
            count={pageData?.offered_promotions || 0}
            isLink={true}
            pageLink={"/events/add-promotions"}
          />
        </div>
        {/* GlobalTable's content prop is a generic stringly-keyed row shape
            (no named interface) — EventPromotionQueueItem's fields are all
            string|number|null, but TS only accepts a nominal interface
            against a Record<string,...> index signature via an explicit
            cast, not structurally. */}
        <GlobalTable
          headers={promotionMainHeaders}
          content={
            (pageData?.history ?? []) as unknown as Array<
              Record<string, string | number | null | undefined>
            >
          }
        />
      </>
    </>
  );
};

export default PromotionView;
