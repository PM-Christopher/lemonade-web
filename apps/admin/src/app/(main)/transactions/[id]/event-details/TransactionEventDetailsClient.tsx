"use client";
import React, { useState } from "react";
import { PrinterIcon } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTransactionEventDetailQuery } from "@/features/transaction/queries";
import type { TransactionHistoryRow } from "@/features/transaction/api";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import dayjs from "dayjs";

function TransactionEventDetailsClient({ id }: { id: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const router = useRouter();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: event } = useTransactionEventDetailQuery(id, {
    enabled: isLoggedIn,
  });

  // Calculate total pages based on the data length and perPage value
  const totalPages = Math.ceil((event?.history?.length ?? 0) / perPage);

  // Determine the start and end indices for slicing the data array
  const startIndex = (currentPage - 1) * perPage;
  const paginatedData = event?.history?.slice(startIndex, startIndex + perPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const printCSV = () => {
    if (!event?.history || event?.history.length === 0) {
      alert("No data available to export");
      return;
    }

    // Define CSV headers
    const headers = ["Id", "Amount", "Created At", "Status"];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(","), // Header row
      ...event.history.map((item: TransactionHistoryRow) => {
        return [item.unique_id, item.amount, `"${item.created_at}"`, item.status].join(",");
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
        <div className={"flex h-fit w-[600px] flex-col gap-5 rounded-xl bg-white p-6"}>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Event name:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-[14px] font-medium"}>{event?.info?.event_name}</p>
              {/*<p className={"cursor-pointer font-medium text-[14px] text-light-green"}>View business</p>*/}
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Event owner:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-[14px] font-medium"}>{event?.info?.organizer}</p>
              <p
                className={"text-light-green cursor-pointer text-[14px] font-medium"}
                onClick={() => router.push(`/users/${event?.info?.user_id}`)}
              >
                View profile
              </p>
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Transaction Id:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{event?.info?.transaction_id}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Amount:</p>
            </div>
            <p className={"text-[14px] font-medium"}>N0</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Tickets sold:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{event?.info?.tickets_sold}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Date paid:</p>
            </div>
            <p className={"text-[14px] font-medium"}>
              {dayjs(event?.info?.created_at).format("DD MMM, YYYY hh:mmA")}
            </p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
            </div>
            <p className={"text-light-green-70 text-[14px] font-medium"}>
              {capitalizeWords(event?.info?.status)}
            </p>
          </div>
        </div>

        {/* history  */}
        <div className="flex w-full flex-col lg:w-2/3">
          <div className={"h-[700px] rounded-tl-xl rounded-tr-xl bg-white"}>
            <div className={"border-b-grey-20 flex items-center justify-between border-b p-6"}>
              <p className={"font-semiBold text-[16px]"}>Boosting history</p>
              <div
                className={
                  "border-light-grey-50 flex items-center gap-2.5 rounded-xl border px-3 py-2.5"
                }
                onClick={printCSV}
              >
                <PrinterIcon className={"w-5"} />
                <p className={"text-black-light text-[16px] font-medium"}>Print</p>
              </div>
            </div>

            <div className={"flex flex-col px-6"}>
              {paginatedData?.map((item: TransactionHistoryRow, index: number) => (
                <div className="px-4 pt-4 pb-6" key={index}>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <p className={"text-[14px] font-medium"}>
                        {item?.unique_id} - ₦{item?.amount}
                      </p>
                      <p className={"text-text-grey text-[12px] font-normal"}>{item?.created_at}</p>
                    </div>
                    <div className={"bg-light-green-60 h-fit gap-1 rounded-[8px] px-2 py-1"}>
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

export default TransactionEventDetailsClient;
