"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import {
  CalendarIcon,
  ChevronDown,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Select } from "antd";

function UsersClient() {
  const statusOptions = [
    "Clear selection",
    "Active",
    "Inactive",
    "Suspended",
    "Deactivated",
  ];
  const [menuOption, setMenuOption] = useState("users");
  const [searchValue, setSearchValue] = useState("");
  const [status, setStatus] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setLoading] = useState(false);
  const exportCsv = useExportCsvMutation();

  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: userData } = useUserListQuery(menuOption, {
    enabled: isLoggedIn,
  });

  const switchOption = (option: string) => {
    setMenuOption(option);
  };

  const renderViews = () => {
    switch (menuOption) {
      case "users":
        return <UsersViews userData={userData} menuOption={menuOption} />;
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
  const { setSearchParams } = useSearchParams();
  useEffect(() => {
    setSearchParams({ q: debouncedValue });
    // setSearchParams's identity changes on every navigation (it depends on
    // useSearchParams()'s live searchParams — see hooks/useSearchParams.ts),
    // so including it here would re-run this effect after every push and
    // push again, in a loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  useEffect(() => {
    if (!["", "status"].includes(status)) {
      if (status === "clear selection") {
        setSearchParams({ status: "" });
      } else {
        setSearchParams({ status });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <MainLayout>
      <section className="mt-[20px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"text-[16px] font-semiBold"}>
            {(userData && "users" in userData ? userData.users.length : 0) || 0}{" "}
            users
          </p>
          <div className={"flex justify-between gap-[12px]"}>
            <div className="bg-light_grey flex h-[40px] w-[285px] items-center gap-3 rounded-[12px] border-[1px] border-grey-20 p-2 px-[12px]">
              <div>
                <SearchIcon className={"h-[12px] w-[12px] text-grey-40"} />
              </div>
              <div className="w-full">
                <input
                  id="search"
                  type="text"
                  className="w-full rounded-xl bg-light-grey py-4 text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
                  placeholder="Search user, email, ID, location..."
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            {menuOption === "users" && (
              <Select
                suffixIcon={<ChevronDown className="w-[20px] text-text-grey" />}
                defaultValue="Status"
                className="h-[40px] w-[193px] rounded-[12px] text-[12px] font-semiBold text-text-grey focus:!border-light-green-50"
                options={statusOptions.map((status) => ({
                  label: status,
                  value: status.toLowerCase(),
                }))}
                onChange={(value) => {
                  setStatus(value);
                }}
              />
            )}
            <div
              className={
                "flex h-[40px] w-[193px] items-center justify-between rounded-[12px] border-[1px] border-grey-20 bg-none px-[16px] py-[10px]"
              }
            >
              <div className={"flex items-center gap-2"}>
                <CalendarIcon className={"h-[15px] w-[15px] text-text-grey"} />
                <p className={"text-[12px] font-semiBold text-text-grey"}>
                  ALL TIME
                </p>
              </div>
              <ChevronDown className={"w-[20px] text-text-grey"} />
            </div>
            <div>
              <Button
                onClick={exportUser}
                className={
                  "flex h-[40px] rounded-[12px] border-step-color bg-gradient-green"
                }
              >
                <UploadIcon className={"h-[15px] w-[15px] text-white"} />
                <p className={"text-[16px] font-medium text-white"}>
                  {isLoading ? "Exporting..." : "Export"}
                </p>
              </Button>
            </div>
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div
            className={
              "flex flex-col rounded-[12px] border-[1px] border-grey-20"
            }
          >
            <div className={"w-fit px-[12px] pt-[8px]"}>
              <div
                className={
                  "flex items-center gap-6 rounded-[12px] bg-mid-grey p-[4px]"
                }
              >
                {usersPageViews.map((item, index) => (
                  <div
                    className={`cursor-pointer p-[4px] px-[8px] ${
                      menuOption === item.key && "rounded-[10px] bg-white"
                    }`}
                    onClick={() => switchOption(item.key)}
                    key={index}
                  >
                    <p
                      className={`font-sans leading-[24px] ${
                        menuOption === item.key
                          ? "text-[16px] font-semibold"
                          : "font-semi-normal text-[16px] text-text-grey"
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
