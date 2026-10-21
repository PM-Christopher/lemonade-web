"use client";
import React, { useState } from "react";
import { PencilIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContentBare, DialogTitle, Input, Textarea } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useSavedRepliesQuery } from "@/features/support/queries";
import { useDeleteReplyMutation, useSaveReplyMutation } from "@/features/support/mutations";
import type { SavedReply } from "@/features/support/api";
import { errorMessage } from "@/lib/api-error";

// Mirrors the backend's SavedReplyRequest: a title up to 80 characters and a body up to 2000.
const replySchema = z.object({
  title: z.string().trim().min(1, "Give it a short title").max(80),
  body: z.string().trim().min(1, "Write the answer").max(2000),
});
type ReplyForm = z.infer<typeof replySchema>;

interface SavedRepliesModalProps {
  isOpen: boolean;
  toggle: () => void;
}

// Ready-made answers the whole support team can use in the inbox.
function SavedRepliesModal({ isOpen, toggle }: SavedRepliesModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSavedRepliesQuery({ enabled: isOpen });
  const saveMutation = useSaveReplyMutation();
  const deleteMutation = useDeleteReplyMutation();
  // null = not editing, "new" = adding, otherwise the id being edited.
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReplyForm>({
    resolver: zodResolver(replySchema),
    defaultValues: { title: "", body: "" },
  });

  const toast = (message: string, type: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type }));

  const start = (reply?: SavedReply) => {
    reset({ title: reply?.title ?? "", body: reply?.body ?? "" });
    setEditing(reply?.id ?? "new");
  };

  const onSubmit = (values: ReplyForm) =>
    saveMutation.mutate(
      { id: editing && editing !== "new" ? editing : undefined, ...values },
      {
        onSuccess: () => {
          toast("Saved reply stored", "success");
          setEditing(null);
        },
        onError: (error) => toast(errorMessage(error, "Couldn't save that reply."), "error"),
      },
    );

  const remove = (reply: SavedReply) =>
    deleteMutation.mutate(reply.id, {
      onSuccess: () => toast("Saved reply removed", "success"),
      onError: (error) => toast(errorMessage(error, "Couldn't remove that reply."), "error"),
    });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Saved replies</DialogTitle>
        <div className="flex max-h-[85vh] w-130 max-w-[95vw] flex-col rounded-xl bg-white">
          <div className="flex items-center justify-between border-b p-4">
            <p className="text-body-l font-semibold">Saved replies</p>
            <div className="flex items-center gap-3">
              {editing === null && (
                <button
                  type="button"
                  className="bg-gradient-green flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium text-white"
                  onClick={() => start()}
                >
                  <PlusIcon className="h-4 w-4" /> New reply
                </button>
              )}
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto p-4">
            {editing !== null && (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-light-grey flex flex-col gap-2 rounded-xl p-3"
              >
                <Input
                  aria-label="Title"
                  placeholder="Title, e.g. Payout times"
                  {...register("title")}
                />
                {errors.title && <p className="text-red-1 text-meta">{errors.title.message}</p>}
                <Textarea
                  aria-label="Reply text"
                  placeholder="What should the reply say?"
                  className="min-h-24 resize-none"
                  {...register("body")}
                />
                {errors.body && <p className="text-red-1 text-meta">{errors.body.message}</p>}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="cursor-pointer rounded-lg border px-3 py-1.5 text-sm"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveMutation.isPending}
                    className="bg-gradient-green cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium text-white disabled:opacity-60"
                  >
                    {saveMutation.isPending ? "Saving…" : "Save"}
                  </button>
                </div>
              </form>
            )}
            {(data?.replies ?? []).length === 0 && editing === null && (
              <p className="text-text-grey text-body-s py-6 text-center">
                No saved replies yet. Add the answers you send most often.
              </p>
            )}
            {data?.replies.map((reply) => (
              <div
                key={reply.id}
                className="border-grey-20 flex items-start gap-3 rounded-xl border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-body-s font-semibold">{reply.title}</p>
                  <p className="text-text-grey text-body-s line-clamp-3 whitespace-pre-wrap">
                    {reply.body}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`Edit ${reply.title}`}
                  className="cursor-pointer"
                  onClick={() => start(reply)}
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${reply.title}`}
                  className="text-red-1 cursor-pointer"
                  disabled={deleteMutation.isPending}
                  onClick={() => remove(reply)}
                >
                  <Trash2Icon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default SavedRepliesModal;
