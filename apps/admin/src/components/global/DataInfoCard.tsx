import React from "react";
import { FileIcon } from "lucide-react";

function DataInfoCard({
  styles,
  title,
  isEditable = false,
}: {
  styles?: string;
  title: string;
  isEditable?: boolean;
  handleChange?: () => void;
}) {
  return (
    <div className={`shadow-card-shadow flex justify-between rounded-xl bg-white p-4 ${styles}`}>
      <div className={"flex flex-col gap-4"}>
        <div className={"bg-mid-grey w-fit rounded-[13px] p-2"}>
          <FileIcon className={"h-[17px] w-3.5"} />
        </div>
        <p className="text-[16px] font-medium">{title}</p>
        {isEditable && <p className="text-light-green text-[14px] font-medium">Edit</p>}
      </div>
    </div>
  );
}

export default DataInfoCard;
