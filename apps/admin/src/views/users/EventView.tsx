import React from "react";
import { CalendarIcon, Dot } from "lucide-react";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import type { AccountInfoResponse } from "@/features/user/api";

interface EventViewProps {
  userDetail: AccountInfoResponse | undefined;
  filter: string;
  onFilterChange: (filter: string) => void;
}

const FILTERS = [
  { value: "all", label: "ALL EVENTS" },
  { value: "upcoming", label: "UPCOMING" },
  { value: "ended", label: "ENDED" },
];

const EventView: React.FC<EventViewProps> = ({ userDetail, filter, onFilterChange }) => {
  const events = userDetail?.events ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="p-4 px-6 pt-6">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger
            aria-label="Filter events"
            className="font-semiBold text-text-grey text-meta h-10 w-50.75 rounded-xl leading-normal"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FILTERS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-6">
          {events.map((item) => (
            <div key={item.id} className="relative flex w-fit flex-col gap-1 rounded-xl border p-1">
              {item.image && (
                <Image
                  unoptimized
                  src={item.image}
                  alt=""
                  width={155}
                  height={155}
                  className="h-38.75 w-38.75 rounded-lg object-cover"
                />
              )}
              {item.upcoming !== undefined && (
                <span
                  className={`absolute top-2 right-2 rounded-md px-1.5 py-0.5 text-xs font-semibold ${
                    item.upcoming ? "text-light-green bg-white" : "text-red-1 bg-white"
                  }`}
                >
                  {item.upcoming ? "Upcoming" : "Ended"}
                </span>
              )}
              <p className="font-semiBold text-body-s">{item.name}</p>
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-3" />
                <p className="text-text-grey text-meta leading-normal font-normal">{item.date}</p>
                <Dot className="text-text-grey" />
                <p className="text-text-grey text-meta leading-normal font-normal">{item.time}</p>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-text-grey text-body-s font-normal">No events found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventView;
