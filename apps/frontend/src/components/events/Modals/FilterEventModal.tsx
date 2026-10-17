import React, { useState } from "react";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CloseIcon from "@/images/icons/close.svg";
import CalendarIcon from "@/images/icons/eventCalendarIcon.svg";
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
import { useFilterEventsMutation } from "@/features/events/mutations";

type FilterEventInterface = {
  toggle: () => void;
  isOpen: boolean;
  filterEventsMutation: ReturnType<typeof useFilterEventsMutation>;
};

// Quick periods, matched by name on the backend (FilterUserEvents).
const TIME_OPTIONS = ["Today", "This week", "Next weekend"];

const LOCATION_OPTIONS = [
  { value: "all", label: "All locations" },
  { value: "online", label: "Online" },
  { value: "physical", label: "Physical" },
];

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`text-body-s w-fit cursor-pointer rounded-xl px-4 py-3 font-normal ${
        selected ? "bg-gradient-green-2 text-black" : "bg-light_grey text-text-grey"
      }`}
    >
      {label}
    </button>
  );
}

function DateField({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (date: Date) => void;
}) {
  return (
    <div className="bg-light_grey flex h-10 w-full min-w-0 items-center gap-2 rounded-xl px-3">
      <CalendarIcon className="shrink-0" />
      <DatePicker
        selected={value ? dayjs(value).toDate() : null}
        onChange={(date: Date | null) => date && onChange(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholder}
        ariaLabelledBy={placeholder}
        className="text-meta w-full min-w-0 cursor-pointer bg-transparent font-sans leading-normal shadow-none outline-none"
      />
    </div>
  );
}

const FilterEventModal = ({ toggle, isOpen, filterEventsMutation }: FilterEventInterface) => {
  const [category, setCategory] = useState("");
  const [period, setPeriod] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [location, setLocation] = useState("all");

  const { data, isPending: loading } = useEventCategoriesQuery();

  const pickPeriod = (option: string) => {
    setPeriod(option === period ? "" : option);
    if (option !== period) {
      setFrom("");
      setTo("");
    }
  };

  const pickDate = (setter: (value: string) => void) => (date: Date) => {
    setter(dayjs(date).format("YYYY-MM-DD"));
    setPeriod("");
  };

  const apply = () => {
    filterEventsMutation.mutate(
      { category, period, start_date: from, end_date: to, location },
      { onSuccess: () => toggle() },
    );
  };

  const reset = () => {
    filterEventsMutation.reset();
    setCategory("");
    setPeriod("");
    setFrom("");
    setTo("");
    setLocation("all");
    toggle();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare
        // Keep focus off the date fields so the calendar does not pop open.
        onOpenAutoFocus={(event) => event.preventDefault()}
        className="h-dvh w-full max-w-none content-start gap-0 overflow-y-auto border-0 bg-white p-0 shadow-none sm:h-auto sm:max-h-[90dvh] sm:max-w-120 sm:rounded-xl"
      >
        <div className="flex min-h-dvh flex-col p-4 sm:min-h-0 sm:p-6">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </button>
            <DialogTitle className="text-body-l font-semibold tracking-normal">
              Event filter
            </DialogTitle>
          </div>

          <div className="mt-6 flex flex-col gap-6">
            <div className="grid gap-3">
              <Label className="text-text-grey text-label font-sans font-normal">CATEGORY</Label>
              <div className="flex flex-wrap gap-2">
                <Chip label="All" selected={category === ""} onClick={() => setCategory("")} />
                {loading ? (
                  <p className="text-text-grey text-body-s">Loading...</p>
                ) : (
                  data?.categories?.map((item) => (
                    <Chip
                      key={item.name}
                      label={formatStringUCFirst(item.name ?? "") ?? ""}
                      selected={Boolean(item.name) && category === item.name}
                      onClick={() => setCategory(category === item.name ? "" : (item.name ?? ""))}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <Label className="text-text-grey text-label font-sans font-normal">TIME & DATE</Label>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map((option) => (
                  <Chip
                    key={option}
                    label={option}
                    selected={period === option}
                    onClick={() => pickPeriod(option)}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <DateField value={from} placeholder="From" onChange={pickDate(setFrom)} />
                <span className="text-text-grey">-</span>
                <DateField value={to} placeholder="To" onChange={pickDate(setTo)} />
              </div>
            </div>

            <div className="grid gap-3">
              <Label className="text-text-grey text-label font-sans font-normal">LOCATION</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger
                  aria-label="Location"
                  className="bg-light_grey text-body-s h-10 w-full rounded-xl border-0 px-4"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="form-font">
                  {LOCATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-auto flex flex-row-reverse gap-3 pt-10 sm:flex-row">
            <button
              type="button"
              className="border-light-grey-50 text-black-light text-body-l h-12 w-full cursor-pointer rounded-xl border bg-white font-sans font-medium"
              onClick={reset}
            >
              Reset filter
            </button>
            <button
              type="button"
              className="bg-gradient-green text-body-l h-12 w-full cursor-pointer rounded-xl font-sans font-medium text-white disabled:opacity-70"
              disabled={filterEventsMutation.isPending}
              onClick={apply}
            >
              Apply filter
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default FilterEventModal;
