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
  toggle,
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
  toggle?: () => void;
}) {
  const router = useRouter();
  return (
    <div
      className={`shadow-card-shadow flex justify-between rounded-[12px] bg-white p-4 ${styles}`}
    >
      <div className={"flex flex-col gap-[16px]"}>
        <p className="text-[14px] font-normal text-text-grey">{title}</p>
        <p className="text-[24px] font-semiBold">
          {isPrice && "₦"}
          {Number(count)?.toLocaleString()}
          {isPercentage && "%"}
        </p>
      </div>
      {isEditable && (
        <p
          className={"cursor-pointer text-[14px] font-medium text-light-green"}
          onClick={handleChange}
        >
          Edit
        </p>
      )}
      {isLink && pageLink && (
        <p
          className={"cursor-pointer text-[14px] font-medium text-light-green"}
          onClick={() => router.push(pageLink)}
        >
          View
        </p>
      )}
    </div>
  );
}

export default DataCard;
