import { routes } from "@/lib/routes";
import { centerNumericColumns } from "@/utils/tableAlign";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import DataCard from "@/components/global/DataCard";
import { affiliateMainHeaders } from "@/data/tableData";

import PaginationComp from "@/components/global/Pagination";
import dayjs from "dayjs";
import { AvatarName } from "@/components/global/AvatarName";
import type { DateRange } from "@/components/global/DateRangePicker";
import useSearchParams from "@/hooks/useSearchParams";
import type { EventAffiliatesResponse, EventTabData } from "@/features/events/api";

interface AffiliateViewProps {
  pageData: EventTabData | undefined;
  range?: DateRange | null;
}

const AffiliateView = ({ pageData, range = null }: AffiliateViewProps) => {
  const { searchParams } = useSearchParams();
  const term = searchParams?.get("search")?.toLowerCase().trim() ?? "";
  const { push } = useNavigation();
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
  const affiliates = (data?.affiliates ?? []).filter((row) => {
    const joined = dayjs(row.date_joined);
    const inRange =
      range === null ||
      !joined.isValid() ||
      (!joined.isBefore(dayjs(range.start).startOf("day")) &&
        !joined.isAfter(dayjs(range.end).endOf("day")));
    const matches =
      term === "" ||
      row.name?.toLowerCase().includes(term) ||
      row.unique_id?.toLowerCase().includes(term);
    return inRange && matches;
  });
  const totalPages = Math.max(1, Math.ceil(affiliates.length / perPage));

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = affiliates.slice(startIndex, startIndex + perPage);
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
          <table
            className={`min-w-full table-auto border-collapse ${centerNumericColumns(affiliateMainHeaders)}`}
          >
            <thead>
              <tr className="bg-mid-grey">
                {affiliateMainHeaders.map((header, idx) => (
                  <th
                    className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
                    key={idx}
                  >
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
                    className="border-grey-20 h-18 cursor-pointer border-b"
                    onClick={() => push(routes.EVENT_AFFILIATES(row.id))}
                  >
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.unique_id}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      <AvatarName name={row?.name} image={row?.image} />
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.programs}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {dayjs(row?.date_joined).isValid()
                        ? dayjs(row.date_joined).format("DD MMM, YYYY hh:mm A")
                        : row?.date_joined}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={affiliateMainHeaders.length}
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
