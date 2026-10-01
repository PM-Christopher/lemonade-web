"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SearchIcon } from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { moderationContentHeaders } from "@/data/tableData";
import { capitalizeWords } from "@/utils/helper";
import PaginationComp from "@/components/global/Pagination";
import useSearchParams from "@/hooks/useSearchParams";
import useDebounce from "@/hooks/useDebounce";
import dayjs from "dayjs";
import { useModerationContentQuery, useModerationQueueQuery } from "@/features/moderation/queries";
import { useRestoreModeratedContentMutation } from "@/features/moderation/mutations";
import type { ModerationContentType } from "@/features/moderation/api";

const DeleteContentModal = dynamic(() => import("@/modals/moderation/DeleteContentModal"), {
  ssr: false,
});

const PER_PAGE = 10;

const CONTENT_TABS: ReadonlyArray<{ type: ModerationContentType; label: string }> = [
  { type: "forums", label: "Forums" },
  { type: "forum-comments", label: "Forum comments" },
];

function ForumClient() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { searchParams, setSearchParams } = useSearchParams();

  const activeType = (searchParams?.get("type") as ModerationContentType | null) ?? "forums";
  const currentPage = Number(searchParams?.get("page") ?? 1);
  const showRemoved = searchParams?.get("deleted") === "1";

  const [searchValue, setSearchValue] = useState(searchParams?.get("search") ?? "");
  const { debouncedValue } = useDebounce(searchValue, 500);

  useEffect(() => {
    setSearchParams({ search: debouncedValue || undefined, page: undefined });
    // setSearchParams's identity changes on every navigation — including it
    // here would re-run this effect after every push and push again in a
    // loop (same reasoning as events/EventsClient.tsx).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const { data: queue } = useModerationQueueQuery({ enabled: isLoggedIn });
  const { data: content } = useModerationContentQuery(
    activeType,
    {
      deleted: showRemoved,
      search: debouncedValue || undefined,
      page: currentPage,
      perPage: PER_PAGE,
    },
    { enabled: isLoggedIn },
  );

  const [deleteTarget, setDeleteTarget] = useState<{ id: number; label: string } | null>(null);
  const restoreMutation = useRestoreModeratedContentMutation(activeType);

  const switchType = (type: ModerationContentType) => {
    setSearchParams({ type, page: undefined });
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ page: String(page) });
  };

  const rows = content?.content ?? [];
  const totalPages = content?.meta?.last_page ?? 1;

  return (
    <MainLayout>
      <section className="mt-[24px] flex flex-col gap-[20px]">
        <div className={"flex gap-[16px] px-[20px]"}>
          <div
            className={
              "border-grey-20 flex flex-col gap-[4px] rounded-[12px] border-[1px] p-[16px]"
            }
          >
            <p className={"font-semiBold text-text-grey text-[12px]"}>PENDING EVENTS</p>
            <p className={"font-semiBold text-[20px]"}>{queue?.pending_events.count ?? 0}</p>
          </div>
          <div
            className={
              "border-grey-20 flex flex-col gap-[4px] rounded-[12px] border-[1px] p-[16px]"
            }
          >
            <p className={"font-semiBold text-text-grey text-[12px]"}>PENDING BUSINESSES</p>
            <p className={"font-semiBold text-[20px]"}>{queue?.pending_businesses.count ?? 0}</p>
          </div>
          <div
            className={
              "border-grey-20 flex flex-col gap-[4px] rounded-[12px] border-[1px] p-[16px]"
            }
          >
            <p className={"font-semiBold text-text-grey text-[12px]"}>OPEN REPORTS</p>
            <p className={"font-semiBold text-[20px]"}>{queue?.open_reports.count ?? 0}</p>
          </div>
        </div>

        <div className={"flex items-center justify-between px-[20px]"}>
          <div className={"flex gap-[8px]"}>
            {CONTENT_TABS.map((tab) => (
              <button
                key={tab.type}
                onClick={() => switchType(tab.type)}
                className={`h-[40px] rounded-[12px] border-[1px] px-[16px] text-[14px] font-medium ${
                  activeType === tab.type
                    ? "border-light-green-tint bg-light-tint"
                    : "border-grey-20 bg-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className={"flex gap-[12px]"}>
            <div className="bg-light_grey border-grey-20 flex h-[40px] w-[285px] items-center gap-3 rounded-[12px] border-[1px] p-2 px-[12px]">
              <SearchIcon className={"text-grey-40 h-[12px] w-[12px]"} />
              <input
                id="search"
                type="text"
                className="bg-light-grey w-full rounded-xl py-4 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                placeholder="Search content..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
            <button
              onClick={() =>
                setSearchParams({ deleted: showRemoved ? undefined : "1", page: undefined })
              }
              className={`h-[40px] rounded-[12px] border-[1px] px-[16px] text-[14px] font-medium ${
                showRemoved ? "border-light-green-tint bg-light-tint" : "border-grey-20 bg-white"
              }`}
            >
              Show removed
            </button>
          </div>
        </div>

        <div className={"flex flex-col px-[20px]"}>
          <div className={"border-grey-20 flex flex-col rounded-[12px] border-[1px]"}>
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-mid-grey">
                    {moderationContentHeaders.map((header, idx) => (
                      <th
                        className="font-semiBold text-text-grey p-4 text-left text-[12px]"
                        key={idx}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.length > 0 ? (
                    rows.map((row) => {
                      const isDeleted = row.deleted_at !== null;

                      return (
                        <tr key={row.id} className="border-grey-20 h-[72px] border-b">
                          <td className={"p-4 font-sans text-sm font-medium"}>{row.id}</td>
                          <td
                            className={"max-w-[320px] truncate p-4 font-sans text-sm font-medium"}
                          >
                            {row.title ?? row.body ?? "—"}
                          </td>
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            {row.author?.name ?? "—"}
                          </td>
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            {dayjs(row.created_at).format("DD MMM, YYYY hh:mmA")}
                          </td>
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            {isDeleted ? "Removed" : capitalizeWords(row.status ?? "active")}
                          </td>
                          <td className={"p-4 font-sans text-sm font-medium"}>
                            {isDeleted ? (
                              <button
                                className={"text-light-green-70"}
                                disabled={restoreMutation.isPending}
                                onClick={() => restoreMutation.mutate(row.id)}
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                className={"text-red-1"}
                                onClick={() =>
                                  setDeleteTarget({
                                    id: row.id,
                                    label: row.type_label,
                                  })
                                }
                              >
                                Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={moderationContentHeaders.length}
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        No content found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <PaginationComp
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                perPage={PER_PAGE}
              />
            </div>
          </div>
        </div>
      </section>
      <DeleteContentModal
        isOpen={deleteTarget !== null}
        toggle={() => setDeleteTarget(null)}
        type={activeType}
        id={deleteTarget?.id}
        label={deleteTarget?.label ?? "content"}
      />
    </MainLayout>
  );
}

export default ForumClient;
