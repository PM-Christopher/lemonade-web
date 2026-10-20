"use client";
import { useNavigation } from "@/hooks/useNavigation";
import React from "react";

function DataCard({
  styles,
  title,
  count,
  isPrice = false,
  isEditable = false,
  isPercentage = false,
  isLink = false,
  pageLink = "",
  handleChange,
}: {
  styles?: string;
  title: string;
  count: number | string;
  isPrice?: boolean;
  isPercentage?: boolean;
  isEditable?: boolean;
  isLink?: boolean;
  pageLink?: string;
  handleChange?: () => void;
}) {
  const { push } = useNavigation();
  return (
    <div className={`shadow-card-shadow flex justify-between rounded-xl bg-white p-4 ${styles}`}>
      <div className={"flex flex-col gap-4"}>
        <p className="text-text-grey text-body-s font-normal">{title}</p>
        <p className="font-semiBold text-title-l leading-normal">
          {isPrice && "₦"}
          {Number(count)?.toLocaleString("en-US", {
            minimumFractionDigits: Number.isInteger(Number(count)) ? 0 : 2,
            maximumFractionDigits: 2,
          })}
          {isPercentage && "%"}
        </p>
      </div>
      {isEditable && (
        <p
          className={"text-light-green text-body-s cursor-pointer font-medium"}
          onClick={handleChange}
        >
          Edit
        </p>
      )}
      {isLink && pageLink && (
        <p
          className={"text-light-green text-body-s cursor-pointer font-medium"}
          onClick={() => push(pageLink)}
        >
          View
        </p>
      )}
    </div>
  );
}

export default DataCard;
