"use client";
import React from "react";
import { centerNumericColumns } from "@/utils/tableAlign";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigation } from "@/hooks/useNavigation";
import { routes } from "@/lib/routes";
import { AvatarName } from "@/components/global/AvatarName";
import { useServiceListQuery } from "@/features/businesses/queries";
import type { BusinessFilters } from "@/features/businesses/api";
import { naira } from "@/views/transactions/transactionFormat";
import { Chips } from "./BusinessListView";
import { serviceStatusClass } from "./businessFormat";

const HEADERS = [
  "SERVICE ID",
  "BUSINESS NAME",
  "CLIENT NAME",
  "AMOUNT",
  "SERVICES",
  "START DATE",
  "STATUS",
];

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 rounded-xl bg-white p-5">
      <p className="text-text-grey text-body-s font-normal">{label}</p>
      <p className="text-body-xl mt-2 font-semibold">{value}</p>
    </div>
  );
}

// Paid service jobs across all businesses, with the escrow totals above them.
export function ServiceListView({ filters }: { filters: BusinessFilters }) {
  const { push } = useNavigation();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useServiceListQuery(filters, { enabled: isLoggedIn });
  const services = data?.services ?? [];

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex flex-wrap gap-3">
        <Card label="Amount in escrow" value={naira(data?.amount_in_escrow)} />
        <Card label="Services in progress" value={data?.services_in_progress ?? 0} />
        <Card label="Services completed" value={data?.services_completed ?? 0} />
        <Card label="Services in dispute" value={data?.services_in_dispute ?? 0} />
      </div>
      <div className="rounded-lg bg-white shadow-md">
        <table className={`min-w-full table-auto border-collapse ${centerNumericColumns(HEADERS)}`}>
          <thead>
            <tr className="bg-mid-grey">
              {HEADERS.map((header) => (
                <th
                  key={header}
                  className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((service) => (
                <tr
                  key={service.id}
                  className="border-grey-20 h-18 cursor-pointer border-b"
                  onClick={() => push(routes.SERVICE_DETAIL(service.id))}
                >
                  <td className="p-4 font-sans text-sm font-medium">{service.unique_id}</td>
                  <td className="p-4 font-sans text-sm font-medium">
                    <AvatarName name={service.business?.name} image={service.business?.image} />
                  </td>
                  <td className="p-4 font-sans text-sm font-medium">
                    {service.client?.name ?? "N/A"}
                  </td>
                  <td className="p-4 font-sans text-sm font-medium">{naira(service.amount)}</td>
                  <td className="p-4 font-sans text-sm font-medium">
                    <Chips items={service.services} />
                  </td>
                  <td className="p-4 font-sans text-sm font-medium">
                    {dayjs(service.start_date).format("DD MMM, YYYY hh:mm A")}
                  </td>
                  <td
                    className={`p-4 font-sans text-sm font-medium ${serviceStatusClass(service.status)}`}
                  >
                    {service.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={HEADERS.length} className="p-4 text-center text-sm text-gray-500">
                  {isLoading ? "Loading..." : "No data available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
