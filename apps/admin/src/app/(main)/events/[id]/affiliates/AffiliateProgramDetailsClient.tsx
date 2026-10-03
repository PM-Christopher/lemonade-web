"use client";
import React, { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { useEventAffiliateDetailQuery } from "@/features/events/queries";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { formatLongDate } from "@/lib/dateTimeFormatter";
import { RootState } from "@/redux/store";
import { CalendarIcon, CopyIcon, MapPinIcon } from "lucide-react";
import { useSelector } from "react-redux";

const AffiliateProgramDetailsClient = ({ id }: { id: string }) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useEventAffiliateDetailQuery(id, { enabled: isLoggedIn });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink((current) => (current === link ? null : current)), 1500);
  };

  const affiliate = data?.affiliate;
  const programs = data?.programs ?? [];

  return (
    <MainLayout>
      <section className={"flex justify-between gap-0.5 p-5"}>
        <div className={"flex h-fit w-[400px] flex-col gap-3 rounded-xl bg-white p-6"}>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Affiliate Name:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-[14px] font-medium"}>{affiliate?.name}</p>
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Affiliate ID:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{affiliate?.unique_id}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Date Joined:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-[14px] font-medium"}>
                {affiliate?.date_joined ? formatLongDate(new Date(affiliate.date_joined)) : ""}
              </p>
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>No of Programs:</p>
            </div>
            <p className={"text-light-green-70 text-[14px] font-medium"}>{affiliate?.programs}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Total Tickets Sold:</p>
            </div>
            <p className={"text-[14px] font-medium"}>{affiliate?.tickets_sold}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-[115px]"}>
              <p className={"text-text-grey text-[12px] font-medium"}>Total Revenue:</p>
            </div>
            <p className={"text-[14px] font-medium"}>
              N{formatNumberWithCommas(affiliate?.total_revenue ?? 0)}
            </p>
          </div>
          {affiliate?.account ? (
            <>
              <div className={"items-center-center flex gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Account Number:</p>
                </div>
                <p className={"text-[14px] font-medium"}>{affiliate.account.account_number}</p>
              </div>
              <div className={"items-center-center flex gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Account Holder:</p>
                </div>
                <p className={"text-[14px] font-medium"}>{affiliate.account.account_name}</p>
              </div>
              <div className={"items-center-center flex gap-6"}>
                <div className={"w-[115px]"}>
                  <p className={"text-text-grey text-[12px] font-medium"}>Bank Name:</p>
                </div>
                <p className={"text-[14px] font-medium"}>{affiliate.account.bank_name}</p>
              </div>
            </>
          ) : (
            <p className={"text-text-grey text-[14px] font-normal"}>No bank account on file</p>
          )}
        </div>
        <div className={"flex h-fit w-[780px] flex-col gap-4 rounded-xl bg-white"}>
          <div className={"border-b p-6"}>
            <p className={"font-semiBold text-[16px]"}>Programs</p>
          </div>
          <div className={"flex flex-col gap-4 p-6"}>
            {programs.length === 0 ? (
              <p className={"text-text-grey text-[14px] font-normal"}>
                This affiliate has no event programs yet.
              </p>
            ) : (
              programs.map((program, index) => (
                <div
                  key={`${program.event_name}-${index}`}
                  className={"bg-light-grey flex flex-col gap-2 rounded-xl p-2"}
                >
                  <div className={"bg-green-tint flex items-center gap-3 p-2 px-4"}>
                    <div className={"h-24 w-24 rounded-[8px] bg-gray-600"}></div>
                    <div className={"flex flex-col gap-1"}>
                      <p className={"font-semiBold text-[18px]"}>{program.event_name}</p>
                      <div className={"flex items-center gap-1"}>
                        <CalendarIcon className={"text-text-grey w-3.5"} />
                        <p className={"text-text-grey text-[16px] font-normal"}>
                          {formatLongDate(new Date(program.start_date), "mid")}
                        </p>
                      </div>
                      {program.location ? (
                        <div className={"flex items-center gap-1"}>
                          <MapPinIcon className={"text-text-grey w-3.5"} />
                          <p className={"text-text-grey text-[16px] font-normal"}>
                            {program.location}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={"bg-grey-20 flex items-center justify-between gap-2 rounded-xl p-2"}
                  >
                    <p className={"text-text-grey text-[12px] font-medium"}>
                      Affiliate link:{" "}
                      <span className={"text-light-black font-medium"}>
                        {program.affiliate_link}
                      </span>
                    </p>
                    <div className={"flex items-center gap-1"}>
                      <p className={"text-grey-30"}>|</p>
                      <CopyIcon
                        className={"text-grey-40 w-3.5 cursor-pointer"}
                        onClick={() => handleCopyLink(program.affiliate_link)}
                      />
                      {copiedLink === program.affiliate_link ? (
                        <span className={"text-light-green-70 text-[12px]"}>Copied</span>
                      ) : null}
                    </div>
                  </div>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-text-grey text-[12px] font-medium"}>Total Commission:</p>
                    </div>
                    <p className={"text-[14px] font-medium"}>
                      N{formatNumberWithCommas(program.breakdown.total_commissions)}
                    </p>
                  </div>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-[115px]"}>
                      <p className={"text-text-grey text-[12px] font-medium"}>
                        Total Tickets Sold:
                      </p>
                    </div>
                    <p className={"text-[14px] font-medium"}>{program.breakdown.ticket_sold}</p>
                  </div>
                  <div className={"flex flex-wrap justify-between gap-1"}>
                    {program.ticket_sold.map((ticket, ticketIndex) => (
                      <div
                        key={`${ticket.name}-${ticketIndex}`}
                        className={
                          "border-grey-20 flex h-[103px] w-full flex-col gap-2 rounded-[8px] border bg-white p-3"
                        }
                      >
                        <p className={"font-semiBold text-[14px]"}>{ticket.name}</p>
                        <div className={"items-center-center flex gap-6"}>
                          <div className={"w-[115px]"}>
                            <p className={"text-text-grey text-[12px] font-medium"}>Sold:</p>
                          </div>
                          <p className={"text-[14px] font-medium"}>{ticket.count}</p>
                        </div>
                        <div className={"items-center-center flex gap-6"}>
                          <div className={"w-[115px]"}>
                            <p className={"text-text-grey text-[12px] font-medium"}>Price:</p>
                          </div>
                          <p className={"text-[14px] font-medium"}>
                            N{formatNumberWithCommas(ticket.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AffiliateProgramDetailsClient;
