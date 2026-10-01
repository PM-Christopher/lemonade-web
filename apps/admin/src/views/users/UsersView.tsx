import React, { useMemo, useState } from "react";
import { usersHeaders } from "@/data/tableData";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { useRouter } from "next/navigation";
import useSearchParams from "@/hooks/useSearchParams";
import type { AffiliateListResponse, UserListResponse } from "@/features/user/api";

interface UsersViewsProps {
  userData: UserListResponse | AffiliateListResponse | undefined;
  menuOption: string;
  page: number | undefined;
  onPageChange: (page: number) => void;
}

// `userData.meta` present -> the backend already paginated this response
// (docs/ARCHITECTURE.md §22 Conflict 1) — `data` is just the current page,
// so render it directly and drive the pager from `page`/`onPageChange`
// (URL state, owned by UsersClient). `meta` absent -> a search/status
// filter is active, UsersClient fetched the old unpaginated shape instead,
// and this component falls back to exactly the client-side filter + slice
// it always did, with its own local page state.
function UsersViews({ userData: rawUserData, menuOption, page, onPageChange }: UsersViewsProps) {
  const router = useRouter();
  const { searchParams } = useSearchParams();
  const query = searchParams?.get("q");
  const status = searchParams?.get("status");

  const [localPage, setLocalPage] = useState(1);
  const perPage = 10;

  // UsersClient.tsx only renders this view for the "users" tab, where
  // useUserListQuery always resolves to UserListResponse — the union prop
  // type comes from userData being shared with AffiliateView, the other
  // tab's sibling component.
  const userData = rawUserData as UserListResponse | undefined;

  const isServerPaginated = Boolean(userData?.meta);

  const data = useMemo(() => {
    if (!userData) return [];
    const users = userData.users;
    if (menuOption !== "users" || isServerPaginated) return users;

    if ((!query && !status) || query?.trim() === "") return users;

    const q = query?.toLowerCase()?.trim();
    const s = status?.toLowerCase()?.trim();

    return users.filter((user) => {
      const matchesQuery =
        !q ||
        user?.unique_id?.toLowerCase().includes(q) ||
        user?.location?.toLowerCase().includes(q) ||
        user?.fullname?.toLowerCase().includes(q) ||
        user?.email?.toLowerCase().includes(q);

      const matchesStatus = !s || user?.status?.toLowerCase() === s;

      return matchesQuery && matchesStatus;
    });
  }, [userData, menuOption, isServerPaginated, query, status]);

  const resetPage =
    menuOption === "users" && userData && !isServerPaginated
      ? `${query ?? ""}|${status ?? ""}`
      : null;
  const [seenPage, setSeenPage] = useState({ resetPage, userData });
  if (resetPage !== null && (seenPage.resetPage !== resetPage || seenPage.userData !== userData)) {
    setSeenPage({ resetPage, userData });
    setLocalPage(1);
  }

  const totalPages =
    isServerPaginated && userData?.meta
      ? userData.meta.last_page
      : Math.ceil((data?.length ?? 0) / perPage);
  const currentPage = isServerPaginated ? (page ?? 1) : localPage;
  const paginatedData = isServerPaginated
    ? data
    : data?.slice((localPage - 1) * perPage, localPage * perPage);

  const handlePageChange = (nextPage: number) => {
    if (isServerPaginated && onPageChange) {
      onPageChange(nextPage);
    } else {
      setLocalPage(nextPage);
    }
  };

  return (
    <>
      <div className="rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-mid-grey">
              {usersHeaders.map((header, idx) => (
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
                  onClick={() => router.push(`/users/${row.id}`)}
                >
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.unique_id}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.fullname}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.email}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    {capitalizeWords(row.account_plan)}
                  </td>
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.location}</td>
                  <td className={`p-4 font-sans text-sm font-medium`}>{row.date_joined}</td>
                  <td className={`p-4 font-sans text-sm font-medium ${GetStatusClass(row.status)}`}>
                    {capitalizeWords(row.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={usersHeaders.length} className="p-4 text-center text-sm text-gray-500">
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
  );
}

export default UsersViews;
