"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, ChevronDown, SearchIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/global/DataCard";
import { walletHeaders } from "@/data/tableData";
import WalletThresholdModal from "@/modals/wallet-management/WalletThresholdModal";
import { useSelector } from "react-redux";
import { useWalletDataQuery, useWithdrawalRequestsQuery } from "@/features/wallet/queries";
import { RootState } from "@/redux/store";
import dayjs from "dayjs";

function WalletMgtPage({}) {
  const [editThreshold, setEditThreshold] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(5); // Number of items per page

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: withdrawalRequests } = useWithdrawalRequestsQuery({ enabled: isLoggedIn });
  const { data: walletData } = useWalletDataQuery({ enabled: isLoggedIn });

  // Handle searching
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Filter data based on search term
  const filteredData =
    withdrawalRequests?.history?.filter((row: any) =>
      row?.fullname?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Get current items for the page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const toggleEditThreshold = () => {
    setEditThreshold(!editThreshold);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const maxPageButtons = 5;
    const pageNumbers = [];

    if (totalPages <= maxPageButtons) {
      // Show all pages if total pages are less than max buttons
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Calculate which page numbers to show
      if (currentPage <= 3) {
        // If we're near the beginning
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // If we're near the end
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // If we're in the middle
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }

    return pageNumbers;
  };

  return (
    <MainLayout>
      <section className="mt-[20px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"text-[16px] font-semiBold"}>
            {withdrawalRequests?.history?.length || 0} Wallets
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
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full rounded-xl bg-light-grey py-4 text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder="Search guest name, email address"
                />
              </div>
            </div>
            {/* <div
              className={
                "flex border-[1px] border-grey-20 bg-none w-[193px] h-[40px] px-[16px] py-[10px] rounded-[12px] justify-between items-center"
              }
            >
              <div className={"flex justify-between items-center"}>
                <p className={"text-[12px] font-semiBold text-text-grey"}>
                  STATUS
                </p>
              </div>
              <ChevronDown className={"text-text-grey w-[20px]"} />
            </div> */}
            {/* <div
              className={
                "flex border-[1px] border-grey-20 bg-none w-[193px] h-[40px] px-[16px] py-[10px] rounded-[12px] justify-between items-center"
              }
            >
              <div className={"flex gap-2 items-center"}>
                <CalendarIcon className={"text-text-grey w-[15px] h-[15px]"} />
                <p className={"text-[12px] font-semiBold text-text-grey"}>
                  ALL TIME
                </p>
              </div>
              <ChevronDown className={"text-text-grey w-[20px]"} />
            </div> */}
            <div>
              <Button
                className={"flex h-[40px] rounded-[12px] border-step-color bg-gradient-green"}
              >
                <UploadIcon className={"h-[15px] w-[15px] text-white"} />
                <p className={"text-[16px] font-medium text-white"}>Export</p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div className={"flex flex-col rounded-[12px] border-[1px] border-grey-20"}>
            <div className={"grid grid-cols-3 gap-[24px] px-[12px] pb-[16px] pt-[8px]"}>
              <DataCard
                title={"Wallet Revenue"}
                count={walletData?.wallet_revenue || 0}
                isPrice={true}
              />
              <DataCard title={"Total Wallets"} count={walletData?.total_wallets || 0} />
              <DataCard
                title={"Withdrawal Threshold"}
                count={walletData?.withdrawal_threshold || 0}
                isPrice={true}
                isEditable={true}
                handleChange={toggleEditThreshold}
              />
            </div>
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-mid-grey">
                    {walletHeaders.map((header, idx) => (
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
                  {currentItems.length > 0 ? (
                    currentItems.map((row: any, index: any) => (
                      <tr
                        key={index}
                        className="h-[72px] cursor-pointer border-b border-grey-20"
                        onClick={() => (window.location.href = `/wallet-management/${row.id}`)}
                      >
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {row?.txn_id ?? "N/A"}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>{row.fullname}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>₦{row.amount}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {dayjs(row.created_at).format("YYYY-MM-DD hh:mm:ss A")}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {dayjs(row.date_paid).format("YYYY-MM-DD hh:mm:ss A")}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium capitalize"}>
                          {row.status}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={walletHeaders.length}
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between rounded-bl-lg rounded-br-lg bg-mid-grey p-4 px-10">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex h-9 items-center gap-2 rounded-lg border-2 border-light-grey-50 p-2 text-gray-500 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`h-8 w-8 rounded-lg p-2 text-sm font-medium ${
                        page === currentPage ? "bg-light-white text-text-grey" : "text-gray-500"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex h-9 items-center gap-2 rounded-lg border-2 border-light-grey-50 p-2 text-gray-500 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <WalletThresholdModal isOpen={editThreshold} toggle={toggleEditThreshold} />
    </MainLayout>
  );
}

export default WalletMgtPage;
