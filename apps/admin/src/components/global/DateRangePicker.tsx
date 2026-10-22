"use client";
import React, { useEffect, useRef, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface DateRange {
  start: Date;
  end: Date;
}

interface DateRangePickerProps {
  // null means all time.
  value: DateRange | null;
  onChange: (range: DateRange | null) => void;
}

// Calendar, quick list and padding.
const POPUP_WIDTH = 720;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const PRESETS: { label: string; range: () => DateRange | null }[] = [
  {
    label: "Yesterday",
    range: () => ({
      start: dayjs().subtract(1, "day").startOf("day").toDate(),
      end: dayjs().subtract(1, "day").endOf("day").toDate(),
    }),
  },
  {
    label: "Last 7 days",
    range: () => ({
      start: dayjs().subtract(6, "day").startOf("day").toDate(),
      end: dayjs().endOf("day").toDate(),
    }),
  },
  {
    label: "Last month",
    range: () => ({
      start: dayjs().subtract(1, "month").startOf("day").toDate(),
      end: dayjs().endOf("day").toDate(),
    }),
  },
  {
    label: "Last 6 months",
    range: () => ({
      start: dayjs().subtract(6, "month").startOf("day").toDate(),
      end: dayjs().endOf("day").toDate(),
    }),
  },
  {
    label: "Last year",
    range: () => ({
      start: dayjs().subtract(1, "year").startOf("day").toDate(),
      end: dayjs().endOf("day").toDate(),
    }),
  },
  { label: "All time", range: () => null },
];

export const rangeLabel = (value: DateRange | null) =>
  value
    ? `${dayjs(value.start).format("D MMM YYYY")} - ${dayjs(value.end).format("D MMM YYYY")}`
    : "ALL TIME";

// "YYYY-MM-DD HH:mm:ss" in UTC, as the API expects.
export const toApiTime = (date: Date) => date.toISOString().slice(0, 19).replace("T", " ");

function Month({
  month,
  start,
  end,
  onPick,
}: {
  month: Dayjs;
  start: Dayjs | null;
  end: Dayjs | null;
  onPick: (day: Dayjs) => void;
}) {
  const first = month.startOf("month");
  const cells = Array.from({ length: 42 }, (_, index) => first.add(index - first.day(), "day"));
  const today = dayjs();

  return (
    <div className="w-56">
      <p className="text-meta text-center font-semibold">{month.format("MMMM YYYY")}</p>
      <div className="mt-3 grid grid-cols-7 text-center">
        {WEEKDAYS.map((day, index) => (
          <span className="text-text-grey text-meta pb-1" key={index}>
            {day}
          </span>
        ))}
        {cells.map((day) => {
          const inMonth = day.month() === month.month();
          const isStart = Boolean(start && day.isSame(start, "day"));
          const isEnd = Boolean(end && day.isSame(end, "day"));
          const isEdge = isStart || isEnd;
          const inRange = Boolean(
            start && end && !day.isBefore(start, "day") && !day.isAfter(end, "day"),
          );
          // The band runs through the range and rounds off at its ends and at week edges.
          const band = inRange
            ? `bg-light-green/20 ${isStart || day.day() === 0 ? "rounded-l-full" : ""} ${
                isEnd || day.day() === 6 ? "rounded-r-full" : ""
              }`
            : "";
          const label = day.format("D MMMM YYYY");
          const isToday = day.isSame(today, "day");

          return (
            <div key={day.format("YYYY-MM-DD")} className={`flex h-8 items-center ${band}`}>
              {inMonth ? (
                <button
                  type="button"
                  aria-label={label}
                  aria-pressed={isEdge}
                  onClick={() => onPick(day)}
                  className={`mx-auto h-8 w-8 cursor-pointer rounded-full text-xs ${
                    isEdge
                      ? "bg-light-green font-semibold text-white"
                      : isToday
                        ? "border-grey-20 border"
                        : "hover:bg-light_grey"
                  }`}
                >
                  {day.date()}
                </button>
              ) : (
                <span className="text-grey-40 mx-auto text-xs">{day.date()}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// "ALL TIME" button that opens a two-month calendar and quick ranges.
export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Dayjs>(() => dayjs().subtract(1, "month").startOf("month"));
  const [from, setFrom] = useState<Dayjs | null>(null);
  const [alignRight, setAlignRight] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const start = from ?? (value ? dayjs(value.start) : null);
  const end = from ? null : value ? dayjs(value.end) : null;

  const pick = (day: Dayjs) => {
    if (!from) {
      setFrom(day);
      return;
    }
    const [first, last] = day.isBefore(from) ? [day, from] : [from, day];
    setFrom(null);
    setOpen(false);
    onChange({ start: first.startOf("day").toDate(), end: last.endOf("day").toDate() });
  };

  return (
    <div className="relative flex items-center gap-2" ref={rootRef}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Filter by date"
        onClick={() => {
          // Open towards the side that has room, so the calendar is never cut off.
          const rect = rootRef.current?.getBoundingClientRect();
          if (rect) setAlignRight(rect.left + POPUP_WIDTH > window.innerWidth);
          setOpen((current) => !current);
        }}
        className="border-grey-20 bg-light_grey flex h-10 min-w-48.25 cursor-pointer items-center justify-between gap-3 rounded-xl border px-4 py-2.5"
      >
        <span className="text-text-grey flex items-center gap-2">
          <CalendarIcon className="h-3.75 w-3.75" />
          <span className="font-semiBold text-meta leading-normal">{rangeLabel(value)}</span>
        </span>
        <ChevronDown className="text-text-grey w-5" />
      </button>
      {value && (
        <button
          type="button"
          className="text-text-grey hover:text-light-green text-meta cursor-pointer font-semibold"
          onClick={() => {
            setFrom(null);
            setOpen(false);
            onChange(null);
          }}
        >
          Clear
        </button>
      )}
      {open && (
        <div
          role="dialog"
          aria-label="Choose dates"
          className={`absolute top-full z-50 mt-1 flex rounded-xl bg-white p-5 shadow-lg ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          <div className="flex items-start gap-4">
            <button
              type="button"
              aria-label="Previous month"
              className="mt-0.5 cursor-pointer"
              onClick={() => setMonth(month.subtract(1, "month"))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <Month month={month} start={start} end={end} onPick={pick} />
            <Month month={month.add(1, "month")} start={start} end={end} onPick={pick} />
            <button
              type="button"
              aria-label="Next month"
              className="mt-0.5 cursor-pointer"
              onClick={() => setMonth(month.add(1, "month"))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <ul className="border-l-grey-20 ml-5 flex w-32 flex-col gap-2 border-l pl-5">
            {PRESETS.map((preset) => (
              <li key={preset.label}>
                <button
                  type="button"
                  className="hover:text-light-green text-text-grey w-full cursor-pointer py-1 text-left text-sm"
                  onClick={() => {
                    setFrom(null);
                    setOpen(false);
                    onChange(preset.range());
                  }}
                >
                  {preset.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default DateRangePicker;
