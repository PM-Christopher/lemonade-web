"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { PrinterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePlanSubscriptionDetailQuery } from "@/features/transaction/queries";
import type { TransactionHistoryRow } from "@/features/transaction/api";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";

function SubscriptionDetailsClient({ id }: { id: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const router = useRouter();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { data: subscription } = usePlanSubscriptionDetailQuery(id, {
    enabled: isLoggedIn,
  });

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((subscription?.history?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  // NOTE (found, not fixed — a real pre-existing bug, not something this
  // pass should change): the table below renders subscription?.history
  // directly, not a page-sliced subset, so these pagination controls
  // don't actually limit what's shown.

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const printCSV = () => {
    if (!subscription?.history || subscription.history.length === 0) {
      alert("No data available to export");
      return;
    }

    // Define CSV headers
    const headers = [
      "ID",
      "Transaction ID",
      "User ID",
      "Amount",
      "Full Name",
      "Plan",
      "Status",
      "Created At",
    ];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...subscription.history.map((item: TransactionHistoryRow) => {
        return [
          item.id,
          item.txn_id,
          item.user_id,
          item.amount,
          `"${item.fullname}"`, // Wrap in quotes to handle commas in names
          `"${item.plan}"`,
          item.status,
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
        {/* User Info Card */}
        <div className="flex h-fit w-full flex-col gap-4 rounded-xl bg-white p-4 md:gap-5 md:p-6 lg:w-1/3">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="min-w-20 sm:w-28">
              <p className="text-text-grey text-xs font-medium">Full name:</p>
            </div>
            <div className="flex flex-wrap gap-1">
              <p className="text-sm font-medium">{subscription?.info?.fullname}</p>
              <p
                className="text-light-green cursor-pointer text-sm font-medium"
                onClick={() => router.push(`/users/${subscription?.info?.user_id}`)}
              >
                View profile
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="min-w-20 sm:w-28">
              <p className="text-text-grey text-xs font-medium">Transaction Id:</p>
            </div>
            <p className="text-sm font-medium break-all">{subscription?.info?.txn_id}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="min-w-20 sm:w-28">
              <p className="text-text-grey text-xs font-medium">Account Plan:</p>
            </div>
            <p className="text-sm font-medium">{subscription?.info?.plan}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="min-w-20 sm:w-28">
              <p className="text-text-grey text-xs font-medium">Amount:</p>
            </div>
            <p className="text-sm font-medium">N{subscription?.info?.amount}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="min-w-20 sm:w-28">
              <p className="text-text-grey text-xs font-medium">Subscription Type:</p>
            </div>
            <p className="text-sm font-medium capitalize">
              {subscription?.history[0].subscription_type}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="min-w-20 sm:w-28">
              <p className="text-text-grey text-xs font-medium">Date Paid:</p>
            </div>
            <p className="text-sm font-medium">{subscription?.history[0]?.date_paid || null}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
            <div className="min-w-20 sm:w-28">
              <p className="text-text-grey text-xs font-medium">Status:</p>
            </div>
            <p className="text-light-green-70 text-sm font-medium">
              {capitalizeWords(subscription?.info?.status)}
            </p>
          </div>
        </div>

        {/* Account Plan and Payment History */}
        <div className="flex w-full flex-col lg:w-2/3">
          <div className="overflow-hidden rounded-t-xl bg-white">
            <div className="border-b-grey-20 flex items-center justify-between border-b p-4 md:p-6">
              <p className="text-base font-semibold">Account plan</p>
              <div
                className="border-light-grey-50 flex cursor-pointer items-center gap-2 rounded-xl border px-2 py-2 md:px-3"
                onClick={printCSV}
              >
                <PrinterIcon className="w-4 md:w-5" />
                <p className="text-black-light text-sm font-medium md:text-base">Print</p>
              </div>
            </div>

            <div className="flex flex-col gap-6 p-4 md:gap-10 md:p-6">
              {/* Premium Plan Card */}
              <div className="border-b-step-color bg-green-tint flex flex-col gap-2 rounded-xl border-b-4 px-4 py-6 md:px-6 md:py-8">
                <p className="text-mid-green text-base font-semibold">
                  {/* PREMIUM */}
                  {subscription?.info?.plan}
                </p>
                <p className="text-xl font-bold md:text-2xl">₦{subscription?.plan?.cost}</p>
                <p className="bg-light-green-50 w-fit rounded-lg p-2 text-xs md:text-sm">
                  Renews {subscription?.plan?.renews}
                </p>
              </div>

              {/* Payment History */}
              <div className="w-full">
                <p className="mb-3 text-sm font-semibold">Payment history</p>
                <div className="w-full overflow-x-auto pb-2">
                  <table className="w-full min-w-max">
                    <tbody>
                      {subscription?.history.map((item: TransactionHistoryRow, index: number) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="text-light-black px-2 py-3 text-xs font-normal whitespace-nowrap md:px-3 md:py-4 md:text-sm">
                            {item.txn_id}
                          </td>
                          <td className="text-light-black px-2 py-3 text-xs font-semibold whitespace-nowrap md:px-3 md:py-4 md:text-sm">
                            {item.plan}
                          </td>
                          <td className="text-light-black px-2 py-3 text-xs font-normal whitespace-nowrap md:px-3 md:py-4 md:text-sm">
                            {item?.created_at}
                          </td>
                          <td className="text-light-black px-2 py-3 text-xs font-normal whitespace-nowrap md:px-3 md:py-4 md:text-sm">
                            N {item?.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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

export default SubscriptionDetailsClient;
