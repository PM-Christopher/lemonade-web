import React from "react";
import { XIcon } from "lucide-react";
import dayjs from "dayjs";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useModerationContentItemQuery } from "@/features/moderation/queries";
import type { ModerationContentType } from "@/features/moderation/api";
import { capitalizeWords } from "@/utils/helper";

interface ViewContentModalProps {
  isOpen: boolean;
  toggle: () => void;
  type: ModerationContentType;
  id?: string | number;
}

function ViewContentModal({ isOpen, toggle, type, id }: ViewContentModalProps) {
  const { data, isLoading } = useModerationContentItemQuery(type, isOpen ? id : undefined);
  const item = data?.content;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Content details</DialogTitle>
        <div className="max-h-[80vh] w-120 max-w-full overflow-y-auto rounded-xl bg-white pt-4 pb-4">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">
                {item?.type_label ?? "Content"} details
              </p>
              <button type="button" aria-label="Close" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            {isLoading || !item ? (
              <p className={"text-text-grey text-body-s"}>Loading…</p>
            ) : (
              <>
                {item.title ? <p className={"font-semiBold text-body-l"}>{item.title}</p> : null}
                <p className={"text-body-s font-normal whitespace-pre-wrap"}>{item.body ?? "—"}</p>
                <div className={"text-text-grey text-meta flex flex-col gap-1"}>
                  <p>By {item.author?.name ?? "—"}</p>
                  <p>{dayjs(item.created_at).format("DD MMM, YYYY hh:mmA")}</p>
                  <p>{item.deleted_at ? "Removed" : capitalizeWords(item.status ?? "active")}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default ViewContentModal;
