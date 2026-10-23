"use client";
import { usePagination } from "@/hooks/usePagination";
import PaginationComp from "@/components/global/Pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import React from "react";
import { centerNumericColumns } from "@/utils/tableAlign";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigation } from "@/hooks/useNavigation";
import { routes } from "@/lib/routes";
import { AvatarName } from "@/components/global/AvatarName";
import { useBusinessListQuery } from "@/features/businesses/queries";
import type { BusinessFilters } from "@/features/businesses/api";
import { businessStatusClass, businessStatusLabel, firstWithCount } from "./businessFormat";

const HEADERS = [
  "BUSINESS ID",
  "BUSINESS NAME",
  "BUSINESS OWNER",
  "CATEGORY",
  "SERVICES",
  "DATE CREATED",
  "STATUS",
];

export function Chips({ items }: { items: ReadonlyArray<string> | null | undefined }) {
  const { first, more } = firstWithCount(items);
  return (
    <div className="flex items-center gap-1">
      <span className="bg-light-grey text-meta max-w-24 truncate rounded px-1.5 py-0.5">
        {first}
      </span>
      {more > 0 && <span className="text-meta">+{more}</span>}
    </div>
  );
}

// Every business listing with its owner, categories and review status.
export function BusinessListView({ filters }: { filters: BusinessFilters }) {
  const { push } = useNavigation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useBusinessListQuery(filters, { enabled: isLoggedIn });
  const businesses = data?.businesses ?? [];

  const pager = usePagination(businesses, JSON.stringify(filters));

  return (
    <div className="rounded-lg bg-white shadow-md">
      <table className={`min-w-full table-auto border-collapse ${centerNumericColumns(HEADERS)}`}>
        <thead>
          <tr className="bg-mid-grey">
            {HEADERS.map((header) => (
              <th
                key={header}
                className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {businesses.length > 0 ? (
            pager.pageItems.map((business) => (
              <tr
                key={business.id}
                className="border-grey-20 h-18 cursor-pointer border-b"
                onClick={() => push(routes.BUSINESS_DETAIL(business.id))}
              >
                <td className="p-4 font-sans text-sm font-medium">{business.unique_id}</td>
                <td className="p-4 font-sans text-sm font-medium">
                  <AvatarName name={business.name} image={business.image} />
                </td>
                <td className="p-4 font-sans text-sm font-medium">
                  {business.owner?.name ?? "N/A"}
                </td>
                <td className="p-4 font-sans text-sm font-medium">
                  <Chips items={business.categories} />
                </td>
                <td className="p-4 font-sans text-sm font-medium">
                  <Chips items={business.services} />
                </td>
                <td className="p-4 font-sans text-sm font-medium">
                  {dayjs(business.date_submitted).format("DD MMM, YYYY hh:mm A")}
                </td>
                <td
                  className={`p-4 font-sans text-sm font-medium ${businessStatusClass(business.status)}`}
                >
                  {businessStatusLabel(business.status)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={HEADERS.length} className="p-4 text-center text-sm text-gray-500">
                {isLoading ? "Loading..." : "No data available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PaginationComp
        currentPage={pager.page}
        totalPages={pager.totalPages}
        onPageChange={pager.setPage}
        perPage={DEFAULT_PAGE_SIZE}
      />
    </div>
  );
}
