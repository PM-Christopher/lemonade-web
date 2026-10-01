import React from "react";
import { PrinterIcon } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";

function BoostingDetailsPage({}) {
  const currentPage: number = 1;
  const totalPages: number = 10;

  return (
    <MainLayout>
      <section className={"flex justify-between p-[20px]"}>
        <div
          className={"flex h-fit w-[600px] flex-col gap-[20px] rounded-[12px] bg-white p-[24px]"}
        >
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Business name:</p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>Global tech</p>
              <p className={"text-light-green cursor-pointer text-[14px] font-medium"}>
                View business
              </p>
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Business owner:</p>
            </div>
            <div className={"flex gap-[4px]"}>
              <p className={"text-[14px] font-medium"}>Adebayo Akintoye</p>
              {/* <p className={"cursor-pointer font-medium text-[14px] text-light-green"}>View profile</p> */}
            </div>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Transaction Id:</p>
            </div>
            <p className={"text-[14px] font-medium"}>BO112332</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Boost Type:</p>
            </div>
            <p className={"text-[14px] font-medium"}>Featured</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Duration:</p>
            </div>
            <p className={"text-[14px] font-medium"}>30 days</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Amount:</p>
            </div>
            <p className={"text-[14px] font-medium"}>N15,000</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Start date:</p>
            </div>
            <p className={"text-[14px] font-medium"}>23 Apr, 2024 09:45 PM</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>End date:</p>
            </div>
            <p className={"text-[14px] font-medium"}>23 Apr, 2024 09:45 PM</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Transaction date:</p>
            </div>
            <p className={"text-[14px] font-medium"}>23 Apr, 2024 09:45 PM</p>
          </div>
          <div className={"items-center-center flex gap-[24px]"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
            </div>
            <p className={"text-light-green-70 text-[14px] font-medium"}>Successful</p>
          </div>
        </div>
        <div className={"flex flex-col"}>
          <div
            className={"h-[700px] rounded-tl-[12px] rounded-tr-[12px] bg-white"}
            style={{ width: "908px" }}
          >
            <div
              className={
                "border-b-grey-20 flex items-center justify-between border-b-[1px] p-[24px]"
              }
            >
              <p className={"font-semiBold text-[16px]"}>Boosting history</p>
              <div
                className={
                  "border-light-grey-50 flex items-center gap-[10px] rounded-[12px] border-[1px] px-[12px] py-[10px]"
                }
              >
                <PrinterIcon className={"w-[20px]"} />
                <p className={"text-black-light text-[16px] font-medium"}>Print</p>
              </div>
            </div>

            <div className={"flex flex-col px-[24px]"}>
              <div className="px-[16px] pt-[16px] pb-[24px]">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <p className={"text-[14px] font-medium"}>
                      BO12343 - Featured(30days) <span className={"font-semiBold"}>₦15,000</span>
                    </p>
                    <p className={"text-text-grey text-[12px] font-normal"}>
                      23, Mar 2023. 05:00PM
                    </p>
                  </div>
                  <div
                    className={"bg-light-green-60 h-fit gap-[4px] rounded-[8px] px-[8px] py-[4px]"}
                  >
                    <p className={"text-light-green-70 text-[12px] font-medium"}>Successful</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={"bg-mid-grey h-[62px] rounded-br-[12px] rounded-bl-[12px]"}
            style={{ width: "908px" }}
          >
            <div className="bg-mid-grey flex items-center justify-between rounded-br-lg rounded-bl-lg p-4 px-10">
              <button
                disabled={currentPage === 1}
                // onClick={() => onPageChange(currentPage - 1)}
                className="border-light-grey-50 flex h-9 items-center gap-2 rounded-lg border-2 p-2 text-gray-500 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    // onClick={() => onPageChange(page)}
                    className={`h-8 w-8 rounded-lg p-2 text-sm font-medium ${
                      page === currentPage ? "bg-light-white text-text-grey" : "text-gray-500"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
                // onClick={() => onPageChange(currentPage + 1)}
                className="border-light-grey-50 flex h-9 items-center gap-2 rounded-lg border-2 p-2 text-gray-500 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default BoostingDetailsPage;
