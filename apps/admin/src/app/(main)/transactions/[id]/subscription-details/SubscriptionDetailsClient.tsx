"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { ChevronDown, ChevronRight, PrinterIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { usePlanSubscriptionDetailQuery } from "@/features/transaction/queries";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";

function SubscriptionDetailsClient({ id }: { id: number | undefined }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const router = useRouter();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  const { data: subscription } = usePlanSubscriptionDetailQuery(id, {
    enabled: isLoggedIn,
  });

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((subscription?.history?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = subscription?.history?.slice(
    startIndex,
    startIndex + perPage,
  );

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
      ...subscription.history.map((item: any) => {
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
    link.setAttribute(
      "download",
      `payment_history_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";

    // Append to document, trigger download and clean up
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <MainLayout>
      <section className="md:p-5 lg:flex-col md:gap-5 flex w-full max-w-full flex-row gap-4 overflow-x-hidden p-4">
        {/* User Info Card */}
        <div className="lg:w-1/3 md:p-6 md:gap-5 flex h-fit w-full flex-col gap-4 rounded-xl bg-white p-4">
          <div className="sm:flex-row sm:gap-6 flex flex-col gap-2">
            <div className="sm:w-28 min-w-20">
              <p className="text-xs font-medium text-text-grey">Full name:</p>
            </div>
            <div className="flex flex-wrap gap-1">
              <p className="text-sm font-medium">
                {subscription?.info?.fullname}
              </p>
              <p
                className="cursor-pointer text-sm font-medium text-light-green"
                onClick={() =>
                  router.push(`/users/${subscription?.info?.user_id}`)
                }
              >
                View profile
              </p>
            </div>
          </div>
          <div className="sm:flex-row sm:gap-6 flex flex-col gap-2">
            <div className="sm:w-28 min-w-20">
              <p className="text-xs font-medium text-text-grey">
                Transaction Id:
              </p>
            </div>
            <p className="break-all text-sm font-medium">
              {subscription?.info?.txn_id}
            </p>
          </div>
          <div className="sm:flex-row sm:gap-6 flex flex-col gap-2">
            <div className="sm:w-28 min-w-20">
              <p className="text-xs font-medium text-text-grey">
                Account Plan:
              </p>
            </div>
            <p className="text-sm font-medium">{subscription?.info?.plan}</p>
          </div>
          <div className="sm:flex-row sm:gap-6 flex flex-col gap-2">
            <div className="sm:w-28 min-w-20">
              <p className="text-xs font-medium text-text-grey">Amount:</p>
            </div>
            <p className="text-sm font-medium">N{subscription?.info?.amount}</p>
          </div>
          <div className="sm:flex-row sm:gap-6 flex flex-col gap-2">
            <div className="sm:w-28 min-w-20">
              <p className="text-xs font-medium text-text-grey">
                Subscription Type:
              </p>
            </div>
            <p className="text-sm font-medium capitalize">
              {subscription?.history[0].subscription_type}
            </p>
          </div>
          <div className="sm:flex-row sm:gap-6 flex flex-col gap-2">
            <div className="sm:w-28 min-w-20">
              <p className="text-xs font-medium text-text-grey">Date Paid:</p>
            </div>
            <p className="text-sm font-medium">
              {subscription?.history[0]?.date_paid || null}
            </p>
          </div>
          <div className="sm:flex-row sm:gap-6 flex flex-col gap-2">
            <div className="sm:w-28 min-w-20">
              <p className="text-xs font-medium text-text-grey">Status:</p>
            </div>
            <p className="text-sm font-medium text-light-green-70">
              {capitalizeWords(subscription?.info?.status)}
            </p>
          </div>
        </div>

        {/* Account Plan and Payment History */}
        <div className="lg:w-2/3 flex w-full flex-col">
          <div className="overflow-hidden rounded-t-xl bg-white">
            <div className="md:p-6 flex items-center justify-between border-b border-b-grey-20 p-4">
              <p className="text-base font-semibold">Account plan</p>
              <div
                className="md:px-3 flex cursor-pointer items-center gap-2 rounded-xl border border-light-grey-50 px-2 py-2"
                onClick={printCSV}
              >
                <PrinterIcon className="md:w-5 w-4" />
                <p className="md:text-base text-sm font-medium text-black-light">
                  Print
                </p>
              </div>
            </div>

            <div className="md:p-6 md:gap-10 flex flex-col gap-6 p-4">
              {/* Premium Plan Card */}
              <div className="md:px-6 md:py-8 flex flex-col gap-2 rounded-xl border-b-4 border-b-step-color bg-green-tint px-4 py-6">
                <p className="text-base font-semibold text-mid-green">
                  {/* PREMIUM */}
                  {subscription?.info?.plan}
                </p>
                <p className="md:text-2xl text-xl font-bold">
                  ₦{subscription?.plan?.cost}
                </p>
                <p className="md:text-sm w-fit rounded-lg bg-light-green-50 p-2 text-xs">
                  Renews {subscription?.plan?.renews}
                </p>
              </div>

              {/* Payment History */}
              <div className="w-full">
                <p className="mb-3 text-sm font-semibold">Payment history</p>
                <div className="w-full overflow-x-auto pb-2">
                  <table className="w-full min-w-max">
                    <tbody>
                      {subscription?.history.map((item: any, index: any) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="md:py-4 md:px-3 md:text-sm whitespace-nowrap px-2 py-3 text-xs font-normal text-light-black">
                            {item.txn_id}
                          </td>
                          <td className="md:py-4 md:px-3 md:text-sm whitespace-nowrap px-2 py-3 text-xs font-semibold text-light-black">
                            {item.plan}
                          </td>
                          <td className="md:py-4 md:px-3 md:text-sm whitespace-nowrap px-2 py-3 text-xs font-normal text-light-black">
                            {item?.created_at}
                          </td>
                          <td className="md:py-4 md:px-3 md:text-sm whitespace-nowrap px-2 py-3 text-xs font-normal text-light-black">
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
