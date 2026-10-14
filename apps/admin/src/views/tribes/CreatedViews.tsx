"use client";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTribeListQuery } from "@/features/tribes/queries";
import PaginationComp from "@/components/global/Pagination";

const tribeHeaders = [
  "TRIBE ID",
  "TRIBE NAME",
  "CREATED BY",
  "CATEGORY",
  "MEMBERS",
  "DATE CREATED",
];

const CreatedTribeViews = () => {
  const { push } = useNavigation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useTribeListQuery({ enabled: isLoggedIn });
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const tribes = data?.tribes ?? [];
  const totalPages = Math.ceil(tribes.length / perPage) || 1;
  const startIndex = (currentPage - 1) * perPage;
  const paginatedTribes = tribes.slice(startIndex, startIndex + perPage);

  return (
    <div className="rounded-lg bg-white shadow-md">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-mid-grey">
            {tribeHeaders.map((header) => (
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
          {paginatedTribes.length > 0 ? (
            paginatedTribes.map((tribe) => (
              <tr
                key={tribe.id}
                className="border-grey-20 h-18 cursor-pointer border-b"
                onClick={() => push(routes.TRIBE_DETAIL(tribe.id))}
              >
                <td className="p-4 font-sans text-sm font-medium">{tribe.uuid}</td>
                <td className="p-4 font-sans text-sm font-medium">{tribe.name}</td>
                <td className="p-4 font-sans text-sm font-medium">{tribe.created_by}</td>
                <td className="p-4 font-sans text-sm font-medium">{tribe.category}</td>
                <td className="p-4 font-sans text-sm font-medium">{tribe.members}</td>
                <td className="p-4 font-sans text-sm font-medium">{tribe.date_created}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={tribeHeaders.length} className="p-4 text-center text-sm text-gray-500">
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
        perPage={perPage}
      />
    </div>
  );
};

export default CreatedTribeViews;
