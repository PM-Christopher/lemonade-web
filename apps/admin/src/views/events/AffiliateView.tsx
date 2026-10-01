import React, { useState } from "react";
import DataCard from "@/components/global/DataCard";
import { affiliateMainHeaders, eventMainHeaders } from "@/data/tableData";
import { useRouter } from "next/navigation";
import PaginationComp from "@/components/global/Pagination";
import type {
  EventAffiliatesResponse,
  EventListResponse,
  EventPromotionsQueueResponse,
} from "@/features/events/api";

interface AffiliateViewProps {
  pageData: EventListResponse | EventAffiliatesResponse | EventPromotionsQueueResponse | undefined;
}

const AffiliateView = ({ pageData }: AffiliateViewProps) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // EventsClient.tsx only renders this view for the "affiliates" tab, where
  // getEventData always resolves to EventAffiliatesResponse — the union
  // prop type comes from eventData being shared across three sibling views
  // that each render for exactly one tab.
  const data = pageData as EventAffiliatesResponse | undefined;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((data?.affiliates?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = data?.affiliates?.slice(startIndex, startIndex + perPage);
  return (
    <>
      <>
        <div className={"flex justify-between gap-6 px-3 pt-2 pb-4"}>
          <DataCard
            styles={"w-full"}
            title={"Ticket Affiliate Earning"}
            count={data?.total_affiliate_earning ?? 0}
            isPrice={true}
          />
          <DataCard
            styles={"w-full"}
            title={"Total Affiliates"}
            count={data?.total_affiliates ?? 0}
          />
        </div>
        <div className="rounded-lg bg-white shadow-md">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-mid-grey">
                {affiliateMainHeaders.map((header, idx) => (
                  <th className="font-semiBold text-text-grey p-4 text-left text-[12px]" key={idx}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-grey-20 h-[72px] cursor-pointer border-b"
                    onClick={() => router.push(`/events/${row.id}/affiliates`)}
                  >
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.unique_id}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.name}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.programs}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.date_joined}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={eventMainHeaders.length}
                    className="p-4 text-center text-sm text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {/* Pagination */}
          <PaginationComp
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            perPage={perPage}
          />
        </div>
      </>
    </>
  );
};

export default AffiliateView;
