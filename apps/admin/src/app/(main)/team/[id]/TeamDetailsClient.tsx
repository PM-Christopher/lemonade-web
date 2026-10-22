"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import PaginationComp from "@/components/global/Pagination";
import { RootState } from "@/redux/store";
import { useTeamActivityLogsQuery, useTeamDetailQuery } from "@/features/team/queries";
import { useChangeTeamPasswordMutation } from "@/features/team/mutations";
import { capitalizeSpecial, capitalizeWords, GetStatusClass } from "@/utils/helper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";

const UpdatePasswordModal = dynamic(() => import("@/modals/team/UpdatePasswordModal"), {
  ssr: false,
});
const RemoveTeamMemberModal = dynamic(() => import("@/modals/team/RemoveTeamMemberModal"), {
  ssr: false,
});

const PER_PAGE = 10;

const RANGES: { value: string; label: string; days: number | null }[] = [
  { value: "all", label: "ALL TIME", days: null },
  { value: "1", label: "TODAY", days: 1 },
  { value: "7", label: "LAST 7 DAYS", days: 7 },
  { value: "30", label: "LAST 30 DAYS", days: 30 },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <div className="w-28.75 shrink-0">
        <p className="text-text-grey text-meta leading-normal font-medium">{label}:</p>
      </div>
      {children}
    </div>
  );
}

function TeamDetailsClient({ id }: { id: string }) {
  const { push } = useNavigation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: detail } = useTeamDetailQuery(id, { enabled: isLoggedIn });
  const team = detail?.team;

  const [range, setRange] = useState("all");
  const [page, setPage] = useState(1);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const days = RANGES.find((item) => item.value === range)?.days ?? null;
  const filters = {
    page,
    per_page: PER_PAGE,
    ...(days
      ? {
          start_date: dayjs()
            .subtract(days - 1, "day")
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss"),
        }
      : {}),
  };
  const { data: logsData } = useTeamActivityLogsQuery(id, filters, { enabled: isLoggedIn });
  const logs = logsData?.logs ?? [];
  const totalPages = logsData?.meta?.last_page ?? 1;

  const changePassword = useChangeTeamPasswordMutation(id);

  return (
    <>
      <section className="flex justify-between gap-5 p-5">
        <div className="flex h-fit w-147 flex-col gap-3 rounded-xl bg-white">
          <div className="flex flex-col gap-5 p-6">
            {team?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={team.image}
                alt={team.name}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="bg-mid-grey h-16 w-16 rounded-full" />
            )}
            <Field label="Full Name">
              <p className="text-body-s font-medium">{team?.name || "N/A"}</p>
            </Field>
            <Field label="User ID">
              <p className="text-body-s font-medium">{team?.unique_id || "N/A"}</p>
            </Field>
            <Field label="Status">
              <p
                className={`text-body-s font-medium ${GetStatusClass(capitalizeWords(team?.status ?? ""))}`}
              >
                {team?.status ? capitalizeWords(team.status) : "N/A"}
              </p>
            </Field>
            <Field label="Role">
              <p className="text-body-s font-medium">
                {team?.role ? capitalizeSpecial(team.role) : "N/A"}
              </p>
            </Field>
            <Field label="Email Address">
              <p className="text-body-s font-medium">{team?.email || "N/A"}</p>
            </Field>
            <Field label="Date Added">
              <p className="text-body-s font-medium">
                {team?.created_at ? dayjs(team.created_at).format("DD MMM, YYYY hh:mm A") : "N/A"}
              </p>
            </Field>
          </div>
          <div className="border-t-grey-20 mt-5 flex items-center justify-between gap-6 border-t p-6">
            <button
              className="border-light-grey-50 text-body-s w-full rounded-xl border px-12 py-2.75 font-sans font-medium"
              type="button"
              onClick={() => setPasswordOpen(true)}
            >
              Update password
            </button>
            <button
              className="border-light-grey-50 text-red-1 text-body-s w-full rounded-xl border px-12 py-2.75 font-sans font-medium"
              type="button"
              onClick={() => setRemoveOpen(true)}
            >
              Remove member
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-175 rounded-tl-xl rounded-tr-xl bg-white">
            <div className="border-b-grey-20 mt-2.5 flex justify-between border-b p-6">
              <p className="font-semiBold text-body-l">Activity Logs</p>
            </div>
            <div className="flex flex-col py-5">
              <div className="px-6 py-4">
                <Select
                  value={range}
                  onValueChange={(value) => {
                    setRange(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger
                    aria-label="Filter by date"
                    className="font-semiBold text-text-grey text-meta h-10 w-50.75 rounded-xl leading-normal"
                  >
                    <CalendarIcon className="w-3.75" />
                    <SelectValue />
                    <ChevronDown className="hidden" />
                  </SelectTrigger>
                  <SelectContent>
                    {RANGES.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 pb-6">
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <div className="flex justify-between px-6 py-4" key={log.id}>
                      <p className="text-light-black text-body-s font-medium">{log.message}</p>
                      <p className="text-text-grey text-body-s font-normal">
                        {dayjs(log.created_at).format("ddd, D MMM, YYYY hh:mm A")}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-text-grey text-body-s px-6 py-4 font-normal">
                    No activity yet.
                  </p>
                )}
              </div>
            </div>
          </div>
          <PaginationComp
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            perPage={PER_PAGE}
          />
        </div>
      </section>
      <UpdatePasswordModal
        isOpen={passwordOpen}
        toggle={() => setPasswordOpen(false)}
        submit={(values) => changePassword.mutateAsync(values)}
        currentPasswordHint="Enter your own password to confirm the change."
      />
      <RemoveTeamMemberModal
        isOpen={removeOpen}
        toggle={() => setRemoveOpen(false)}
        id={id}
        onRemoved={() => push(routes.TEAM)}
      />
    </>
  );
}

export default TeamDetailsClient;
