import React, { useMemo, useState } from "react";
import DataCard from "@/components/global/DataCard";
import { eventMainHeaders } from "@/data/tableData";
import PaginationComp from "@/components/global/Pagination";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useSearchParams from "@/hooks/useSearchParams";
import type {
  EventAffiliatesResponse,
  EventListResponse,
  EventPromotionsQueueResponse,
} from "@/features/events/api";

// Off the initial bundle — only needed once "Edit commission" is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const EditCommissionModal = dynamic(() => import("@/modals/events/EditCommissionModal"), {
  ssr: false,
});

interface EventViewProps {
  pageData: EventListResponse | EventAffiliatesResponse | EventPromotionsQueueResponse | undefined;
}

const EventView = ({ pageData }: EventViewProps) => {
  const router = useRouter();
  const { searchParams } = useSearchParams();
  const query = searchParams?.get("search");
  // State for current page and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [editCommissionModal, setEditCommissionModal] = useState(false);
  const toggleEditModal = () => {
    setEditCommissionModal(!editCommissionModal);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // EventsClient.tsx only renders this view for the "events" tab, where
  // getEventData always resolves to EventListResponse — the union prop
  // type comes from eventData being shared across three sibling views
  // that each render for exactly one tab.
  const data_ = pageData as EventListResponse | undefined;
  const events = data_?.events;
  const data = useMemo(() => {
    const q = query?.toLowerCase()?.trim();
    if (!q) return events;
    return events?.filter((event) => {
      return (
        event?.event_name?.toLowerCase().includes(q) ||
        event?.category?.toLowerCase().includes(q) ||
        event?.unique_id?.toLowerCase().includes(q) ||
        event?.event_type?.toLowerCase().includes(q)
      );
    });
  }, [query, events]);

  const [seenList, setSeenList] = useState({ query, events });
  if (query !== seenList.query || events !== seenList.events) {
    setSeenList({ query, events });
    setCurrentPage(1);
  }

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((data?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = data?.slice(startIndex, startIndex + perPage);

  return (
    <>
      <>
        <div className={"flex justify-between gap-[24px] px-[12px] pt-[8px] pb-[16px]"}>
          <DataCard
            styles={"w-full"}
            title={"Ticket Commission"}
            count={data_?.tickets_commission ?? 0}
            isPrice={true}
          />
          <DataCard
            styles={"w-full"}
            title={"Commission Percentage"}
            isPercentage={true}
            count={(data_?.commission_charge ?? 0) * 100}
            isEditable={true}
            handleChange={toggleEditModal}
          />
          <DataCard styles={"w-full"} title={"Total Events"} count={data_?.total_events ?? 0} />
        </div>
        <div className="rounded-lg bg-white shadow-md">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-mid-grey">
                {eventMainHeaders.map((header, idx) => (
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
                    onClick={() => router.push(`/events/${row.id}`)}
                  >
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.unique_id}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.event_name}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.event_type}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.category}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.date_created_at}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row?.status}</td>
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
        <EditCommissionModal
          isOpen={editCommissionModal}
          toggle={toggleEditModal}
          commissionCharge={data_?.commission_charge ?? 0}
        />
      </>
    </>
  );
};

export default EventView;
