import { AvatarName } from "@/components/global/AvatarName";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import { centerNumericColumns } from "@/utils/tableAlign";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useMemo, useState } from "react";
import { usersHeaders } from "@/data/tableData";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";

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
  const { push } = useNavigation();
  const { searchParams } = useSearchParams();
  const status = searchParams?.get("status");

  const [localPage, setLocalPage] = useState(1);
  const perPage = DEFAULT_PAGE_SIZE;

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

    const s = status?.toLowerCase()?.trim();
    if (!s) return users;

    return users.filter((user) => user?.status?.toLowerCase() === s);
  }, [userData, menuOption, isServerPaginated, status]);

  const resetPage =
    menuOption === "users" && userData && !isServerPaginated ? `${status ?? ""}` : null;
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
        <table
          className={`min-w-full table-auto border-collapse ${centerNumericColumns(usersHeaders)}`}
        >
          <thead>
            <tr className="bg-mid-grey">
              {usersHeaders.map((header, idx) => (
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
              paginatedData.map((row, index) => (
                <tr
                  key={index}
                  className="border-grey-20 h-18 cursor-pointer border-b"
                  onClick={() => push(routes.USER_DETAIL(row.id))}
                >
                  <td className={"p-4 font-sans text-sm font-medium"}>{row.unique_id}</td>
                  <td className={"p-4 font-sans text-sm font-medium"}>
                    <div className="flex items-center gap-2">
                      <AvatarName name={row.fullname} image={row.profile_image} />
                      {row.unread_support_messages > 0 && (
                        <span
                          aria-label={`${row.unread_support_messages} unread messages`}
                          className="bg-red-1 text-meta ml-2 rounded-full px-1.5 leading-normal font-medium text-white"
                        >
                          {row.unread_support_messages}
                        </span>
                      )}
                    </div>
                  </td>
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
