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
        <section className={"flex justify-between p-[20px]"}>
          <div className={"flex h-fit w-[588px] flex-col gap-[12px] rounded-[12px] bg-white"}>
            <div className={"flex flex-col"}>
              <div className={"flex flex-col gap-[20px] p-[24px]"}>
                <div className={"bg-mid-grey h-[64px] w-[64px] rounded-full"}></div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Full Name:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>User ID:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
                  </div>
                  <p className={"text-light-green-70 text-[14px] font-medium"}>Loading...</p>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Role:</p>
                  </div>
                  <div className={"flex gap-[4px]"}>
                    <p className={"text-[14px] font-medium"}>Loading...</p>
                  </div>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Email Address:</p>
                  </div>
                  <div className={"flex gap-[4px]"}>
                    <p className={"text-[14px] font-medium"}>Loading...</p>
                  </div>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-text-grey text-[12px] font-medium"}>Date Created:</p>
                  </div>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
              </div>
              <div
                className={
                  "border-t-grey-20 mt-[20px] flex items-center justify-between gap-[24px] border-t-[1px] p-[24px]"
                }
              >
                <button
                  className={
                    "border-light-grey-50 w-full rounded-[12px] border-[1px] px-[48px] py-[11px] font-sans text-[14px] font-medium"
                  }
                  type={"button"}
                >
                  Update password
                </button>
                <button
                  className={
                    "border-light-grey-50 text-red-1 w-full rounded-[12px] border-[1px] px-[48px] py-[11px] font-sans text-[14px] font-medium"
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
              className={"h-[700px] rounded-tl-[12px] rounded-tr-[12px] bg-white"}
              style={{ width: "908px" }}
            >
              <div className="border-b-grey-20 mt-[10px] flex justify-between border-b-[1px] p-[24px]">
                <p className={"font-semiBold text-[16px]"}>Activity Logs</p>
              </div>
              <div className={"flex flex-col py-[20px]"}>
                <div className={"px-[24px] py-[16px]"}>
                  <div
                    className={
                      "border-grey-20 bg-light-grey flex h-[40px] w-[203px] cursor-pointer items-center justify-between rounded-[12px] border-[1px] px-[16px] py-[10px]"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      <div className={"text-text-grey flex items-center gap-[8px]"}>
                        <CalendarIcon className={"w-[15px]"} />
                        <p className={"font-semiBold text-text-grey text-[12px]"}>ALL TIME</p>
                      </div>
                    </div>
                    <ChevronDown className={"text-text-grey w-[20px]"} />
                  </div>
                </div>
                <div className="pt-[16px] pb-[24px]">
                  <div className={"flex flex-col"}>
                    <div className="flex justify-between px-[24px] py-[16px]">
                      <p className={"text-light-black text-[14px] font-medium"}>Loading...</p>
                      <p className={"text-text-grey text-[14px] font-normal"}>Loading...</p>
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
      <section className={"flex justify-between p-[20px]"}>
        <div className={"flex h-fit w-[588px] flex-col gap-[12px] rounded-[12px] bg-white"}>
          <div className={"flex flex-col"}>
            <div className={"flex flex-col gap-[20px] p-[24px]"}>
              <div className={"bg-mid-grey h-[64px] w-[64px] rounded-full"}></div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Full Name:</p>
                </div>
                <p className={"text-[14px] font-medium"}>{team?.name || "N/A"}</p>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>User ID:</p>
                </div>
                <p className={"text-[14px] font-medium"}>LN112332</p>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Status:</p>
                </div>
                <p className={"text-light-green-70 text-[14px] font-medium"}>
                  {team?.status ? capitalizeWords(team.status) : "N/A"}
                </p>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Role:</p>
                </div>
                <div className={"flex gap-[4px]"}>
                  <p className={"text-[14px] font-medium"}>
                    {team?.role ? capitalizeSpecial(team.role) : "N/A"}
                  </p>
                </div>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Email Address:</p>
                </div>
                <div className={"flex gap-[4px]"}>
                  <p className={"text-[14px] font-medium"}>{team?.email || "N/A"}</p>
                </div>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Date Created:</p>
                </div>
                <p className={"text-[14px] font-medium"}>{team?.created_at || "N/A"}</p>
              </div>
            </div>
            <div
              className={
                "border-t-grey-20 mt-[20px] flex items-center justify-between gap-[24px] border-t-[1px] p-[24px]"
              }
            >
              <button
                className={
                  "border-light-grey-50 w-full rounded-[12px] border-[1px] px-[48px] py-[11px] font-sans text-[14px] font-medium"
                }
                type={"button"}
              >
                Update password
              </button>
              <button
                className={
                  "border-light-grey-50 text-red-1 w-full rounded-[12px] border-[1px] px-[48px] py-[11px] font-sans text-[14px] font-medium"
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
            className={"h-[700px] rounded-tl-[12px] rounded-tr-[12px] bg-white"}
            style={{ width: "908px" }}
          >
            <div className="border-b-grey-20 mt-[10px] flex justify-between border-b-[1px] p-[24px]">
              <p className={"font-semiBold text-[16px]"}>Activity Logs</p>
            </div>
            <div className={"flex flex-col py-[20px]"}>
              <div className={"px-[24px] py-[16px]"}>
                <div
                  className={
                    "border-grey-20 bg-light-grey flex h-[40px] w-[203px] cursor-pointer items-center justify-between rounded-[12px] border-[1px] px-[16px] py-[10px]"
                  }
                >
                  <div className={"flex items-center justify-between"}>
                    <div className={"text-text-grey flex items-center gap-[8px]"}>
                      <CalendarIcon className={"w-[15px]"} />
                      <p className={"font-semiBold text-text-grey text-[12px]"}>ALL TIME</p>
                    </div>
                  </div>
                  <ChevronDown className={"text-text-grey w-[20px]"} />
                </div>
              </div>

              <div className="pt-[16px] pb-[24px]">
                <div className={"flex flex-col"}>
                  <div className="flex justify-between px-[24px] py-[16px]">
                    <p className={"text-light-black text-[14px] font-medium"}>
                      Joined Lemonade Network
                    </p>
                    <p className={"text-text-grey text-[14px] font-normal"}>
                      Mon, 23 Mar, 2024 05:00PM
                    </p>
                  </div>
                  <div className="flex justify-between px-[24px] py-[16px]">
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
            className={"bg-mid-grey h-[62px] rounded-br-[12px] rounded-bl-[12px]"}
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
