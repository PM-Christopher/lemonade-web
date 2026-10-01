"use client";
import React from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  return (
    <div className={`shadow-card-shadow flex justify-between rounded-xl bg-white p-4 ${styles}`}>
      <div className={"flex flex-col gap-4"}>
        <p className="text-text-grey text-[14px] font-normal">{title}</p>
        <p className="font-semiBold text-[24px]">
          {isPrice && "₦"}
          {Number(count)?.toLocaleString()}
          {isPercentage && "%"}
        </p>
      </div>
      {isEditable && (
        <p
          className={"text-light-green cursor-pointer text-[14px] font-medium"}
          onClick={handleChange}
        >
          Edit
        </p>
      )}
      {isLink && pageLink && (
        <p
          className={"text-light-green cursor-pointer text-[14px] font-medium"}
          onClick={() => router.push(pageLink)}
        >
          View
        </p>
      )}
    </div>
  );
}

export default DataCard;
