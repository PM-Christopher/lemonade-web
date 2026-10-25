"use client";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { routes } from "@/lib/routes";
import { centerNumericColumns } from "@/utils/tableAlign";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { teamHeaders } from "@/data/tableData";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { capitalizeWords, formatRoleName, GetStatusClass } from "@/utils/helper";
import { AvatarName } from "@/components/global/AvatarName";
import { shortDate } from "@/views/transactions/transactionFormat";
import PaginationComp from "@/components/global/Pagination";
import { useTeamQuery } from "@/features/team/queries";
import type { TeamMember } from "@/features/team/api";
import dynamic from "next/dynamic";
import { SearchBox } from "@/components/global/SearchBox";
import { useSearchTerm } from "@/hooks/useSearchTerm";

// Off the initial bundle — only needed once "Add member" is clicked
// (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const AddMember = dynamic(() => import("@/modals/team/AddMemberModal"), {
  ssr: false,
});

function TeamClient() {
  const { push } = useNavigation();
  // State for current page and items per page
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = DEFAULT_PAGE_SIZE;
  const { value: searchValue, setValue: setSearchValue, term } = useSearchTerm();

  const [isOpen, setOpen] = useState(false);

  const toggelModal = () => {
    setOpen(!isOpen);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: teamData } = useTeamQuery({ enabled: isLoggedIn, search: term });

  const data = teamData?.admins;

  const [seenList, setSeenList] = useState({ term, teamData });
  if (term !== seenList.term || teamData !== seenList.teamData) {
    setSeenList({ term, teamData });
    setCurrentPage(1);
  }

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((data?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = data?.slice(startIndex, startIndex + perPage);

  return (
    <>
      <section className="mt-6 flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-body-l"}>
            {teamData?.admins?.length || 0} Team Members
          </p>
          <div className={"flex justify-between gap-3"}>
            <SearchBox
              value={searchValue}
              onChange={setSearchValue}
              label="Search team members"
              placeholder="Search member, role..."
            />
            <div>
              <Button
                className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}
                onClick={toggelModal}
              >
                <PlusIcon className={"h-3.75 w-3.75 text-white"} />
                <p className={"text-body-l font-medium text-white"}>Add Member</p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-5"}>
          <div className={"border-grey-20 flex flex-col rounded-xl border"}>
            <div className="rounded-lg bg-white shadow-md">
              <table
                className={`min-w-full table-auto border-collapse ${centerNumericColumns(teamHeaders)}`}
              >
                <thead>
                  <tr className="bg-mid-grey">
                    {teamHeaders.map((header, idx) => (
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
                    paginatedData.map((row: TeamMember, index: number) => (
                      <tr
                        key={index}
                        className="border-grey-20 h-18 cursor-pointer border-b"
                        onClick={() => push(routes.TEAM_DETAIL(row.id))}
                      >
                        <td
                          className={
                            "text-text-grey p-4 font-sans text-sm font-medium whitespace-nowrap"
                          }
                        >
                          {row.unique_id || "N/A"}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          <AvatarName name={row.name} image={row.image} />
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>{row.email}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {formatRoleName(row.role)}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium whitespace-nowrap"}>
                          {shortDate(row.created_at)}
                        </td>
                        <td
                          className={`p-4 font-sans text-sm font-medium ${GetStatusClass(capitalizeWords(row.status))}`}
                        >
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
    </>
  );
}

export default TeamClient;
