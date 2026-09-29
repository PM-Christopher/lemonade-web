import DataCard from "@/components/global/DataCard";
import PaginationComp from "@/components/global/Pagination";
import { affiliateHeaders } from "@/data/tableData";
import useSearchParams from "@/hooks/useSearchParams";
import { capitalizeWords } from "@/utils/helper";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";

const AffiliateView = ({ userData, menuOption }: any) => {
  const router = useRouter();
  const { searchParams } = useSearchParams();
  const query = searchParams?.get("q");

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const data = useMemo(() => {
    if (!userData) return [];
    if (menuOption !== "affiliates") return userData.users;
    if (!query || query.trim() === "") return userData.affiliates;

    const q = query.toLowerCase().trim();
    return userData.affiliates.filter((affiliate: any) => {
      return (
        affiliate?.unique_id?.toLowerCase().includes(q) ||
        affiliate?.fullname?.toLowerCase().includes(q)
      );
    });
  }, [userData, menuOption, query]);

  const resetPage =
    menuOption === "affiliates" && userData
      ? `${query ?? ""}`
      : null;
  const [seenPage, setSeenPage] = useState({ resetPage, userData });
  if (
    resetPage !== null &&
    (seenPage.resetPage !== resetPage || seenPage.userData !== userData)
  ) {
    setSeenPage({ resetPage, userData });
    setCurrentPage(1);
  }

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
      <div className={"flex justify-between gap-[24px] px-[12px] pb-[16px] pt-[8px]"}>
        <DataCard
          styles={"w-full"}
          title={"Total Referral Earnings"}
          count={userData?.total_referral_earnings || 0}
          isPrice={true}
        />
        <DataCard
          styles={"w-full"}
          title={"Total Number of Referrers"}
          count={userData?.total_referrers || 0}
        />
        <DataCard
          styles={"w-full"}
          title={"Total Number of Referrals"}
          count={userData?.total_referrals || 0}
        />
      </div>
      <div className={"flex w-full justify-between gap-[24px]"}>
        <div className="flex-1 bg-white">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-mid-grey">
                {affiliateHeaders.map((header, idx) => (
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
                    onClick={() => router.push(`/users/affiliate/${row.id}`)}
                  >
                    <td className={"p-4 font-sans text-sm font-medium"}>{row.unique_id}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row.name}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>{row.total_referrals}</td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      {row.subscribed_referrals}
                    </td>
                    <td className={"p-4 font-sans text-sm font-medium"}>
                      ₦{Number(row.earnings).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={affiliateHeaders.length}
                    className="p-4 text-center text-sm text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <PaginationComp
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            perPage={perPage}
          />
        </div>
        <div className="flex h-fit flex-col rounded-[12px] border-[1px] border-yellow-accent-3">
          <div className="h-[48px] w-[326px] rounded-tl-[12px] rounded-tr-[12px] bg-yellow-accent-1">
            <div className="flex items-center px-[24px] py-[16px]">
              <p className="text-[12px] font-semibold text-light-black">Top Referrers</p>
            </div>
          </div>
          <div className="flex flex-col rounded-bl-[12px] rounded-br-[12px] bg-yellow-accent-2">
            {userData?.top_referrers?.map((item: any, index: number) => (
              <div key={index} className="flex">
                <div className="flex h-[72px] w-[221px] items-center gap-[8px] p-[24px] px-[16px]">
                  <div className="h-[24px] w-[24px] rounded-full bg-gray-600"></div>
                  <p>{item?.name}</p>
                </div>
                <div className="w-[105px] p-[24px] px-[16px]">
                  <p>₦{Number(item?.total_earnings)?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AffiliateView;
