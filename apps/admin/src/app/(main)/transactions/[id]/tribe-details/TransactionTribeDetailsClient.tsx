"use client";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useState } from "react";
import { PrinterIcon } from "lucide-react";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import MainLayout from "@/components/layouts/MainLayout";
import PaginationComp from "@/components/global/Pagination";
import { RootState } from "@/redux/store";
import { useTransactionTribeDetailQuery } from "@/features/transaction/queries";
import type { TransactionHistoryRow } from "@/features/transaction/api";
import { capitalizeWords, manualTransactionsExport } from "@/utils/helper";

const PER_PAGE = 10;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={"flex gap-6"}>
      <div className={"w-28.75 shrink-0"}>
        <p className={"text-text-grey text-meta leading-normal font-medium"}>{label}:</p>
      </div>
      <div className={"flex gap-1"}>{children}</div>
    </div>
  );
}

function TransactionTribeDetailsClient({ id }: { id: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const { push } = useNavigation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data } = useTransactionTribeDetailQuery(id, { enabled: isLoggedIn });

  const info = data?.info;
  const history = data?.history ?? [];
  const totalPages = Math.ceil(history.length / PER_PAGE) || 1;
  const pageRows = history.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-row lg:items-start">
        <div
          className={"flex h-fit w-full shrink-0 flex-col gap-5 rounded-xl bg-white p-6 lg:w-150"}
        >
          <Field label="Full name">
            <p className={"text-body-s font-medium"}>{info?.user?.name}</p>
            {info?.user?.id && (
              <p
                className={"text-light-green text-body-s cursor-pointer font-medium"}
                onClick={() => push(routes.USER_DETAIL(String(info.user?.id)))}
              >
                View profile
              </p>
            )}
          </Field>
          <Field label="Transaction Id">
            <p className={"text-body-s font-medium"}>{info?.reference}</p>
          </Field>
          <Field label="Amount">
            <p className={"text-body-s font-medium"}>
              ₦{Number(info?.amount ?? 0).toLocaleString()}
            </p>
          </Field>
          <Field label="Tribe name">
            <p className={"text-body-s font-medium"}>{info?.tribe_name}</p>
          </Field>
          <Field label="Date paid">
            <p className={"text-body-s font-medium"}>
              {info?.paid_at ? dayjs(info.paid_at).format("DD MMM, YYYY hh:mmA") : "—"}
            </p>
          </Field>
          <Field label="Status">
            <p className={"text-light-green-70 text-body-s font-medium"}>
              {capitalizeWords(info?.status)}
            </p>
          </Field>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col">
          <div className={"min-h-175 rounded-tl-xl rounded-tr-xl bg-white"}>
            <div className={"border-b-grey-20 flex items-center justify-between border-b p-6"}>
              <p className={"font-semiBold text-body-l"}>Payment history</p>
              <button
                type="button"
                className={
                  "border-light-grey-50 flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5"
                }
                onClick={() =>
                  manualTransactionsExport(
                    history as unknown as Array<Record<string, unknown>>,
                    "tribe-payments",
                  )
                }
              >
                <PrinterIcon className={"w-5"} />
                <p className={"text-black-light text-body-l font-medium"}>Print</p>
              </button>
            </div>
            <div className={"flex flex-col px-6"}>
              {pageRows.map((item: TransactionHistoryRow) => (
                <div className="px-4 pt-4 pb-6" key={item.id}>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <p className={"text-body-s font-medium"}>
                        {item.reference} - ₦{Number(item.amount).toLocaleString()} (
                        {item.tribe_name})
                      </p>
                      <p className={"text-text-grey text-meta leading-normal font-normal"}>
                        {item.paid_at ? dayjs(item.paid_at).format("DD MMM, YYYY hh:mmA") : "—"}
                      </p>
                    </div>
                    <div className={"bg-light-green-60 h-fit gap-1 rounded-lg px-2 py-1"}>
                      <p className={"text-light-green-70 text-meta leading-normal font-medium"}>
                        {capitalizeWords(item.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-2">
            <PaginationComp
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              perPage={PER_PAGE}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default TransactionTribeDetailsClient;
