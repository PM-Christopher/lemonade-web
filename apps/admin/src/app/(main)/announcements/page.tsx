"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { announcementHeaders } from "@/data/tableData";
import DataInfoCard from "@/components/global/DataInfoCard";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { useAnnouncementsQuery } from "@/features/announcements/queries";

const Page = ({}) => {
  const router = useRouter();
  // State for current page and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: announcementData } = useAnnouncementsQuery({ enabled: isLoggedIn });

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((announcementData?.announcements?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = announcementData?.announcements?.slice(startIndex, startIndex + perPage);

  return (
    <MainLayout>
      <section className="mt-[24px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"text-[16px] font-semiBold"}>
            {announcementData?.announcements?.length} Announcements
          </p>
          <div className={"flex justify-between gap-[12px]"}>
            <div className="bg-light_grey flex h-[40px] w-[285px] items-center gap-3 rounded-[12px] border-[1px] border-grey-20 p-2 px-[12px]">
              <div>
                <SearchIcon className={"h-[12px] w-[12px] text-grey-40"} />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="w-full rounded-xl bg-light-grey py-4 text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder="Search announcement, ID..."
                />
              </div>
            </div>
            <div>
              <Button
                className={"flex h-[40px] rounded-[12px] border-step-color bg-gradient-green"}
              >
                <PlusIcon className={"h-[15px] w-[15px] text-white"} />
                <p className={"text-[16px] font-medium text-white"}>New Announcement</p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div className={"flex flex-col rounded-[12px] border-[1px] border-grey-20"}>
            <div className={"flex justify-between gap-[24px] px-[12px] pb-[16px] pt-[8px]"}>
              <DataInfoCard styles={"w-full"} title={"Terms & Conditions"} isEditable={true} />
              <DataInfoCard styles={"w-full"} title={"Privacy policy"} isEditable={true} />
              <DataInfoCard styles={"w-full"} title={"Community guidelines"} isEditable={true} />
            </div>
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-mid-grey">
                    {announcementHeaders.map((header, idx) => (
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
                        onClick={() => router.push(`/announcements/${row.id}`)}
                      >
                        <td className={"p-4 font-sans text-sm font-medium"}>{row.unique_id}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>{row.title}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.created_by?.name}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>{row.created_at}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.scheduled_date}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {capitalizeWords(row.status)}
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
    </MainLayout>
  );
};

export default Page;
