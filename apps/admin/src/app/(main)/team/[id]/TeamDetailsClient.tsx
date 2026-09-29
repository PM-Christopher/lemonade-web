"use client";
import React from "react";
import { useHydrated } from "@/hooks/useHydrated";
import MainLayout from "@/components/layouts/MainLayout";
import { usersDetailPageViews } from "@/utils/pageViews";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTeamDetailQuery } from "@/features/team/queries";
import { capitalizeSpecial, capitalizeWords } from "@/utils/helper";

function TeamDetailsClient({ id }: { id: number | undefined }) {
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
          <div
            className={
              "flex h-fit w-[588px] flex-col gap-[12px] rounded-[12px] bg-white"
            }
          >
            <div className={"flex flex-col"}>
              <div className={"flex flex-col gap-[20px] p-[24px]"}>
                <div
                  className={"h-[64px] w-[64px] rounded-full bg-mid-grey"}
                ></div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>
                      Full Name:
                    </p>
                  </div>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>
                      User ID:
                    </p>
                  </div>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>
                      Status:
                    </p>
                  </div>
                  <p className={"text-[14px] font-medium text-light-green-70"}>
                    Loading...
                  </p>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>
                      Role:
                    </p>
                  </div>
                  <div className={"flex gap-[4px]"}>
                    <p className={"text-[14px] font-medium"}>Loading...</p>
                  </div>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>
                      Email Address:
                    </p>
                  </div>
                  <div className={"flex gap-[4px]"}>
                    <p className={"text-[14px] font-medium"}>Loading...</p>
                  </div>
                </div>
                <div className={"flex items-center gap-[24px]"}>
                  <div className={"w-[115px]"}>
                    <p className={"text-[12px] font-medium text-text-grey"}>
                      Date Created:
                    </p>
                  </div>
                  <p className={"text-[14px] font-medium"}>Loading...</p>
                </div>
              </div>
              <div
                className={
                  "mt-[20px] flex items-center justify-between gap-[24px] border-t-[1px] border-t-grey-20 p-[24px]"
                }
              >
                <button
                  className={
                    "w-full rounded-[12px] border-[1px] border-light-grey-50 px-[48px] py-[11px] font-sans text-[14px] font-medium"
                  }
                  type={"button"}
                >
                  Update password
                </button>
                <button
                  className={
                    "w-full rounded-[12px] border-[1px] border-light-grey-50 px-[48px] py-[11px] font-sans text-[14px] font-medium text-red-1"
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
              className={
                "h-[700px] rounded-tl-[12px] rounded-tr-[12px] bg-white"
              }
              style={{ width: "908px" }}
            >
              <div className="mt-[10px] flex justify-between border-b-[1px] border-b-grey-20 p-[24px]">
                <p className={"text-[16px] font-semiBold"}>Activity Logs</p>
              </div>
              <div className={"flex flex-col py-[20px]"}>
                <div className={"px-[24px] py-[16px]"}>
                  <div
                    className={
                      "flex h-[40px] w-[203px] cursor-pointer items-center justify-between rounded-[12px] border-[1px] border-grey-20 bg-light-grey px-[16px] py-[10px]"
                    }
                  >
                    <div className={"flex items-center justify-between"}>
                      <div
                        className={"flex items-center gap-[8px] text-text-grey"}
                      >
                        <CalendarIcon className={"w-[15px]"} />
                        <p
                          className={"text-[12px] font-semiBold text-text-grey"}
                        >
                          ALL TIME
                        </p>
                      </div>
                    </div>
                    <ChevronDown className={"w-[20px] text-text-grey"} />
                  </div>
                </div>
                <div className="pb-[24px] pt-[16px]">
                  <div className={"flex flex-col"}>
                    <div className="flex justify-between px-[24px] py-[16px]">
                      <p className={"text-[14px] font-medium text-light-black"}>
                        Loading...
                      </p>
                      <p className={"text-[14px] font-normal text-text-grey"}>
                        Loading...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                "h-[62px] rounded-bl-[12px] rounded-br-[12px] bg-mid-grey"
              }
              style={{ width: "908px" }}
            >
              <div className="flex items-center justify-between rounded-bl-lg rounded-br-lg bg-mid-grey p-4 px-10">
                <button
                  disabled={currentPage === 1}
                  className="flex h-9 items-center gap-2 rounded-lg border-2 border-light-grey-50 p-2 text-gray-500 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        className={`h-8 w-8 rounded-lg p-2 text-sm font-medium ${page === currentPage ? "bg-light-white text-text-grey" : "text-gray-500"}`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  className="flex h-9 items-center gap-2 rounded-lg border-2 border-light-grey-50 p-2 text-gray-500 disabled:opacity-50"
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
        <div
          className={
            "flex h-fit w-[588px] flex-col gap-[12px] rounded-[12px] bg-white"
          }
        >
          <div className={"flex flex-col"}>
            <div className={"flex flex-col gap-[20px] p-[24px]"}>
              <div
                className={"h-[64px] w-[64px] rounded-full bg-mid-grey"}
              ></div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>
                    Full Name:
                  </p>
                </div>
                <p className={"text-[14px] font-medium"}>
                  {team?.name || "N/A"}
                </p>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>
                    User ID:
                  </p>
                </div>
                <p className={"text-[14px] font-medium"}>LN112332</p>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>
                    Status:
                  </p>
                </div>
                <p className={"text-[14px] font-medium text-light-green-70"}>
                  {team?.status ? capitalizeWords(team.status) : "N/A"}
                </p>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>
                    Role:
                  </p>
                </div>
                <div className={"flex gap-[4px]"}>
                  <p className={"text-[14px] font-medium"}>
                    {team?.role ? capitalizeSpecial(team.role) : "N/A"}
                  </p>
                </div>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>
                    Email Address:
                  </p>
                </div>
                <div className={"flex gap-[4px]"}>
                  <p className={"text-[14px] font-medium"}>
                    {team?.email || "N/A"}
                  </p>
                </div>
              </div>
              <div className={"flex items-center gap-[24px]"}>
                <div className={"w-[115px]"}>
                  <p className={"text-[12px] font-medium text-text-grey"}>
                    Date Created:
                  </p>
                </div>
                <p className={"text-[14px] font-medium"}>
                  {team?.created_at || "N/A"}
                </p>
              </div>
            </div>
            <div
              className={
                "mt-[20px] flex items-center justify-between gap-[24px] border-t-[1px] border-t-grey-20 p-[24px]"
              }
            >
              <button
                className={
                  "w-full rounded-[12px] border-[1px] border-light-grey-50 px-[48px] py-[11px] font-sans text-[14px] font-medium"
                }
                type={"button"}
              >
                Update password
              </button>
              <button
                className={
                  "w-full rounded-[12px] border-[1px] border-light-grey-50 px-[48px] py-[11px] font-sans text-[14px] font-medium text-red-1"
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
            <div className="mt-[10px] flex justify-between border-b-[1px] border-b-grey-20 p-[24px]">
              <p className={"text-[16px] font-semiBold"}>Activity Logs</p>
            </div>
            <div className={"flex flex-col py-[20px]"}>
              <div className={"px-[24px] py-[16px]"}>
                <div
                  className={
                    "flex h-[40px] w-[203px] cursor-pointer items-center justify-between rounded-[12px] border-[1px] border-grey-20 bg-light-grey px-[16px] py-[10px]"
                  }
                >
                  <div className={"flex items-center justify-between"}>
                    <div
                      className={"flex items-center gap-[8px] text-text-grey"}
                    >
                      <CalendarIcon className={"w-[15px]"} />
                      <p className={"text-[12px] font-semiBold text-text-grey"}>
                        ALL TIME
                      </p>
                    </div>
                  </div>
                  <ChevronDown className={"w-[20px] text-text-grey"} />
                </div>
              </div>

              <div className="pb-[24px] pt-[16px]">
                <div className={"flex flex-col"}>
                  <div className="flex justify-between px-[24px] py-[16px]">
                    <p className={"text-[14px] font-medium text-light-black"}>
                      Joined Lemonade Network
                    </p>
                    <p className={"text-[14px] font-normal text-text-grey"}>
                      Mon, 23 Mar, 2024 05:00PM
                    </p>
                  </div>
                  <div className="flex justify-between px-[24px] py-[16px]">
                    <p className={"text-[14px] font-medium text-light-black"}>
                      Created a &apos;Nigeria start-ups&apos; Tribe
                    </p>
                    <p className={"text-[14px] font-normal text-text-grey"}>
                      Mon, 23 Mar, 2024 05:00PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className={
              "h-[62px] rounded-bl-[12px] rounded-br-[12px] bg-mid-grey"
            }
            style={{ width: "908px" }}
          >
            <div className="flex items-center justify-between rounded-bl-lg rounded-br-lg bg-mid-grey p-4 px-10">
              <button
                disabled={currentPage === 1}
                className="flex h-9 items-center gap-2 rounded-lg border-2 border-light-grey-50 p-2 text-gray-500 disabled:opacity-50"
              >
                Previous
              </button>
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`h-8 w-8 rounded-lg p-2 text-sm font-medium ${page === currentPage ? "bg-light-white text-text-grey" : "text-gray-500"}`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>
              <button
                disabled={currentPage === totalPages}
                className="flex h-9 items-center gap-2 rounded-lg border-2 border-light-grey-50 p-2 text-gray-500 disabled:opacity-50"
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
