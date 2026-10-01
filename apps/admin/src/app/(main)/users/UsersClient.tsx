"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { CalendarIcon, ChevronDown, SearchIcon, UploadIcon } from "lucide-react";
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
import useDebounce from "@/hooks/useDebounce";
import useSearchParams from "@/hooks/useSearchParams";

function UsersClient() {
  const statusOptions = ["Clear selection", "Active", "Inactive", "Suspended", "Deactivated"];
  const [menuOption, setMenuOption] = useState("users");
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setLoading] = useState(false);
  const exportCsv = useExportCsvMutation();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { searchParams, setSearchParams } = useSearchParams();
  const query = searchParams?.get("q");
  const statusParam = searchParams?.get("status");
  // Search/status filter active -> fetch the old unpaginated shape so
  // client-side filtering (in UsersViews) still sees every user, not just
  // the current page. See docs/ARCHITECTURE.md §22 Conflict 1.
  const isFiltering = Boolean(query?.trim()) || Boolean(statusParam?.trim());
  const page =
    menuOption === "users" && !isFiltering ? Number(searchParams?.get("page") ?? 1) : undefined;

  const { data: userData } = useUserListQuery(menuOption, {
    enabled: isLoggedIn,
    page,
    perPage: 10,
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

  const { debouncedValue } = useDebounce(searchValue, 500);
  useEffect(() => {
    // Reset to page 1 on a new search — same "reset pagination on search"
    // behavior this used to do with local currentPage state.
    setSearchParams({ q: debouncedValue, page: undefined });
    // setSearchParams's identity changes on every navigation (it depends on
    // useSearchParams()'s live searchParams — see hooks/useSearchParams.ts),
    // so including it here would re-run this effect after every push and
    // push again, in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (!["", "status"].includes(status)) {
      if (status === "clear selection") {
        setSearchParams({ status: "", page: undefined });
      } else {
        setSearchParams({ status, page: undefined });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <MainLayout>
      <section className="mt-5 flex flex-col gap-5">
        <div className={"flex justify-between px-5"}>
          <p className={"font-semiBold text-[16px]"}>
            {(userData && "users" in userData ? userData.users.length : 0) || 0} users
          </p>
          <div className={"flex justify-between gap-3"}>
            <div className="bg-light_grey border-grey-20 flex h-10 w-[285px] items-center gap-3 rounded-xl border p-2 px-3">
              <div>
                <SearchIcon className={"text-grey-40 h-3 w-3"} />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="bg-light-grey w-full rounded-xl py-4 text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                  placeholder="Search user, email, ID, location..."
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            {menuOption === "users" && (
              <Select onValueChange={(value) => setStatus(value)}>
                <SelectTrigger
                  aria-label="Filter by status"
                  className="font-semiBold text-text-grey focus:!border-light-green-50 h-10 w-[193px] rounded-xl text-[12px]"
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
            <div
              className={
                "border-grey-20 flex h-10 w-[193px] items-center justify-between rounded-xl border bg-none px-4 py-2.5"
              }
            >
              <div className={"flex items-center gap-2"}>
                <CalendarIcon className={"text-text-grey h-[15px] w-[15px]"} />
                <p className={"font-semiBold text-text-grey text-[12px]"}>ALL TIME</p>
              </div>
              <ChevronDown className={"text-text-grey w-5"} />
            </div>
            <div>
              <Button
                onClick={exportUser}
                className={"border-step-color bg-gradient-green flex h-10 rounded-xl"}
              >
                <UploadIcon className={"h-[15px] w-[15px] text-white"} />
                <p className={"text-[16px] font-medium text-white"}>
                  {isLoading ? "Exporting..." : "Export"}
                </p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-5"}>
          <div className={"border-grey-20 flex flex-col rounded-xl border"}>
            <div className={"w-fit px-3 pt-2"}>
              <div className={"bg-mid-grey flex items-center gap-6 rounded-xl p-1"}>
                {usersPageViews.map((item, index) => (
                  <div
                    className={`cursor-pointer p-1 px-2 ${
                      menuOption === item.key && "rounded-[10px] bg-white"
                    }`}
                    onClick={() => switchOption(item.key)}
                    key={index}
                  >
                    <p
                      className={`font-sans leading-[24px] ${
                        menuOption === item.key
                          ? "text-[16px] font-semibold"
                          : "font-semi-normal text-text-grey text-[16px]"
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
    </MainLayout>
  );
}

export default UsersClient;
