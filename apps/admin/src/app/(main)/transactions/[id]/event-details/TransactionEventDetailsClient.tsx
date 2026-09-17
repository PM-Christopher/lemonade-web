"use client";
import React, { useState } from "react";
import { PrinterIcon } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTransactionEventDetailQuery } from "@/features/transaction/queries";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import dayjs from "dayjs";

function TransactionEventDetailsClient({ id }: { id: number | undefined }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
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
      ...event.history.map((item: any) => {
        return [
          item.unique_id,
          item.amount,
          `"${item.created_at}"`,
          item.status,
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
        <div
          className={
            "flex h-fit w-[600px] flex-col gap-[20px] rounded-[12px] bg-white p-[24px]"
          }
        >
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Event name:
              </p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>
                {event?.info?.event_name}
              </p>
              {/*<p className={"cursor-pointer font-medium text-[14px] text-light-green"}>View business</p>*/}
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Event owner:
              </p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>
                {event?.info?.organizer}
              </p>
              <p
                className={
                  "cursor-pointer text-[14px] font-medium text-light-green"
                }
                onClick={() => router.push(`/users/${event?.info?.user_id}`)}
              >
                View profile
              </p>
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Transaction Id:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>
              {event?.info?.transaction_id}
            </p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Amount:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>N0</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Tickets sold:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>
              {event?.info?.tickets_sold}
            </p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Date paid:
              </p>
            </div>
            <p className={"text-[14px] font-medium"}>
              {dayjs(event?.info?.created_at).format("DD MMM, YYYY hh:mmA")}
            </p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-[12px] font-medium text-text-grey"}>
                Status:
              </p>
            </div>
            <p className={"text-[14px] font-medium text-light-green-70"}>
              {capitalizeWords(event?.info?.status)}
            </p>
          </div>
        </div>

        {/* history  */}
        <div className="lg:w-2/3 flex w-full flex-col">
          <div
            className={"h-[700px] rounded-tl-[12px] rounded-tr-[12px] bg-white"}
          >
            <div
              className={
                "flex items-center justify-between border-b-[1px] border-b-grey-20 p-[24px]"
              }
            >
              <p className={"text-[16px] font-semiBold"}>Boosting history</p>
              <div
                className={
                  "flex items-center gap-[10px] rounded-[12px] border-[1px] border-light-grey-50 px-[12px] py-[10px]"
                }
                onClick={printCSV}
              >
                <PrinterIcon className={"w-[20px]"} />
                <p className={"text-[16px] font-medium text-black-light"}>
                  Print
                </p>
              </div>
            </div>

            <div className={"flex flex-col px-[24px]"}>
              {paginatedData?.map((item: any, index: number) => (
                <div className="px-[16px] pb-[24px] pt-[16px]" key={index}>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <p className={"text-[14px] font-medium"}>
                        {item?.unique_id} - ₦{item?.amount}
                      </p>
                      <p className={"text-[12px] font-normal text-text-grey"}>
                        {item?.created_at}
                      </p>
                    </div>
                    <div
                      className={
                        "h-fit gap-[4px] rounded-[8px] bg-light-green-60 px-[8px] py-[4px]"
                      }
                    >
                      <p
                        className={
                          "text-[12px] font-medium text-light-green-70"
                        }
                      >
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
