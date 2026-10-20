import React from "react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { X } from "lucide-react";
import TribeDetailsCard from "@/components/tribe/TribeDetailsCard";

type TribeDetailsSheetProps = {
  isOpen: boolean;
  onClose: () => void;
} & React.ComponentProps<typeof TribeDetailsCard>;

// Phone version of the tribe details panel: a bottom sheet over the thread list.
const TribeDetailsSheet: React.FC<TribeDetailsSheetProps> = ({ isOpen, onClose, ...card }) => (
  <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContentBare className="fixed top-auto bottom-0 left-0 max-h-[90vh] w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-t-2xl rounded-b-none border-0 bg-white p-0 shadow-none">
      <DialogTitle className="sr-only">Tribe details</DialogTitle>
      <button
        type="button"
        aria-label="Close"
        className="absolute top-4 right-4 z-10 cursor-pointer"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>
      <TribeDetailsCard {...card} className="rounded-none" />
    </DialogContentBare>
  </Dialog>
);

export default TribeDetailsSheet;
