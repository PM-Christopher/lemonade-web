"use client";
import React, { useState } from "react";
import { PrinterIcon } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useWalletDetailQuery } from "@/features/wallet/queries";
import type { WalletDetail } from "@/features/wallet/api";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import { formatNumberWithCommas } from "@/lib/formatNumber";

function TransactionWalletDetailsClient({ id }: { id: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const router = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  // Same endpoint the already-migrated wallet domain uses — reused rather
  // than duplicated, see features/transaction/api.ts's note.
  const { data: wallet } = useWalletDetailQuery(id, { enabled: isLoggedIn });

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((wallet?.history?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = wallet?.history?.slice(startIndex, startIndex + perPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const printCSV = () => {
    if (!wallet?.history || wallet.history.length === 0) {
      alert("No data available to export");
      return;
    }

    // Define CSV headers
    const headers = ["ID", "User Id", "Full Name", "Amount", "Status", "Wallet Id", "Created At"];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(","), // Header row
      // NOTE (found, not fixed — pre-existing, predates this pass):
      // `item.user.fullname` below doesn't match WalletDetail["history"]'s
      // defined shape, which has no `user` field — either the type is
      // missing a real field or this throws at runtime for any row without
      // one. Typing `user` as always-present here (rather than optional)
      // to keep the exact original runtime behavior — including the
      // crash-if-absent — unchanged, instead of guessing which side is wrong.
      ...wallet.history.map((historyItem) => {
        const item = historyItem as WalletDetail["history"][number] & {
          user: { fullname?: string };
        };
        return [
          item.id,
          item.user_id,
          `"${item?.user.fullname}"`,
          item.amount,
          item.status,
          item.wallet_id,
          `"${item.created_at}"`,
        ].join(",");
      }),
    ];

    // Create CSV content
    const csvContent = csvRows.join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    // Set up download link
    link.setAttribute("href", url);
    link.setAttribute("download", `payment_history_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";

    // Append to document, trigger download and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-col">
        <div
          className={"flex h-fit w-[600px] flex-col gap-[20px] rounded-[12px] bg-white p-[24px]"}
        >
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Full name:</p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>{wallet?.info?.fullname}</p>
              <p
                className={"text-light-green cursor-pointer text-[14px] font-medium"}
                onClick={() => router.push(`/users/${wallet?.history[0]?.user_id}`)}
              >
                View profile
              </p>
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Transaction Id:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{wallet?.history[0]?.wallet_id}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Date Paid:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{wallet?.info?.date_paid}</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Amount:</p>
            </div>
            <p className={"text-[14px] font-medium"}>
              N{formatNumberWithCommas(Number(wallet?.info?.amount) || 0)}
            </p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Subscription Type:</p>
            </div>
            <p className={"text-[14px] font-medium"}>Yearly</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
            </div>
            <p className={"text-light-green-70 text-[14px] font-medium"}>
              {capitalizeWords(wallet?.info?.status)}
            </p>
          </div>
        </div>

        {/* payout history */}
        <div className="flex w-full flex-col lg:w-2/3">
          <div className={"h-[700px] rounded-tl-[12px] rounded-tr-[12px] bg-white"}>
            <div
              className={
                "border-b-grey-20 flex items-center justify-between border-b-[1px] p-[24px]"
              }
            >
              <p className={"font-semiBold text-[16px]"}>Payout history</p>
              <div
                className={
                  "border-light-grey-50 flex items-center gap-[10px] rounded-[12px] border-[1px] px-[12px] py-[10px]"
                }
                onClick={printCSV}
              >
                <PrinterIcon className={"w-[20px]"} />
                <p className={"text-black-light text-[16px] font-medium"}>Print</p>
              </div>
            </div>

            <div className={"flex flex-col px-[24px]"}>
              {paginatedData?.map((item: WalletDetail["history"][number], index: number) => (
                <div className="px-[16px] pt-[16px] pb-[24px]" key={index}>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <p className={"text-[14px] font-medium"}>
                        {item?.wallet?.wallet_id} - ₦{formatNumberWithCommas(item?.amount ?? 0)}
                      </p>
                      <p className={"text-text-grey text-[12px] font-normal"}>
                        23, Mar 2023. 05:00PM
                      </p>
                    </div>
                    <div
                      className={
                        "bg-light-green-60 h-fit gap-[4px] rounded-[8px] px-[8px] py-[4px]"
                      }
                    >
                      <p className={"text-light-green-70 text-[12px] font-medium"}>
                        {capitalizeWords(item?.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-2">
            <PaginationComp
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              perPage={perPage}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default TransactionWalletDetailsClient;
