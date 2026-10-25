"use client";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import React, { useEffect, useState } from "react";
import { UploadIcon } from "lucide-react";
import DateRangePicker, { toApiTime, type DateRange } from "@/components/global/DateRangePicker";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@lemonade/ui";
import { usersPageViews } from "@/utils/pageViews";
import UsersViews from "@/views/users/UsersView";
import AffiliateView from "@/views/users/AffiliateView";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useUserListQuery } from "@/features/user/queries";
import { useExportCsvMutation } from "@/features/exports/mutations";
import { downloadCSV } from "@/utils/helper";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { SearchBox } from "@/components/global/SearchBox";
import { useSearchTerm } from "@/hooks/useSearchTerm";
import useSearchParams from "@/hooks/useSearchParams";

function UsersClient() {
  const statusOptions = ["Clear selection", "Active", "Suspended", "Deactivated"];
  const [menuOption, setMenuOption] = useState("users");
  const { value: searchValue, setValue: setSearchValue, term } = useSearchTerm();
  const [status, setStatus] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setLoading] = useState(false);
  const exportCsv = useExportCsvMutation();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { searchParams, setSearchParams } = useSearchParams();
  const statusParam = searchParams?.get("status");
  // Search/status filter active -> fetch the old unpaginated shape so
  // client-side filtering (in UsersViews) still sees every user, not just
  // the current page. See docs/ARCHITECTURE.md §22 Conflict 1.
  const [range, setRange] = useState<DateRange | null>(null);
  const isFiltering = Boolean(statusParam?.trim());
  const page =
    menuOption === "users" && !isFiltering ? Number(searchParams?.get("page") ?? 1) : undefined;

  const { data: userData } = useUserListQuery(menuOption, {
    enabled: isLoggedIn,
    page,
    perPage: DEFAULT_PAGE_SIZE,
    search: term,
    dates: range
      ? { start_date: toApiTime(range.start), end_date: toApiTime(range.end) }
      : undefined,
  });

  const handlePageChange = (nextPage: number) => {
    setSearchParams({ page: String(nextPage) });
  };

  const switchOption = (option: string) => {
    setMenuOption(option);
  };

  const renderViews = () => {
    switch (menuOption) {
      case "users":
        return (
          <UsersViews
            userData={userData}
            menuOption={menuOption}
            page={page ?? 1}
            onPageChange={handlePageChange}
          />
        );
      case "affiliates":
        return <AffiliateView userData={userData} menuOption={menuOption} />;
    }
  };

  const exportUser = () => {
    setLoading(true);
    const table = menuOption === "users" ? "users" : "affiliates";
    exportCsv.mutate(table, {
      onSuccess: (csv) => {
        setLoading(false);
        downloadCSV(csv, `${table}.csv`);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `Downloaded `,
            type: "success",
          }),
        );
      },
      onError: (error) => {
        setLoading(false);
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || `Something went wrong`,
            type: "error",
          }),
        );
      },
    });
  };

  // A new search starts again from page 1.
  useEffect(() => {
    setSearchParams({ page: undefined });
  }, [term, setSearchParams]);

  useEffect(() => {
    if (!["", "status"].includes(status)) {
      if (status === "clear selection") {
        setSearchParams({ status: "", page: undefined });
      } else {
        setSearchParams({ status, page: undefined });
      }
    }
  }, [status, setSearchParams]);

  return (
    <section className="mt-6 flex flex-col gap-5">
      <div className={"flex justify-between px-5"}>
        <p className={"font-semiBold text-body-l"}>
          {(userData && "users" in userData ? userData.users.length : 0) || 0} users
        </p>
        <div className={"flex justify-between gap-3"}>
          <SearchBox
            value={searchValue}
            onChange={setSearchValue}
            label="Search users"
            placeholder="Search user, email, ID, location..."
          />
          {menuOption === "users" && (
            <Select onValueChange={(value) => setStatus(value)}>
              <SelectTrigger
                aria-label="Filter by status"
                className="font-semiBold text-text-grey focus:!border-light-green-50 text-meta h-10 w-48.25 rounded-xl leading-normal"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <DateRangePicker value={range} onChange={setRange} />
          <div>
            <Button
              onClick={exportUser}
              className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}
            >
              <UploadIcon className={"h-3.75 w-3.75 text-white"} />
              <p className={"text-body-l font-medium text-white"}>
                {isLoading ? "Exporting..." : "Export"}
              </p>
            </Button>
          </div>
        </div>
      </div>
      <div className={"flex flex-col px-5"}>
        <div className={"border-grey-20 flex flex-col rounded-xl border"}>
          <div className={"w-fit max-w-full overflow-x-auto px-3 pt-2"}>
            <div className={"bg-mid-grey flex items-center gap-6 rounded-xl p-1"}>
              {usersPageViews.map((item, index) => (
                <div
                  className={`shrink-0 cursor-pointer p-1 px-2 ${
                    menuOption === item.key && "rounded-lg bg-white"
                  }`}
                  onClick={() => switchOption(item.key)}
                  key={index}
                >
                  <p
                    className={`font-sans leading-6 whitespace-nowrap ${
                      menuOption === item.key
                        ? "text-body-l font-semibold"
                        : "font-semi-normal text-text-grey text-body-l"
                    }`}
                  >
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
          {renderViews()}
        </div>
      </div>
    </section>
  );
}

export default UsersClient;
