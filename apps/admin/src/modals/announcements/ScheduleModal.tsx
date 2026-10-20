"use client";
import React, { useState } from "react";
import dayjs, { type Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight, ClockIcon, XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

interface ScheduleModalProps {
  isOpen: boolean;
  toggle: () => void;
  // The time to start from; defaults to the next hour.
  initial?: Date;
  onSave: (when: Date) => void;
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

const nextHour = () => dayjs().add(1, "hour").startOf("hour");

// Picks the day and time an announcement goes out.
function ScheduleModal({ isOpen, toggle, initial, onSave }: ScheduleModalProps) {
  const start = initial ? dayjs(initial) : nextHour();
  const [selected, setSelected] = useState<Dayjs>(start);
  const [month, setMonth] = useState<Dayjs>(start.startOf("month"));
  const [time, setTime] = useState(start.format("hh:mm"));
  const [meridiem, setMeridiem] = useState<"AM" | "PM">(start.hour() >= 12 ? "PM" : "AM");
  const [error, setError] = useState("");

  const firstWeekday = month.startOf("month").day();
  const cells = Array.from({ length: 42 }, (_, index) =>
    month.startOf("month").add(index - firstWeekday, "day"),
  );

  const save = () => {
    const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
    const hour = match ? Number(match[1]) : NaN;
    const minute = match ? Number(match[2]) : NaN;
    if (!match || hour < 1 || hour > 12 || minute > 59) {
      setError("Enter a time like 09:30");
      return;
    }
    const hour24 = (hour % 12) + (meridiem === "PM" ? 12 : 0);
    const when = selected.hour(hour24).minute(minute).second(0).millisecond(0);
    if (!when.isAfter(dayjs())) {
      setError("Pick a time in the future");
      return;
    }
    setError("");
    onSave(when.toDate());
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Schedule</DialogTitle>
        <div className="w-105 max-w-[94vw] rounded-xl bg-white p-6">
          <div className="flex items-center justify-between">
            <p className="text-body-l font-sans font-semibold">Schedule</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </button>
          </div>
          <p className="text-body-xl mt-6 text-center font-sans font-semibold">
            {selected.format("ddd D MMM")}, {time} {meridiem}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              aria-label="Previous month"
              className="cursor-pointer"
              onClick={() => setMonth(month.subtract(1, "month"))}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="text-meta font-semibold">{month.format("MMMM YYYY")}</p>
            <button
              type="button"
              aria-label="Next month"
              className="cursor-pointer"
              onClick={() => setMonth(month.add(1, "month"))}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((day, index) => (
              <span className="text-text-grey text-meta" key={index}>
                {day}
              </span>
            ))}
            {cells.map((day) => {
              const inMonth = day.month() === month.month();
              const isSelected = day.isSame(selected, "day");
              const past = day.isBefore(dayjs(), "day");
              return (
                <button
                  key={day.format("YYYY-MM-DD")}
                  type="button"
                  disabled={past}
                  aria-label={day.format("D MMMM YYYY")}
                  aria-pressed={isSelected}
                  onClick={() => setSelected(day)}
                  className={`mx-auto h-8 w-8 rounded-full text-sm ${
                    isSelected
                      ? "bg-light-green font-semibold text-white"
                      : inMonth
                        ? "hover:bg-light_grey"
                        : "text-text-grey"
                  } ${past ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
                >
                  {day.date()}
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <p className="text-meta text-text-grey">Time</p>
            <div className="mt-1 flex items-center gap-2">
              <div className="bg-light_grey flex h-10 flex-1 items-center gap-2 rounded-xl px-3">
                <ClockIcon className="h-4 w-4" />
                <input
                  aria-label="Time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
              {(["AM", "PM"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={meridiem === option}
                  onClick={() => setMeridiem(option)}
                  className={`h-10 rounded-xl px-3 text-sm font-semibold ${
                    meridiem === option ? "bg-light-green text-white" : "bg-light_grey"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
          <div className="mt-6 flex gap-2.5">
            <button
              type="button"
              className="border-light-grey-50 h-12 w-full rounded-xl border bg-white"
              onClick={toggle}
            >
              <p className="text-body-l font-medium text-black">Cancel</p>
            </button>
            <button
              type="button"
              className="border-step-color bg-gradient-green h-12 w-full rounded-xl border text-center"
              onClick={save}
            >
              <p className="text-body-l font-medium text-white">Save</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default ScheduleModal;
