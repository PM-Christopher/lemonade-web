"use client";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTribeListQuery } from "@/features/tribes/queries";
import type { AdminTribeListItem } from "@/features/tribes/api";
import PaginationComp from "@/components/global/Pagination";

export type TribeListFilter = "created" | "tln" | "paid";

const FILTERS: Record<TribeListFilter, (tribe: AdminTribeListItem) => boolean> = {
  created: (tribe) => !tribe.created_by_admin,
  tln: (tribe) => tribe.created_by_admin,
  paid: (tribe) => tribe.monetized,
};

const BASE_HEADERS = ["TRIBE ID", "TRIBE NAME", "CREATED BY", "CATEGORY"];
const TAIL_HEADERS = ["MEMBERS", "DATE CREATED"];

const PER_PAGE = 10;

// One table for the Created, TLN and Paid tabs. Paid adds the access fee.
const TribeListView = ({ filter }: { filter: TribeListFilter }) => {
  const { push } = useNavigation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useTribeListQuery({ enabled: isLoggedIn });
  const [currentPage, setCurrentPage] = useState(1);

  const showAccessFee = filter === "paid";
  const headers = showAccessFee
    ? [...BASE_HEADERS, "ACCESS FEE", ...TAIL_HEADERS]
    : [...BASE_HEADERS, ...TAIL_HEADERS];

  const tribes = (data?.tribes ?? []).filter(FILTERS[filter]);
  const totalPages = Math.ceil(tribes.length / PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PER_PAGE;
  const pageTribes = tribes.slice(startIndex, startIndex + PER_PAGE);

  return (
    <div className="rounded-lg bg-white shadow-md">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-mid-grey">
            {headers.map((header) => (
              <th
                className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
                key={header}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageTribes.length > 0 ? (
            pageTribes.map((tribe) => (
              <tr
                key={tribe.id}
                className="border-grey-20 h-18 cursor-pointer border-b"
                onClick={() => push(routes.TRIBE_DETAIL(tribe.id))}
              >
                <td className="p-4 font-sans text-sm font-medium">{tribe.uuid}</td>
                <td className="p-4 font-sans text-sm font-medium">{tribe.name}</td>
                <td className="p-4 font-sans text-sm font-medium">{tribe.created_by}</td>
                <td className="p-4 font-sans text-sm font-medium">{tribe.category}</td>
                {showAccessFee && (
                  <td className="p-4 font-sans text-sm font-medium">
                    ₦{Number(tribe.access_fee).toLocaleString()}
                  </td>
                )}
                <td className="p-4 font-sans text-sm font-medium">{tribe.members}</td>
                <td className="p-4 font-sans text-sm font-medium">{tribe.date_created}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="p-4 text-center text-sm text-gray-500">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PaginationComp
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        perPage={PER_PAGE}
      />
    </div>
  );
};

export default TribeListView;
