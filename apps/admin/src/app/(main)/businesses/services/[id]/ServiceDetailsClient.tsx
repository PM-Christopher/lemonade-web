"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { AvatarName } from "@/components/global/AvatarName";
import { useServiceDetailQuery } from "@/features/businesses/queries";
import type { ServicePerson } from "@/features/businesses/api";
import { naira } from "@/views/transactions/transactionFormat";
import { serviceStatusClass } from "@/views/businesses/businessFormat";

const SettleServiceModal = dynamic(() => import("@/modals/businesses/SettleServiceModal"), {
  ssr: false,
});
const ChatModal = dynamic(() => import("@/modals/users/ChatModal"), { ssr: false });

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4">
      <p className="text-text-grey text-meta w-32 shrink-0 leading-normal font-medium">{label} :</p>
      <div className="text-body-s min-w-0 font-medium">{children}</div>
    </div>
  );
}

function Person({ person, onChat }: { person: ServicePerson | null; onChat: () => void }) {
  if (!person) return <>N/A</>;
  return (
    <span className="flex items-center gap-3">
      {person.name}
      <button
        type="button"
        className="text-light-green-70 cursor-pointer font-medium"
        onClick={onChat}
      >
        Open chat
      </button>
    </span>
  );
}

// One service job: its parties, status, disputes and the escrow settlement.
function ServiceDetailsClient({ id }: { id: string }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useServiceDetailQuery(id, { enabled: isLoggedIn });
  const service = data?.service;
  const disputes = data?.disputes ?? [];
  const [settle, setSettle] = useState<"release" | "refund" | null>(null);
  const [chatWith, setChatWith] = useState<ServicePerson | null>(null);

  return (
    <>
      <section className="flex w-full flex-col gap-4 p-4 md:p-5 lg:flex-row lg:items-start">
        <div className="flex h-fit w-full shrink-0 flex-col gap-4 rounded-xl bg-white p-5 lg:w-110">
          <Row label="Service Id">{service?.unique_id}</Row>
          <Row label="Business Name">
            <AvatarName name={service?.business?.name} image={service?.business?.image} />
          </Row>
          <Row label="Business Owner">
            <Person
              person={service?.owner ?? null}
              onChat={() => setChatWith(service?.owner ?? null)}
            />
          </Row>
          <Row label="Client Name">
            <Person
              person={service?.client ?? null}
              onChat={() => setChatWith(service?.client ?? null)}
            />
          </Row>
          <Row label="Amount">{naira(service?.amount)}</Row>
          <Row label="Date Paid">
            {service ? dayjs(service.start_date).format("MMM D, YYYY hh:mm A") : ""}
          </Row>
          <Row label="Status">
            {service && (
              <span className={serviceStatusClass(service.status)}>{service.status}</span>
            )}
          </Row>
          <Row label="Services Required">
            <span className="flex flex-wrap gap-1">
              {service?.services.map((item) => (
                <span key={item} className="bg-light-grey text-meta rounded px-2 py-0.5">
                  {item}
                </span>
              ))}
            </span>
          </Row>
          <Row label="Client Note">{service?.client_note ?? "N/A"}</Row>
          {service?.client_status && (
            <Row label="Client Status">
              <span className="text-meta rounded bg-lime-50 px-2 py-1">
                {service.client_status}
              </span>
            </Row>
          )}
          {service?.business_status && (
            <Row label="Business Status">
              <span className="text-meta rounded bg-lime-50 px-2 py-1">
                {service.business_status}
              </span>
            </Row>
          )}
          {service?.can_settle && (
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                className="border-light-grey-50 h-11 flex-1 cursor-pointer rounded-xl border bg-white"
                onClick={() => setSettle("refund")}
              >
                <p className="text-body-s font-medium">Refund client</p>
              </button>
              <button
                type="button"
                className="bg-gradient-green h-11 flex-1 cursor-pointer rounded-xl"
                onClick={() => setSettle("release")}
              >
                <p className="text-body-s font-medium text-white">Release funds</p>
              </button>
            </div>
          )}
        </div>

        <div className="flex min-h-96 w-full min-w-0 flex-1 flex-col rounded-xl bg-white">
          <p className="text-body-l border-b p-5 font-semibold">Dispute</p>
          {disputes.length === 0 ? (
            <p className="text-body-l m-auto font-medium">No dispute</p>
          ) : (
            disputes.map((dispute) => (
              <div key={dispute.id} className="flex flex-col gap-3 border-b p-5">
                <p className="text-body-s font-semibold">
                  {dispute.raised_by_role === "owner" ? "Business owner dispute" : "Client dispute"}
                </p>
                <div className="bg-light-grey rounded-lg p-3">
                  <p className="text-text-grey text-meta">Remark</p>
                  <p className="text-body-s mt-1">{dispute.remark}</p>
                </div>
                {dispute.attachments.length > 0 && (
                  <>
                    <p className="text-text-grey text-meta">Attachments</p>
                    <div className="flex flex-wrap gap-2">
                      {dispute.attachments.map((src) => (
                        <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                          <Image
                            unoptimized
                            src={src}
                            alt="Attachment"
                            width={96}
                            height={96}
                            className="h-24 w-24 rounded-lg object-cover"
                          />
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>
      {settle && (
        <SettleServiceModal
          isOpen
          toggle={() => setSettle(null)}
          serviceId={id}
          resolution={settle}
          service={service}
        />
      )}
      {chatWith && (
        <ChatModal
          isOpen
          toggle={() => setChatWith(null)}
          userId={chatWith.id}
          userName={chatWith.name}
        />
      )}
    </>
  );
}

export default ServiceDetailsClient;
