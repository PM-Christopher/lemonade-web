import React from "react";
import { FileIcon } from "lucide-react";

function DataInfoCard({
  styles,
  title,
  isEditable = false,
  handleChange,
}: {
  styles?: string;
  title: string;
  isEditable?: boolean;
  handleChange?: () => void;
}) {
  return (
    <div
      className={`shadow-card-shadow flex justify-between rounded-[12px] bg-white p-4 ${styles}`}
    >
      <div className={"flex flex-col gap-[16px]"}>
        <div className={"w-fit rounded-[13px] bg-mid-grey p-[8px]"}>
          <FileIcon className={"h-[17px] w-[14px]"} />
        </div>
        <p className="text-[16px] font-medium">{title}</p>
        {isEditable && <p className="text-[14px] font-medium text-light-green">Edit</p>}
      </div>
    </div>
  );
}

export default DataInfoCard;
