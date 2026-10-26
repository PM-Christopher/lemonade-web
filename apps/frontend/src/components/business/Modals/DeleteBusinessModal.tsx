"use client";
import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

type DeleteBusinessInterface = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
};

const DeleteBusinessModal: React.FC<DeleteBusinessInterface> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => (
  <Dialog
    open={isOpen}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
      <div className="w-90 max-w-[90vw] rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <DialogTitle className="tracking-custom text-body-l font-sans font-semibold">
            Delete business
          </DialogTitle>
          <button type="button" aria-label="Close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
        <p className="text-body-s mt-4 font-normal">
          Are you sure you want to delete your business? It will no longer show in listings. Jobs in
          progress must be finished first.
        </p>
        <div className="mt-6 flex gap-2">
          <Button
            variant="outline"
            className="h-12 w-full rounded-xl border border-gray-300 bg-white font-semibold text-red-600"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Yes, delete"}
          </Button>
          <Button
            className="bg-gradient-green h-12 w-full rounded-xl font-semibold"
            onClick={onClose}
            disabled={loading}
          >
            No, don&apos;t delete
          </Button>
        </div>
      </div>
    </DialogContentBare>
  </Dialog>
);

export default DeleteBusinessModal;
