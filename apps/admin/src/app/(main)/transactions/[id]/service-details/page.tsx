import React from "react";
import { PrinterIcon } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";

function ServiceDetailsPage({}) {
  const currentPage: number = 1;
  const totalPages: number = 10;

  return (
    <MainLayout>
      <section className={"flex justify-between p-5"}>
        <div className={"flex h-fit w-150 flex-col gap-5 rounded-xl bg-white p-6"}>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>
                Business name:
              </p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-body-s font-medium"}>Global tech</p>
              {/*<p className={"cursor-pointer font-medium text-body-s text-light-green"}>View business</p>*/}
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Client name:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-body-s font-medium"}>Adebayo Akintoye</p>
              {/*<p className={"cursor-pointer font-medium text-body-s text-light-green"}>View profile</p>*/}
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>
                Transaction Id:
              </p>
            </div>
            <p className={"text-body-s font-medium"}>SE112332</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Amount:</p>
            </div>
            <p className={"text-body-s font-medium"}>N30,000</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>
                Transaction type:
              </p>
            </div>
            <p className={"text-body-s font-medium"}>Pay out</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Date paid:</p>
            </div>
            <p className={"text-body-s font-medium"}>23 Apr, 2024 09:45 PM</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Status:</p>
            </div>
            <p className={"text-light-green-70 text-body-s font-medium"}>Successful</p>
          </div>
        </div>
        <div className={"flex flex-col"}>
          <div className={"h-175 rounded-tl-xl rounded-tr-xl bg-white"} style={{ width: "908px" }}>
            <div className={"border-b-grey-20 flex items-center justify-between border-b p-6"}>
              <p className={"font-semiBold text-body-l"}>Boosting history</p>
              <div
                className={
                  "border-light-grey-50 flex items-center gap-2.5 rounded-xl border px-3 py-2.5"
                }
              >
                <PrinterIcon className={"w-5"} />
                <p className={"text-black-light text-body-l font-medium"}>Print</p>
              </div>
            </div>

            <div className={"flex flex-col px-6"}>
              <div className="px-4 pt-4 pb-6">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <p className={"text-body-s font-medium"}>
                      SE12343 - Service Payment <span className={"font-semiBold"}>₦15,000</span>
                    </p>
                    <p className={"text-text-grey text-meta leading-normal font-normal"}>
                      23, Mar 2023. 05:00PM
                    </p>
                  </div>
                  <div className={"bg-light-green-60 h-fit gap-1 rounded-lg px-2 py-1"}>
                    <p className={"text-light-green-70 text-meta leading-normal font-medium"}>
                      Successful
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={"bg-mid-grey h-15.5 rounded-br-xl rounded-bl-xl"}
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

export default ServiceDetailsPage;
