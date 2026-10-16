"use client";
import { useState } from "react";
import MoreIcon from "@/images/icons/moreIcon.svg";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button, Dialog, DialogContent, DialogDescription, DialogTitle } from "@lemonade/ui";
import {
  useBlockUserMutation,
  useClearChatMutation,
  useEndChatMutation,
  useUnblockUserMutation,
} from "@/features/connect/mutations";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";

type ConfirmAction = "block" | "clear" | "end";

const CONFIRM_COPY: Record<ConfirmAction, { title: string; body: string; button: string }> = {
  block: {
    title: "Block this user?",
    body: "Neither of you will be able to send messages until you unblock them.",
    button: "Block",
  },
  clear: {
    title: "Delete this chat?",
    body: "Your messages in this chat are removed for you only. The other person keeps theirs.",
    button: "Delete chat",
  },
  end: {
    title: "End this chat?",
    body: "The connection closes for both of you. You can send a new request later.",
    button: "End chat",
  },
};

interface ChatOptionsMenuProps {
  receiverId: string | undefined;
  isBlockedByMe: boolean;
  onViewDetails: () => void;
  onChatEnded: () => void;
}

// The three-dot menu in the chat header.
export const ChatOptionsMenu = ({
  receiverId,
  isBlockedByMe,
  onViewDetails,
  onChatEnded,
}: ChatOptionsMenuProps) => {
  const dispatch = useAppDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirming, setConfirming] = useState<ConfirmAction | null>(null);
  const block = useBlockUserMutation();
  const unblock = useUnblockUserMutation();
  const clear = useClearChatMutation();
  const end = useEndChatMutation();

  const notify = (message: string, type: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type }));

  const run = (
    mutation: typeof block,
    successMessage: string,
    { closeChat = false }: { closeChat?: boolean } = {},
  ) => {
    if (!receiverId) return;
    mutation.mutate(receiverId, {
      onSuccess: () => {
        notify(successMessage, "success");
        setConfirming(null);
        if (closeChat) onChatEnded();
      },
      onError: (error) => notify(errorMessage(error, "Something went wrong"), "error"),
    });
  };

  const confirm = () => {
    if (confirming === "block") run(block, "User blocked");
    if (confirming === "clear") run(clear, "Chat deleted");
    if (confirming === "end") run(end, "Chat ended", { closeChat: true });
  };

  const isBusy = block.isPending || clear.isPending || end.isPending;
  const itemClass = "w-full rounded-md px-3 py-2 text-left text-body-s hover:bg-gray-100";

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button type="button" aria-label="Chat options" className="rounded-full p-2">
            <MoreIcon className="cursor-pointer" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 border-0 p-1 shadow-lg">
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              setMenuOpen(false);
              onViewDetails();
            }}
          >
            View user details
          </button>
          {isBlockedByMe ? (
            <button
              type="button"
              className={itemClass}
              onClick={() => {
                setMenuOpen(false);
                run(unblock, "User unblocked");
              }}
            >
              Unblock user
            </button>
          ) : (
            <button
              type="button"
              className={itemClass}
              onClick={() => {
                setMenuOpen(false);
                setConfirming("block");
              }}
            >
              Block user
            </button>
          )}
          <button
            type="button"
            className={itemClass}
            onClick={() => {
              setMenuOpen(false);
              setConfirming("clear");
            }}
          >
            Delete chat
          </button>
          <button
            type="button"
            className={`${itemClass} text-red-600`}
            onClick={() => {
              setMenuOpen(false);
              setConfirming("end");
            }}
          >
            End chat
          </button>
        </PopoverContent>
      </Popover>

      <Dialog open={confirming !== null} onOpenChange={(open) => !open && setConfirming(null)}>
        <DialogContent className="max-w-sm border-0">
          {confirming && (
            <>
              <DialogTitle>{CONFIRM_COPY[confirming].title}</DialogTitle>
              <DialogDescription>{CONFIRM_COPY[confirming].body}</DialogDescription>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setConfirming(null)} disabled={isBusy}>
                  Cancel
                </Button>
                <Button onClick={confirm} disabled={isBusy}>
                  {CONFIRM_COPY[confirming].button}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
