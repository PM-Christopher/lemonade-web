import React from "react";
import dayjs from "dayjs";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import PaginationComp from "@/components/global/Pagination";
import type { AccountInfoResponse } from "@/features/user/api";

interface ActivitiesViewsProps {
  userDetail: AccountInfoResponse | undefined;
  range: DateRange | null;
  onRangeChange: (range: DateRange | null) => void;
  page: number;
  perPage: number;
  onPageChange: (page: number) => void;
}

function ActivitiesViews({
  userDetail,
  range,
  onRangeChange,
  page,
  perPage,
  onPageChange,
}: ActivitiesViewsProps) {
  const logs = userDetail?.logs ?? [];

  return (
    <div className="flex flex-col py-5">
      <div className="px-6 py-4">
        <DateRangePicker value={range} onChange={onRangeChange} />
      </div>
      <div className="pt-4 pb-6">
        {logs.length > 0 ? (
          logs.map((item) => (
            <div className="flex justify-between px-6 py-4" key={item.id}>
              <p className="text-light-black text-body-s font-medium">{item.message}</p>
              <p className="text-text-grey text-body-s font-normal">
                {dayjs(item.created_at_iso).format("ddd, D MMM, YYYY hh:mm A")}
              </p>
            </div>
          ))
        ) : (
          <p className="text-text-grey text-body-s px-6 py-4 font-normal">No activity yet.</p>
        )}
      </div>
      <PaginationComp
        currentPage={page}
        totalPages={userDetail?.meta?.last_page ?? 1}
        onPageChange={onPageChange}
        perPage={perPage}
      />
    </div>
  );
}

export default ActivitiesViews;
