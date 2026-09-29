"use client";
import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { teamHeaders } from "@/data/tableData";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { useTeamQuery } from "@/features/team/queries";
import dynamic from "next/dynamic";
import useDebounce from "@/hooks/useDebounce";
import useSearchParams from "@/hooks/useSearchParams";

// Off the initial bundle — only needed once "Add member" is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const AddMember = dynamic(() => import("@/modals/team/AddMemberModal"), {
  ssr: false,
});

function TeamClient() {
  const router = useRouter();
  // State for current page and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { searchParams } = useSearchParams();
  const query = searchParams?.get("search");

  const [searchValue, setSearchValue] = useState("");

  const [isOpen, setOpen] = useState(false);

  const toggelModal = () => {
    setOpen(!isOpen);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: teamData } = useTeamQuery({ enabled: isLoggedIn });

  const data = useMemo(() => {
    const admins = teamData?.admins;
    const q = query?.toLowerCase()?.trim();
    if (!q) return admins;
    return admins?.filter((user: any) => {
      return (
        user?.name?.toLowerCase().includes(q) ||
        user?.email?.toLowerCase().includes(q)
      );
    });
  }, [query, teamData]);

  const [seenList, setSeenList] = useState({ query, teamData });
  if (query !== seenList.query || teamData !== seenList.teamData) {
    setSeenList({ query, teamData });
    setCurrentPage(1);
  }

  const { debouncedValue } = useDebounce(searchValue, 500);
  const { setSearchParams } = useSearchParams();
  useEffect(() => {
    setSearchParams({ search: debouncedValue });
    // setSearchParams's identity changes on every navigation (it depends on
    // useSearchParams()'s live searchParams — see hooks/useSearchParams.ts),
    // so including it here would re-run this effect after every push and
    // push again, in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil(data?.length / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = data?.slice(startIndex, startIndex + perPage);

  return (
    <MainLayout>
      <section className="mt-[24px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"text-[16px] font-semiBold"}>
            {teamData?.admins?.length || 0} Team Members
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
                  placeholder="Search member, ID..."
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Button
                className={
                  "flex h-[40px] rounded-[12px] border-step-color bg-gradient-green"
                }
                onClick={toggelModal}
              >
                <PlusIcon className={"h-[15px] w-[15px] text-white"} />
                <p className={"text-[16px] font-medium text-white"}>
                  Add Member
                </p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div
            className={
              "flex flex-col rounded-[12px] border-[1px] border-grey-20"
            }
          >
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-mid-grey">
                    {teamHeaders.map((header, idx) => (
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
                        onClick={() => router.push(`/team/${row.id}`)}
                      >
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.unique_id}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.name}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.email}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {capitalizeWords(row.role)}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row.created_at}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {capitalizeWords(row.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={teamHeaders.length}
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

      <AddMember isOpen={isOpen} toggle={toggelModal} />
    </MainLayout>
  );
}

export default TeamClient;
