import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContentBare,
  DialogTitle,
} from "@lemonade/ui";
import { formatStringUCFirst } from "@/lib/helper";
import { useEventCategoriesQuery } from "@/features/shared";
import CalendarIcon from "@/images/icons/eventCalendarIcon.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useFilterEventsMutation } from "@/features/events/mutations";

type FilterEventInterface = {
  toggle: () => void;
  isOpen: boolean;
  filterEventsMutation: ReturnType<typeof useFilterEventsMutation>;
};

const FilterEventModal = ({ toggle, isOpen, filterEventsMutation }: FilterEventInterface) => {
  const [clickedCategory, setClickedCategory] = useState("");
  const [timeOptions] = useState(["This week", "This Month"]);
  const [timeType, setTimeType] = useState("");

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [location, setLocation] = useState("");

  const handleLocationChange = (value: string) => {
    setLocation(value);
  };

  const { data, isPending: loading } = useEventCategoriesQuery();

  const handleCategoryClick = (category: string) => {
    if (category === clickedCategory) {
      setClickedCategory("");
    } else {
      setClickedCategory(category);
    }
  };

  const handleTimeType = (selTimeType: string) => {
    if (selTimeType === timeType) {
      setTimeType("");
    } else {
      setTimeType(selTimeType);
    }
  };

  const handleFilterEvent = () => {
    const data = {
      category: clickedCategory,
      period: timeType,
      start_date: from,
      end_date: to,
      location: location,
    };
    filterEventsMutation.mutate(data, {
      onSuccess: () => toggle(),
    });
  };

  const handleResetFilter = () => {
    filterEventsMutation.reset();
    setClickedCategory("");
    setTo("");
    setFrom("");
    setTimeType("");
    setLocation("");
    toggle();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Event filter"}</DialogTitle>
        <div className="w-120 rounded-lg bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
              <p>Event filter</p>
            </div>
          </div>
          <div className="mt-6 flex flex-col">
            <div className="mt-6 grid gap-2">
              <Label htmlFor="fullname" className="text-text-grey text-label font-sans font-normal">
                CATEGORY
              </Label>
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    data?.categories?.map((category, index: number) => (
                      <div
                        className={`w-fit cursor-pointer rounded-xl p-3 px-4 ${
                          category?.name === clickedCategory
                            ? "bg-gradient-green-2 shadow-event-custom"
                            : "bg-light_grey"
                        }`}
                        key={index}
                        onClick={() => handleCategoryClick(category?.name ?? "")}
                      >
                        <p className="text-text-grey text-body-s font-normal">
                          {formatStringUCFirst(category?.name ?? "")}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-2">
              <Label htmlFor="fullname" className="text-text-grey text-label font-sans font-normal">
                TIME & DATE
              </Label>
              <div className="mt-2">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {timeOptions?.map((option: string, index: number) => (
                      <div
                        className={`w-fit cursor-pointer rounded-xl p-3 px-4 ${
                          option === timeType
                            ? "bg-gradient-green-2 shadow-event-custom"
                            : "bg-light_grey"
                        }`}
                        key={index}
                        onClick={() => handleTimeType(option)}
                      >
                        <p className="text-text-grey text-body-s font-normal">{option}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                      <div>
                        <CalendarIcon />
                      </div>
                      <div className="w-full">
                        <DatePicker
                          selected={from ? new Date(from) : null}
                          onChange={(date: Date | null) => {
                            if (date) {
                              // Update start date
                              setFrom(date.toISOString());
                              setTimeType("");
                            }
                          }}
                          showTimeSelect={false}
                          dateFormat="yyyy-MM-dd"
                          className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer px-2.5 font-sans leading-normal shadow-none"
                          placeholderText="From"
                        />
                      </div>
                    </div>
                    <p>-</p>
                    <div className="bg-light_grey flex h-10 w-full items-center gap-3 rounded-xl px-4">
                      <div>
                        <CalendarIcon />
                      </div>
                      <div className="w-full">
                        <DatePicker
                          selected={to ? new Date(to) : null}
                          onChange={(date: Date | null) => {
                            if (date) {
                              // Update start date
                              setTo(date.toISOString());
                              setTimeType("");
                            }
                          }}
                          showTimeSelect={false}
                          dateFormat="yyyy-MM-dd"
                          className="bg-light_grey font-semi-normal text-meta w-full cursor-pointer px-2.5 font-sans leading-normal shadow-none"
                          placeholderText="To"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-2">
              <Label htmlFor="fullname" className="text-text-grey text-label font-sans font-normal">
                LOCATION
              </Label>
              <div className="mt-2">
                <Select onValueChange={handleLocationChange}>
                  <SelectTrigger
                    aria-label="Location"
                    className="bg-mid-grey h-10 w-45 rounded-xl border-0 px-4"
                  >
                    <SelectValue
                      placeholder={
                        <span className="text-text-grey text-meta font-sans font-semibold">
                          Location
                        </span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="form-font">
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-10 flex gap-1">
              <button
                className="border-light-grey-50 w-full rounded-xl border p-2.5 px-3.5"
                onClick={handleResetFilter}
              >
                <p className="font-semi-normal text-black-light text-body-l font-sans">
                  Reset filter
                </p>
              </button>
              <button
                className="auth-button border-step-color rounded-xl p-2.5 px-3.5"
                onClick={handleFilterEvent}
              >
                <p className="font-semi-normal text-body-l font-sans text-white">Apply filter</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default FilterEventModal;
