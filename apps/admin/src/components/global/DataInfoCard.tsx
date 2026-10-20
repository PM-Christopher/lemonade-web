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
    <div className={`shadow-card-shadow flex justify-between rounded-xl bg-white p-4 ${styles}`}>
      <div className={"flex flex-col gap-4"}>
        <div className={"bg-mid-grey w-fit rounded-xl p-2"}>
          <FileIcon className={"h-4.25 w-3.5"} />
        </div>
        <p className="text-body-l font-medium">{title}</p>
        {isEditable && (
          <button
            type="button"
            className="text-light-green text-body-s cursor-pointer text-left font-medium"
            onClick={handleChange}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default DataInfoCard;
