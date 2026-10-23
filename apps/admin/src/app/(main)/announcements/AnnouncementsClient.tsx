"use client";
import { routes } from "@/lib/routes";
import { centerNumericColumns } from "@/utils/tableAlign";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { announcementHeaders } from "@/data/tableData";
import DataInfoCard from "@/components/global/DataInfoCard";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetStatusClass } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { useAnnouncementsQuery } from "@/features/announcements/queries";
import type { AnnouncementRow, PageContentCategory } from "@/features/announcements/api";

const AnnouncementModal = dynamic(() => import("@/modals/announcements/AnnouncementModal"), {
  ssr: false,
});
const PageContentModal = dynamic(() => import("@/modals/announcements/PageContentModal"), {
  ssr: false,
});

const PAGES: { category: PageContentCategory; title: string }[] = [
  { category: "terms_and_conditions", title: "Terms & Conditions" },
  { category: "privacy_policy", title: "Privacy policy" },
  { category: "community_guidelines", title: "Community guidelines" },
];

// A pending announcement is waiting for its date, so it reads as scheduled.
export const announcementStatus = (status: string) =>
  status === "pending" ? "Scheduled" : status.charAt(0).toUpperCase() + status.slice(1);

const when = (iso: string) => dayjs(iso).format("DD MMM, YYYY hh:mm A");

const AnnouncementsClient = () => {
  const { push } = useNavigation();
  // State for current page and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [createOpen, setCreateOpen] = useState(false);
  const [pageToEdit, setPageToEdit] = useState<(typeof PAGES)[number] | null>(null);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: announcementData } = useAnnouncementsQuery({
    enabled: isLoggedIn,
  });

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((announcementData?.announcements?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = announcementData?.announcements?.slice(startIndex, startIndex + perPage);

  return (
    <>
      <section className="mt-6 flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-body-l"}>
            {announcementData?.announcements?.length} Announcements
          </p>
          <div className={"flex justify-between gap-3"}>
            <div className="bg-light_grey border-grey-20 flex h-10 w-71.25 shrink-0 items-center gap-3 rounded-xl border p-2 px-3">
              <div>
                <SearchIcon className={"text-grey-40 h-3 w-3"} />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="bg-light-grey text-body-s w-full rounded-xl py-4 focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder="Search announcement, ID..."
                />
              </div>
            </div>
            <div>
              <Button
                className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}
                onClick={() => setCreateOpen(true)}
              >
                <PlusIcon className={"h-3.75 w-3.75 text-white"} />
                <p className={"text-body-l font-medium text-white"}>New Announcement</p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-5"}>
          <div className={"border-grey-20 flex flex-col rounded-xl border"}>
            <div className={"flex justify-between gap-6 px-3 pt-2 pb-4"}>
              {PAGES.map((page) => (
                <DataInfoCard
                  key={page.category}
                  styles={"w-full"}
                  title={page.title}
                  isEditable={true}
                  handleChange={() => setPageToEdit(page)}
                />
              ))}
            </div>
            <div className="rounded-lg bg-white shadow-md">
              <table
                className={`min-w-full table-auto border-collapse ${centerNumericColumns(announcementHeaders)}`}
              >
                <thead>
                  <tr className="bg-mid-grey">
                    {announcementHeaders.map((header, idx) => (
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
                    paginatedData.map((row: AnnouncementRow, index: number) => (
                      <tr
                        key={index}
                        className="border-grey-20 h-18 cursor-pointer border-b"
                        onClick={() => push(routes.ANNOUNCEMENT_DETAIL(row.id))}
                      >
                        <td className={"p-4 font-sans text-sm font-medium"}>{row.unique_id}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>{row.title}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.created_by?.name}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {when(row.created_at_iso)}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {when(row.scheduled_at)}
                        </td>
                        <td
                          className={`p-4 font-sans text-sm font-medium ${GetStatusClass(announcementStatus(row.status))}`}
                        >
                          {announcementStatus(row.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={announcementHeaders.length}
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
          </div>
        </div>
      </section>
      <AnnouncementModal isOpen={createOpen} toggle={() => setCreateOpen(false)} />
      <PageContentModal
        isOpen={pageToEdit !== null}
        toggle={() => setPageToEdit(null)}
        category={pageToEdit?.category ?? "terms_and_conditions"}
        title={pageToEdit?.title ?? ""}
      />
    </>
  );
};

export default AnnouncementsClient;
