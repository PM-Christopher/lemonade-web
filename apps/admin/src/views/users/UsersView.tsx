import React, { useEffect, useState } from "react";
import DataCard from "@/components/global/DataCard";
import GlobalTable from "@/components/global/GlobalTable";
import { usersData, usersHeaders } from "@/data/tableData";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { useRouter } from "next/navigation";
import useSearchParams from "@/hooks/useSearchParams";

function UsersViews({ userData, menuOption }: any) {
  const router = useRouter();
  const { searchParams } = useSearchParams();
  const query = searchParams?.get("q");
  const status = searchParams?.get("status");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [data, setData] = useState<any>(userData?.users || []);

  // Update data when userData changes
  useEffect(() => {
    if (userData) {
      setData(userData.users);
    }
  }, [userData]);
  // Search + reset pagination
  useEffect(() => {
    if (menuOption !== "users") return;
    if (!userData) return;

    if ((!query && !status) || query?.trim() === "") {
      setData(userData.users);
    } else {
      const q = query?.toLowerCase()?.trim();
      const s = status?.toLowerCase()?.trim();

      const filtered = userData.users.filter((user: any) => {
        const matchesQuery =
          !q ||
          user?.unique_id?.toLowerCase().includes(q) ||
          user?.location?.toLowerCase().includes(q) ||
          user?.fullname?.toLowerCase().includes(q) ||
          user?.email?.toLowerCase().includes(q);

        const matchesStatus = !s || user?.status?.toLowerCase() === s;

        return matchesQuery && matchesStatus;
      });

      setData(filtered);
    }

    setCurrentPage(1); // Reset to first page on search
  }, [query, status, userData, menuOption]);

  // Calculate pagination from filtered data
  const totalPages = Math.ceil(data?.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = data?.slice(startIndex, startIndex + perPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="rounded-lg bg-white shadow-md">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-mid-grey">
              {usersHeaders.map((header, idx) => (
                <th className="p-4 text-left text-[12px] font-semiBold text-text-grey" key={idx}>
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
