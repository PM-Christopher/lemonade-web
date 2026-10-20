import React, { useState } from "react";
import dayjs from "dayjs";
import DataCard from "@/components/global/DataCard";
import PaginationComp from "@/components/global/Pagination";
import { useNavigation } from "@/hooks/useNavigation";
import { routes } from "@/lib/routes";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";
import { promotionMainHeaders } from "@/data/tableData";
import type { EventTabData, EventPromotionsQueueResponse } from "@/features/events/api";

interface PromotionViewProps {
  pageData: EventTabData | undefined;
}

const PromotionView = ({ pageData: rawPageData }: PromotionViewProps) => {
  // EventsClient.tsx only renders this view for the "promotions" tab, where
  // getEventData always resolves to EventPromotionsQueueResponse — the
  // union prop type comes from eventData being shared across three sibling
  // views that each render for exactly one tab.
  const pageData = rawPageData as EventPromotionsQueueResponse | undefined;
  const { push } = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const rows = pageData?.history ?? [];
  const totalPages = Math.max(1, Math.ceil(rows.length / perPage));
  const pageRows = rows.slice((currentPage - 1) * perPage, currentPage * perPage);
  return (
    <>
      <>
        <div className={"flex justify-between gap-6 px-3 pt-2 pb-4"}>
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
        <div className="rounded-lg bg-white shadow-md">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-mid-grey">
                {promotionMainHeaders.map((header) => (
                  <th
                    className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
                    key={header}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.length > 0 ? (
                pageRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-grey-20 h-18 cursor-pointer border-b"
                    onClick={() => push(routes.EVENT_PROMOTIONS(row.id))}
                  >
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row.unique_id ?? "N/A"}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row.event_name}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row.promotion_name}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      ₦{Number(row.promotion_price).toLocaleString()}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {dayjs(row.date_paid).format("DD MMM, YYYY hh:mm A")}
                    </td>
                    <td
                      className={`p-4 font-sans text-sm font-medium ${GetStatusClass(capitalizeWords(row.status))}`}
                    >
                      {capitalizeWords(row.status)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={promotionMainHeaders.length}
                    className="p-4 text-center text-sm text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <PaginationComp
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            perPage={perPage}
          />
        </div>
      </>
    </>
  );
};

export default PromotionView;
