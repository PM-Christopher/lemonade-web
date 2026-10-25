"use client";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { routes } from "@/lib/routes";
import { centerNumericColumns } from "@/utils/tableAlign";
import { useNavigation } from "@/hooks/useNavigation";
import { SearchBox } from "@/components/global/SearchBox";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import { usePagination } from "@/hooks/usePagination";
import React, { useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { PlusIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { announcementHeaders } from "@/data/tableData";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { GetStatusClass } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { useAnnouncementsQuery } from "@/features/announcements/queries";
import type { AnnouncementRow } from "@/features/announcements/api";

const AnnouncementModal = dynamic(() => import("@/modals/announcements/AnnouncementModal"), {
  ssr: false,
});

// A pending announcement is waiting for its date, so it reads as scheduled.
export const announcementStatus = (status: string) =>
  status === "pending" ? "Scheduled" : status.charAt(0).toUpperCase() + status.slice(1);

const when = (iso: string) => dayjs(iso).format("DD MMM, YYYY hh:mm A");

const AnnouncementsClient = () => {
  const { push } = useNavigation();
  const { value: searchValue, setValue: setSearchValue, term } = useSearchTerm();
  const [createOpen, setCreateOpen] = useState(false);

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: announcementData } = useAnnouncementsQuery({
    enabled: isLoggedIn,
    search: term,
  });

  const announcements = announcementData?.announcements ?? [];
  const pager = usePagination(announcements, term);

  return (
    <>
      <section className="mt-6 flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-body-l"}>{announcements.length} Announcements</p>
          <div className={"flex justify-between gap-3"}>
            <SearchBox
              value={searchValue}
              onChange={setSearchValue}
              label="Search announcements"
              placeholder="Search announcement, ID..."
            />
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
                  {pager.pageItems.length > 0 ? (
                    pager.pageItems.map((row: AnnouncementRow, index: number) => (
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
                currentPage={pager.page}
                totalPages={pager.totalPages}
                onPageChange={pager.setPage}
                perPage={DEFAULT_PAGE_SIZE}
              />
            </div>
          </div>
        </div>
      </section>
      <AnnouncementModal isOpen={createOpen} toggle={() => setCreateOpen(false)} />
    </>
  );
};

export default AnnouncementsClient;
