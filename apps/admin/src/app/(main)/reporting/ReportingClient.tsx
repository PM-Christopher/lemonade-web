"use client";
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, ChevronDown, SearchIcon } from "lucide-react";
import { reportHeaders } from "@/data/tableData";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useReportsQuery } from "@/features/reporting/queries";
import type { ReportRow } from "@/features/reporting/api";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import useSearchParams from "@/hooks/useSearchParams";

const PER_PAGE = 10;

function ReportingClient() {
  const router = useRouter();
  const { searchParams, setSearchParams } = useSearchParams();
  const currentPage = Number(searchParams?.get("page") ?? 1);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: reportData } = useReportsQuery({
    enabled: isLoggedIn,
    page: currentPage,
    perPage: PER_PAGE,
  });

  // The backend already paginated this (docs/ARCHITECTURE.md §22 Conflict 1)
  // — reportData.reports is just the current page, no client-side slicing.
  const totalPages = reportData?.meta?.last_page ?? 1;
  const paginatedData = reportData?.reports;

  return (
    <MainLayout>
      <section className="mt-[24px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"font-semiBold text-[16px]"}>
            {reportData?.meta?.total ?? paginatedData?.length ?? 0} Reports
          </p>
          <div className={"flex justify-between gap-[12px]"}>
            <div className="bg-light_grey border-grey-20 flex h-[40px] w-[285px] items-center gap-3 rounded-[12px] border-[1px] p-2 px-[12px]">
              <div>
                <SearchIcon className={"text-grey-40 h-[12px] w-[12px]"} />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="bg-light-grey w-full rounded-xl py-4 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder="Search event, ID..."
                />
              </div>
            </div>
            <div
              className={
                "border-grey-20 flex h-[40px] w-[193px] items-center justify-between rounded-[12px] border-[1px] bg-none px-[16px] py-[10px]"
              }
            >
              <div className={"flex items-center justify-between"}>
                <p className={"font-semiBold text-text-grey text-[12px]"}>STATUS</p>
              </div>
              <ChevronDown className={"text-text-grey w-[20px]"} />
            </div>
            <div
              className={
                "border-grey-20 flex h-[40px] w-[193px] items-center justify-between rounded-[12px] border-[1px] bg-none px-[16px] py-[10px]"
              }
            >
              <div className={"flex items-center gap-2"}>
                <CalendarIcon className={"text-text-grey h-[15px] w-[15px]"} />
                <p className={"font-semiBold text-text-grey text-[12px]"}>ALL TIME</p>
              </div>
              <ChevronDown className={"text-text-grey w-[20px]"} />
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div className={"border-grey-20 flex flex-col rounded-[12px] border-[1px]"}>
            {/*<GlobalTable headers={reportHeaders} content={reportData}/>*/}
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-mid-grey">
                    {reportHeaders.map((header, idx) => (
                      <th
                        className="font-semiBold text-text-grey p-4 text-left text-[12px]"
                        key={idx}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData && paginatedData.length > 0 ? (
                    paginatedData.map((row: ReportRow, index: number) => (
                      <tr
                        key={index}
                        className="border-grey-20 h-[72px] cursor-pointer border-b"
                        onClick={() => router.push(`/reporting/${row.id}`)}
                      >
                        <td className={"p-4 font-sans text-sm font-medium"}>{row.id}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.reported_by.name}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {capitalizeWords(row.category)}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>{row.case}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {dayjs(row.date_submitted).format("DD MMM, YYYY hh:mmA")}
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
                perPage={PER_PAGE}
              />
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default ReportingClient;
