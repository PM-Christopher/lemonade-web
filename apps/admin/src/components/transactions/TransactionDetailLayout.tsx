"use client";
import React, { useState } from "react";
import { PrinterIcon } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import PaginationComp from "@/components/global/Pagination";
import { downloadCSV, transactionStatus } from "@/utils/helper";

export interface DetailRow {
  label: string;
  value: React.ReactNode;
}

export interface HistoryEntry {
  key: string;
  title: string;
  date: string;
  status: string;
}

interface TransactionDetailLayoutProps {
  rows: ReadonlyArray<DetailRow>;
  historyTitle: string;
  entries: ReadonlyArray<HistoryEntry>;
  printName: string;
}

const PER_PAGE = 10;

// The two-column page every transaction detail shares: the details on the left, a printable history on the right.
export function TransactionDetailLayout({
  rows,
  historyTitle,
  entries,
  printName,
}: TransactionDetailLayoutProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(entries.length / PER_PAGE));
  const pageEntries = entries.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const print = () => {
    const lines = entries.map((entry) =>
      [entry.title, entry.date, transactionStatus(entry.status).label]
        .map((value) => `"${value.replace(/"/g, '""')}"`)
        .join(","),
    );
    downloadCSV(["Entry,Date,Status", ...lines].join("\n"), `${printName}.csv`);
  };

  return (
    <MainLayout>
      <section className="flex w-full max-w-full flex-col gap-4 overflow-x-hidden p-4 md:gap-5 md:p-5 lg:flex-row lg:items-start">
        <div className="flex h-fit w-full shrink-0 flex-col gap-5 rounded-xl bg-white p-6 lg:w-150">
          {rows.map((row) => (
            <div className="flex items-center gap-6" key={row.label}>
              <div className="w-32 shrink-0">
                <p className="text-text-grey text-meta leading-normal font-medium">{row.label}:</p>
              </div>
              <div className="text-body-s min-w-0 font-medium">{row.value}</div>
            </div>
          ))}
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col">
          <div className="min-h-100 rounded-tl-xl rounded-tr-xl bg-white">
            <div className="border-b-grey-20 flex items-center justify-between border-b p-6">
              <p className="font-semiBold text-body-l">{historyTitle}</p>
              <button
                type="button"
                className="border-light-grey-50 flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5"
                onClick={print}
                disabled={entries.length === 0}
              >
                <PrinterIcon className="w-5" />
                <span className="text-black-light text-body-l font-medium">Print</span>
              </button>
            </div>
            <div className="flex flex-col px-6">
              {pageEntries.length === 0 ? (
                <p className="text-text-grey text-body-s p-4">Nothing here yet.</p>
              ) : (
                pageEntries.map((entry) => {
                  const status = transactionStatus(entry.status);
                  return (
                    <div className="flex justify-between px-4 pt-4 pb-6" key={entry.key}>
                      <div className="flex flex-col">
                        <p className="text-body-s font-medium">{entry.title}</p>
                        <p className="text-text-grey text-meta leading-normal font-normal">
                          {entry.date}
                        </p>
                      </div>
                      <div className={`h-fit rounded-lg px-2 py-1 ${status.chip}`}>
                        <p className={`text-meta leading-normal font-medium ${status.className}`}>
                          {status.label}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          <div className="mt-2">
            <PaginationComp
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              perPage={PER_PAGE}
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
