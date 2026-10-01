"use client";
import React from "react";
import { useHydrated } from "@/hooks/useHydrated";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTeamDetailQuery } from "@/features/team/queries";
import { capitalizeSpecial, capitalizeWords } from "@/utils/helper";

function TeamDetailsClient({ id }: { id: string }) {
  const currentPage: number = 1;
  const totalPages: number = 10;
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: detail } = useTeamDetailQuery(id, { enabled: isLoggedIn });
  const team = detail?.team;
  const isHydrated = useHydrated();

  // Don't render dynamic content until hydrated
  if (!isHydrated) {
    return (
      <MainLayout>
        <section className={"flex justify-between p-5"}>
          <div className={"flex h-fit w-[588px] flex-col gap-3 rounded-xl bg-white"}>
            <div className={"flex flex-col"}>
              <div className={"flex flex-col gap-5 p-6"}>
                <div className={"bg-mid-grey h-16 w-16 rounded-full"}></div>
                <div className={"flex items-center gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Full Name:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
                <div className={"flex items-center gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>User ID:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
                <div className={"flex items-center gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
                  </div>
                  <p className={"text-light-green-70 text-[14px] font-medium"}>Loading...</p>
                </div>
                <div className={"flex items-center gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Role:</p>
                  </div>
                  <div className={"flex gap-1"}>
                    <p className={"text-[14px] font-medium"}>Loading...</p>
                  </div>
                </div>
                <div className={"flex items-center gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Email Address:</p>
                  </div>
                  <div className={"flex gap-1"}>
                    <p className={"text-[14px] font-medium"}>Loading...</p>
                  </div>
                </div>
                <div className={"flex items-center gap-6"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Date Created:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
              </div>
              <div
                className={
                  "border-t-grey-20 mt-5 flex items-center justify-between gap-6 border-t p-6"
                }
              >
                <button
                  className={
                    "border-light-grey-50 w-full rounded-xl border px-12 py-[11px] font-sans text-[14px] font-medium"
                  }
                  type={"button"}
                >
                  Update password
                </button>
                <button
                  className={
                    "border-light-grey-50 text-red-1 w-full rounded-xl border px-12 py-[11px] font-sans text-[14px] font-medium"
                  }
                  type={"button"}
                >
                  Remove member
                </button>
              </div>
            </div>
          </div>
          <div className={"flex flex-col"}>
            <div
              className={"h-[700px] rounded-tl-xl rounded-tr-xl bg-white"}
              style={{ width: "908px" }}
            >
              <div className="border-b-grey-20 mt-2.5 flex justify-between border-b p-6">
                <p className={"font-semiBold text-[16px]"}>Activity Logs</p>
              </div>
              <div className={"flex flex-col py-5"}>
                <div className={"px-6 py-4"}>
                  <div
                    className={
                      "border-grey-20 bg-light-grey flex h-10 w-[203px] cursor-pointer items-center justify-between rounded-xl border px-4 py-2.5"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      <div className={"text-text-grey flex items-center gap-2"}>
                        <CalendarIcon className={"w-[15px]"} />
                        <p className={"font-semiBold text-text-grey text-[12px]"}>ALL TIME</p>
                      </div>
                    </div>
                    <ChevronDown className={"text-text-grey w-5"} />
                  </div>
                </div>
                <div className="pt-4 pb-6">
                  <div className={"flex flex-col"}>
                    <div className="flex justify-between px-6 py-4">
                      <p className={"text-light-black text-[14px] font-medium"}>Loading...</p>
                      <p className={"text-text-grey text-[14px] font-normal"}>Loading...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={"bg-mid-grey h-[62px] rounded-br-xl rounded-bl-xl"}
              style={{ width: "908px" }}
            >
              <div className="bg-mid-grey flex items-center justify-between rounded-br-lg rounded-bl-lg p-4 px-10">
                <button
                  disabled={currentPage === 1}
                  className="border-light-grey-50 flex h-9 items-center gap-2 rounded-lg border-2 p-2 text-gray-500 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`h-8 w-8 rounded-lg p-2 text-sm font-medium ${page === currentPage ? "bg-light-white text-text-grey" : "text-gray-500"}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
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

  return (
    <MainLayout>
      <section className={"flex justify-between p-5"}>
        <div className={"flex h-fit w-[588px] flex-col gap-3 rounded-xl bg-white"}>
          <div className={"flex flex-col"}>
            <div className={"flex flex-col gap-5 p-6"}>
              <div className={"bg-mid-grey h-16 w-16 rounded-full"}></div>
              <div className={"flex items-center gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Full Name:</p>
                </div>
                <p className={"text-[14px] font-medium"}>{team?.name || "N/A"}</p>
              </div>
              <div className={"flex items-center gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>User ID:</p>
                </div>
                <p className={"text-[14px] font-medium"}>LN112332</p>
              </div>
              <div className={"flex items-center gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
                </div>
                <p className={"text-light-green-70 text-[14px] font-medium"}>
                  {team?.status ? capitalizeWords(team.status) : "N/A"}
                </p>
              </div>
              <div className={"flex items-center gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Role:</p>
                </div>
                <div className={"flex gap-1"}>
                  <p className={"text-[14px] font-medium"}>
                    {team?.role ? capitalizeSpecial(team.role) : "N/A"}
                  </p>
                </div>
              </div>
              <div className={"flex items-center gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Email Address:</p>
                </div>
                <div className={"flex gap-1"}>
                  <p className={"text-[14px] font-medium"}>{team?.email || "N/A"}</p>
                </div>
              </div>
              <div className={"flex items-center gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Date Created:</p>
                </div>
                <p className={"text-[14px] font-medium"}>{team?.created_at || "N/A"}</p>
              </div>
            </div>
            <div
              className={
                "border-t-grey-20 mt-5 flex items-center justify-between gap-6 border-t p-6"
              }
            >
              <button
                className={
                  "border-light-grey-50 w-full rounded-xl border px-12 py-[11px] font-sans text-[14px] font-medium"
                }
                type={"button"}
              >
                Update password
              </button>
              <button
                className={
                  "border-light-grey-50 text-red-1 w-full rounded-xl border px-12 py-[11px] font-sans text-[14px] font-medium"
                }
                type={"button"}
              >
                Remove member
              </button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col"}>
          <div
            className={"h-[700px] rounded-tl-xl rounded-tr-xl bg-white"}
            style={{ width: "908px" }}
          >
            <div className="border-b-grey-20 mt-2.5 flex justify-between border-b p-6">
              <p className={"font-semiBold text-[16px]"}>Activity Logs</p>
            </div>
            <div className={"flex flex-col py-5"}>
              <div className={"px-6 py-4"}>
                <div
                  className={
                    "border-grey-20 bg-light-grey flex h-10 w-[203px] cursor-pointer items-center justify-between rounded-xl border px-4 py-2.5"
                  }
                >
                  <div className={"flex items-center justify-between"}>
                    <div className={"text-text-grey flex items-center gap-2"}>
                      <CalendarIcon className={"w-[15px]"} />
                      <p className={"font-semiBold text-text-grey text-[12px]"}>ALL TIME</p>
                    </div>
                  </div>
                  <ChevronDown className={"text-text-grey w-5"} />
                </div>
              </div>

              <div className="pt-4 pb-6">
                <div className={"flex flex-col"}>
                  <div className="flex justify-between px-6 py-4">
                    <p className={"text-light-black text-[14px] font-medium"}>
                      Joined Lemonade Network
                    </p>
                    <p className={"text-text-grey text-[14px] font-normal"}>
                      Mon, 23 Mar, 2024 05:00PM
                    </p>
                  </div>
                  <div className="flex justify-between px-6 py-4">
                    <p className={"text-light-black text-[14px] font-medium"}>
                      Created a &apos;Nigeria start-ups&apos; Tribe
                    </p>
                    <p className={"text-text-grey text-[14px] font-normal"}>
                      Mon, 23 Mar, 2024 05:00PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={"bg-mid-grey h-[62px] rounded-br-xl rounded-bl-xl"}
            style={{ width: "908px" }}
          >
            <div className="bg-mid-grey flex items-center justify-between rounded-br-lg rounded-bl-lg p-4 px-10">
              <button
                disabled={currentPage === 1}
                className="border-light-grey-50 flex h-9 items-center gap-2 rounded-lg border-2 p-2 text-gray-500 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`h-8 w-8 rounded-lg p-2 text-sm font-medium ${page === currentPage ? "bg-light-white text-text-grey" : "text-gray-500"}`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                disabled={currentPage === totalPages}
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

export default TeamDetailsClient;
