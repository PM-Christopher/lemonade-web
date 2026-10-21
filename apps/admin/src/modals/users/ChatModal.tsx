"use client";
import React from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { SupportChatPanel } from "@/components/support/SupportChatPanel";

interface ChatModalProps {
  isOpen: boolean;
  toggle: () => void;
  userId: string;
  userName?: string;
}

// The support thread between the admin team and one user, in a pop-up.
function ChatModal({ isOpen, toggle, userId, userName }: ChatModalProps) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Chat</DialogTitle>
        <div className="flex h-[80vh] max-h-170 w-150 max-w-[95vw] flex-col rounded-xl bg-white">
          <div className="flex items-center justify-between border-b p-4">
            <p className="text-body-l font-semibold">Chat{userName ? ` with ${userName}` : ""}</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </button>
          </div>
          <SupportChatPanel userId={userId} enabled={isOpen} />
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default ChatModal;
