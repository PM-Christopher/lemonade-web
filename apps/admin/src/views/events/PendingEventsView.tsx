import React from "react";
import dayjs from "dayjs";
import { useNavigation } from "@/hooks/useNavigation";
import useSearchParams from "@/hooks/useSearchParams";
import type { DateRange } from "@/components/global/DateRangePicker";
import { routes } from "@/lib/routes";
import type { EventPendingResponse, EventTabData } from "@/features/events/api";

const HEADERS = ["EVENT ID", "EVENT NAME", "EVENT TYPE", "CATEGORY", "DATE SUBMITTED"];

// Events waiting for approval; opening one shows the approve and reject actions.
const PendingEventsView = ({
  pageData,
  range = null,
}: {
  pageData: EventTabData | undefined;
  range?: DateRange | null;
}) => {
  const { push } = useNavigation();
  const { searchParams } = useSearchParams();
  const term = searchParams?.get("search")?.toLowerCase().trim() ?? "";
  // EventsClient only renders this view for the "pending" tab.
  const events = ((pageData as EventPendingResponse | undefined)?.events ?? []).filter((event) => {
    const submitted = dayjs(event.date_created_at);
    const inRange =
      range === null ||
      !submitted.isValid() ||
      (!submitted.isBefore(dayjs(range.start).startOf("day")) &&
        !submitted.isAfter(dayjs(range.end).endOf("day")));
    const matches =
      term === "" ||
      [event.event_name, event.unique_id, event.category, event.event_type].some((value) =>
        value?.toLowerCase().includes(term),
      );
    return inRange && matches;
  });

  return (
    <div className="rounded-lg bg-white shadow-md">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-mid-grey">
            {HEADERS.map((header) => (
              <th
                className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
                key={header}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map((event) => (
              <tr
                key={event.id}
                className="border-grey-20 h-18 cursor-pointer border-b"
                onClick={() => push(routes.EVENT_DETAIL(event.id))}
              >
                <td className={"p-4 font-sans text-sm font-medium"}>{event.unique_id}</td>
                <td className={"p-4 font-sans text-sm font-medium"}>{event.event_name}</td>
                <td className={"p-4 font-sans text-sm font-medium"}>{event.event_type}</td>
                <td className={"p-4 font-sans text-sm font-medium"}>{event.category}</td>
                <td className={"p-4 font-sans text-sm font-medium"}>
                  {dayjs(event.date_created_at).format("DD MMM, YYYY hh:mm A")}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={HEADERS.length} className="p-4 text-center text-sm text-gray-500">
                No events waiting for approval
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingEventsView;
