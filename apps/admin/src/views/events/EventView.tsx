import React, { useEffect, useState } from "react";
import DataCard from "@/components/global/DataCard";
import { eventMainHeaders } from "@/data/tableData";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useSearchParams from "@/hooks/useSearchParams";

// Off the initial bundle — only needed once "Edit commission" is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const EditCommissionModal = dynamic(
  () => import("@/modals/events/EditCommissionModal"),
  {
    ssr: false,
  },
);

const EventView = ({ pageData }: any) => {
  const router = useRouter();
  const { searchParams } = useSearchParams();
  const query = searchParams?.get("search");
  // State for current page and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editCommissionModal, setEditCommissionModal] = useState(false);
  const toggleEditModal = () => {
    setEditCommissionModal(!editCommissionModal);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [data, setData] = useState<any>(pageData?.events || []);

  useEffect(() => {
    if (query?.trim() === "") {
      setData(pageData?.events);
    } else {
      const q = query?.toLowerCase()?.trim();
      const filtered = pageData?.events.filter((event: any) => {
        return (
          !q ||
          event?.event_name?.toLowerCase().includes(q) ||
          event?.category?.toLowerCase().includes(q) ||
          event?.unique_id?.toLowerCase().includes(q) ||
          event?.event_type?.toLowerCase().includes(q)
        );
      });

      setData(filtered);
    }

    setCurrentPage(1); // Reset to first page on search
  }, [query, pageData?.events]);

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil(data?.length / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = data?.slice(startIndex, startIndex + perPage);

  return (
    <>
      <>
        <div
          className={
            "flex justify-between gap-[24px] px-[12px] pb-[16px] pt-[8px]"
          }
        >
          <DataCard
            styles={"w-full"}
            title={"Ticket Commission"}
            count={pageData?.tickets_commission}
            isPrice={true}
          />
          <DataCard
            styles={"w-full"}
            title={"Commission Percentage"}
            isPercentage={true}
            count={pageData?.commission_charge * 100}
            isEditable={true}
            handleChange={toggleEditModal}
          />
          <DataCard
            styles={"w-full"}
            title={"Total Events"}
            count={pageData?.total_events}
          />
        </div>
        <div className="rounded-lg bg-white shadow-md">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-mid-grey">
                {eventMainHeaders.map((header, idx) => (
                  <th
                    className="p-4 text-left text-[12px] font-semiBold text-text-grey"
                    key={idx}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData && paginatedData.length > 0 ? (
                paginatedData.map((row: any, index: any) => (
                  <tr
                    key={index}
                    className="h-[72px] cursor-pointer border-b border-grey-20"
                    onClick={() => router.push(`/events/${row.id}`)}
                  >
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row?.unique_id}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row?.event_name}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row?.event_type}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row?.category}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row?.date_created_at}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row?.status}
                    </td>
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
          commissionCharge={pageData?.commission_charge}
        />
      </>
    </>
  );
};

export default EventView;
