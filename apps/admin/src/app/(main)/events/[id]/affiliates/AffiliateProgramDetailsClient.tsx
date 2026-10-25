"use client";
import React, { useState } from "react";
import { FallbackImage } from "@/components/global/FallbackImage";
import { images } from "@/lib/images";
import { useEventAffiliateDetailQuery } from "@/features/events/queries";
import { formatLongDate } from "@/lib/dateTimeFormatter";
import { RootState } from "@/redux/store";
import { CalendarIcon, CopyIcon, ExternalLinkIcon, MapPinIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { AvatarName } from "@/components/global/AvatarName";
import { useSelector } from "react-redux";
import { naira } from "@/views/transactions/transactionFormat";

const AffiliateSalesModal = dynamic(() => import("@/modals/events/AffiliateSalesModal"), {
  ssr: false,
});

const AffiliateProgramDetailsClient = ({ id }: { id: string }) => {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useEventAffiliateDetailQuery(id, { enabled: isLoggedIn });
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const handleCopyLink = (link: string) => {
    void navigator.clipboard?.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink((current) => (current === link ? null : current)), 1500);
  };

  const affiliate = data?.affiliate;
  const programs = data?.programs ?? [];

  return (
    <>
      <section className={"flex justify-between gap-0.5 p-5"}>
        <div className={"flex h-fit w-100 flex-col gap-3 rounded-xl bg-white p-6"}>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>
                Affiliate Name:
              </p>
            </div>
            <div className={"flex gap-1"}>
              <AvatarName name={affiliate?.name} image={affiliate?.image} />
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Affiliate ID:</p>
            </div>
            <p className={"text-body-s font-medium"}>{affiliate?.unique_id}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>Date Joined:</p>
            </div>
            <div className={"flex gap-1"}>
              <p className={"text-body-s font-medium"}>
                {affiliate?.date_joined ? formatLongDate(new Date(affiliate.date_joined)) : ""}
              </p>
            </div>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>
                No of Programs:
              </p>
            </div>
            <p className={"text-light-green-70 text-body-s font-medium"}>{affiliate?.programs}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>
                Total Tickets Sold:
              </p>
            </div>
            <p className={"text-body-s font-medium"}>{affiliate?.tickets_sold}</p>
          </div>
          <div className={"items-center-center flex gap-6"}>
            <div className={"w-28.75"}>
              <p className={"text-text-grey text-meta leading-normal font-medium"}>
                Total Revenue:
              </p>
            </div>
            <p className={"text-body-s font-medium"}>{naira(affiliate?.total_revenue)}</p>
          </div>
          {affiliate?.account ? (
            <>
              <div className={"items-center-center flex gap-6"}>
                <div className={"w-28.75"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>
                    Account Number:
                  </p>
                </div>
                <p className={"text-body-s font-medium"}>{affiliate.account.account_number}</p>
              </div>
              <div className={"items-center-center flex gap-6"}>
                <div className={"w-28.75"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>
                    Account Holder:
                  </p>
                </div>
                <p className={"text-body-s font-medium"}>{affiliate.account.account_name}</p>
              </div>
              <div className={"items-center-center flex gap-6"}>
                <div className={"w-28.75"}>
                  <p className={"text-text-grey text-meta leading-normal font-medium"}>
                    Bank Name:
                  </p>
                </div>
                <p className={"text-body-s font-medium"}>{affiliate.account.bank_name}</p>
              </div>
            </>
          ) : (
            <p className={"text-text-grey text-body-s font-normal"}>No bank account on file</p>
          )}
          <button
            type="button"
            className={
              "text-light-green-70 text-body-s flex w-fit cursor-pointer items-center gap-1 font-medium"
            }
            onClick={() => setHistoryOpen(true)}
          >
            View transaction history <ExternalLinkIcon className={"h-3.5 w-3.5"} />
          </button>
        </div>
        <div className={"flex h-fit w-195 flex-col gap-4 rounded-xl bg-white"}>
          <div className={"border-b p-6"}>
            <p className={"font-semiBold text-body-l"}>Programs</p>
          </div>
          <div className={"flex flex-col gap-4 p-6"}>
            {programs.length === 0 ? (
              <p className={"text-text-grey text-body-s font-normal"}>
                This affiliate has no event programs yet.
              </p>
            ) : (
              programs.map((program, index) => (
                <div
                  key={`${program.event_name}-${index}`}
                  className={"bg-light-grey flex flex-col gap-2 rounded-xl p-2"}
                >
                  <div className={"bg-green-tint flex items-center gap-3 p-2 px-4"}>
                    <FallbackImage
                      unoptimized
                      src={program.event_image}
                      fallbackSrc={images.DEFAULT_EVENT}
                      alt={program.event_name}
                      width={96}
                      height={96}
                      className={"h-24 w-24 rounded-lg object-cover"}
                    />
                    <div className={"flex flex-col gap-1"}>
                      <p className={"font-semiBold text-body-xl"}>{program.event_name}</p>
                      <div className={"flex items-center gap-1"}>
                        <CalendarIcon className={"text-text-grey w-3.5"} />
                        <p className={"text-text-grey text-body-l font-normal"}>
                          {formatLongDate(new Date(program.start_date), "mid")}
                        </p>
                      </div>
                      {program.location ? (
                        <div className={"flex items-center gap-1"}>
                          <MapPinIcon className={"text-text-grey w-3.5"} />
                          <p className={"text-text-grey text-body-l font-normal"}>
                            {program.location}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div
                    className={"bg-grey-20 flex items-center justify-between gap-3 rounded-xl p-2"}
                  >
                    <p
                      className={
                        "text-text-grey text-meta min-w-0 leading-normal font-medium break-all"
                      }
                    >
                      Affiliate link:{" "}
                      <span className={"text-light-black font-medium"}>
                        {program.affiliate_url}
                      </span>
                    </p>
                    <button
                      type={"button"}
                      aria-label={"Copy affiliate link"}
                      className={
                        "border-light-grey-50 text-body-s flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border bg-white px-3 py-1 font-medium"
                      }
                      onClick={() => handleCopyLink(program.affiliate_url)}
                    >
                      <CopyIcon className={"h-3.5 w-3.5"} />
                      {copiedLink === program.affiliate_url ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-28.75"}>
                      <p className={"text-text-grey text-meta leading-normal font-medium"}>
                        Total Commission:
                      </p>
                    </div>
                    <p className={"text-body-s font-medium"}>
                      {naira(program.breakdown.total_commissions)}
                    </p>
                  </div>
                  <div className={"items-center-center flex gap-6"}>
                    <div className={"w-28.75"}>
                      <p className={"text-text-grey text-meta leading-normal font-medium"}>
                        Total Tickets Sold:
                      </p>
                    </div>
                    <p className={"text-body-s font-medium"}>{program.breakdown.ticket_sold}</p>
                  </div>
                  <div className={"flex flex-wrap justify-between gap-1"}>
                    {program.ticket_sold.map((ticket, ticketIndex) => (
                      <div
                        key={`${ticket.name}-${ticketIndex}`}
                        className={
                          "border-grey-20 flex h-25.75 w-full flex-col gap-2 rounded-lg border bg-white p-3"
                        }
                      >
                        <p className={"font-semiBold text-body-s"}>{ticket.name}</p>
                        <div className={"items-center-center flex gap-6"}>
                          <div className={"w-28.75"}>
                            <p className={"text-text-grey text-meta leading-normal font-medium"}>
                              Sold:
                            </p>
                          </div>
                          <p className={"text-body-s font-medium"}>{ticket.count}</p>
                        </div>
                        <div className={"items-center-center flex gap-6"}>
                          <div className={"w-28.75"}>
                            <p className={"text-text-grey text-meta leading-normal font-medium"}>
                              Price:
                            </p>
                          </div>
                          <p className={"text-body-s font-medium"}>{naira(ticket.price)}</p>
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
      <AffiliateSalesModal
        isOpen={historyOpen}
        toggle={() => setHistoryOpen(false)}
        affiliateId={id}
      />
    </>
  );
};

export default AffiliateProgramDetailsClient;
