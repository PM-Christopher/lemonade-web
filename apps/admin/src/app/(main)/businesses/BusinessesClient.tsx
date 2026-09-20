"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import MainLayout from "@/components/layouts/MainLayout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import { useBusinessListQuery } from "@/features/businesses/queries";
import type { AdminBusiness } from "@/features/businesses/api";
import { capitalizeWords, GetStatusClass } from "@/utils/helper";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
  { value: "inactive", label: "Inactive" },
];

const TABLE_HEADERS = ["Name", "Location", "Owner", "Date submitted", "Status"];

function searchableFields(business: AdminBusiness): string[] {
  return [business.name, business.city, business.country, business.email, business.owner?.name].filter(
    (value): value is string => Boolean(value),
  );
}

function BusinessesClient() {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [status, setStatus] = useState("pending");
  const [searchValue, setSearchValue] = useState("");

  const { data, isLoading } = useBusinessListQuery(status, { enabled: isLoggedIn });

  const businesses = useMemo(() => {
    const all = data?.businesses ?? [];
    const q = searchValue.trim().toLowerCase();
    if (!q) return all;
    return all.filter((business) => searchableFields(business).some((value) => value.toLowerCase().includes(q)));
  }, [data, searchValue]);

  return (
    <MainLayout>
      <section className="mt-[24px] flex flex-col gap-[20px]">
        <div className={"flex justify-between px-[20px]"}>
          <p className={"text-[16px] font-semiBold"}>{businesses.length} Businesses</p>
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
                  placeholder="Search business, city, owner..."
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger
                aria-label="Filter by status"
                className="h-[40px] w-[193px] rounded-[12px] text-[12px] font-semiBold text-text-grey focus:!border-light-green-50"
              >
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className={"flex flex-col px-[20px]"}>
          <div className={"flex flex-col rounded-[12px] border-[1px] border-grey-20"}>
            <div className="rounded-lg bg-white shadow-md">
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-mid-grey">
                    {TABLE_HEADERS.map((header) => (
                      <th className="p-4 text-left text-[12px] font-semiBold text-text-grey" key={header}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {businesses.length > 0 ? (
                    businesses.map((business) => (
                      <tr
                        key={business.id}
                        className="h-[72px] cursor-pointer border-b border-grey-20"
                        onClick={() => router.push(`/businesses/${business.id}`)}
                      >
                        <td className={"p-4 font-sans text-sm font-medium"}>{business.name}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>
                          {[business.city, business.country].filter(Boolean).join(", ") || "N/A"}
                        </td>
                        <td className={"p-4 font-sans text-sm font-medium"}>{business.owner?.name ?? "N/A"}</td>
                        <td className={"p-4 font-sans text-sm font-medium"}>{business.date_submitted}</td>
                        <td
                          className={`p-4 font-sans text-sm font-medium ${GetStatusClass(capitalizeWords(business.status))}`}
                        >
                          {capitalizeWords(business.status)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={TABLE_HEADERS.length} className="p-4 text-center text-sm text-gray-500">
                        {isLoading ? "Loading..." : "No data available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default BusinessesClient;
