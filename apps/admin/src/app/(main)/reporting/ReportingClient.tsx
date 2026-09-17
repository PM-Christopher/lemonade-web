"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, ChevronDown, SearchIcon } from "lucide-react";
import { reportHeaders } from "@/data/tableData";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useReportsQuery } from "@/features/reporting/queries";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

function ReportingClient() {
  const router = useRouter();
  // State for current page and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: reportData } = useReportsQuery({ enabled: isLoggedIn });

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((reportData?.reports?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = reportData?.reports?.slice(
    startIndex,
    startIndex + perPage,
  );

  return (
    <MainLayout>
      <section className="mt-[24px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"text-[16px] font-semiBold"}>
            {paginatedData?.length} Reports
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
                  placeholder="Search event, ID..."
                />
              </div>
            </div>
            <div
              className={
                "flex h-[40px] w-[193px] items-center justify-between rounded-[12px] border-[1px] border-grey-20 bg-none px-[16px] py-[10px]"
              }
            >
              <div className={"flex items-center justify-between"}>
                <p className={"text-[12px] font-semiBold text-text-grey"}>
                  STATUS
                </p>
              </div>
              <ChevronDown className={"w-[20px] text-text-grey"} />
            </div>
            <div
              className={
                "flex h-[40px] w-[193px] items-center justify-between rounded-[12px] border-[1px] border-grey-20 bg-none px-[16px] py-[10px]"
              }
            >
              <div className={"flex items-center gap-2"}>
                <CalendarIcon className={"h-[15px] w-[15px] text-text-grey"} />
                <p className={"text-[12px] font-semiBold text-text-grey"}>
                  ALL TIME
                </p>
              </div>
              <ChevronDown className={"w-[20px] text-text-grey"} />
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div
            className={
              "flex flex-col rounded-[12px] border-[1px] border-grey-20"
            }
          >
            {/*<GlobalTable headers={reportHeaders} content={reportData}/>*/}
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-mid-grey">
                    {reportHeaders.map((header, idx) => (
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
                        onClick={() => router.push(`/reporting/${row.id}`)}
                      >
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.id}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.reported_by.name}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {capitalizeWords(row.category)}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.case}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {dayjs(row.date_submitted).format(
                            "DD MMM, YYYY hh:mmA",
                          )}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {capitalizeWords(row.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={reportHeaders.length}
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
}

export default ReportingClient;
