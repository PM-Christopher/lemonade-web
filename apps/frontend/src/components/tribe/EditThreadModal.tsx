"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Dialog, DialogContentBare, DialogTitle, Input, Textarea } from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";
import { useEditThreadMutation } from "@/features/tribes/mutations";
import { editThreadSchema, type EditThreadInput } from "@/features/tribes/schema";

interface EditThreadModalProps {
  isOpen: boolean;
  toggle: () => void;
  tribeSlug: string;
  threadId: string;
  topic: string;
  thoughts: string;
}

// Lets the author change a thread's title and content.
const EditThreadModal: React.FC<EditThreadModalProps> = ({
  isOpen,
  toggle,
  tribeSlug,
  threadId,
  topic,
  thoughts,
}) => {
  const dispatch = useAppDispatch();
  const editMutation = useEditThreadMutation(tribeSlug);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditThreadInput>({
    resolver: zodResolver(editThreadSchema),
    values: { topic, thoughts },
  });

  const onSubmit = (data: EditThreadInput) =>
    editMutation.mutate(
      { id: threadId, data },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({ show: true, message: "Thread updated", type: "success" }),
          );
          toggle();
        },
        onError: (error) =>
          dispatch(
            updateToastifyReducer({
              show: true,
              message: errorMessage(error, "Could not update thread"),
              type: "error",
            }),
          ),
      },
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Edit thread</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-120 max-w-[94vw] rounded-lg bg-white p-4 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <p className="text-body-xl font-sans font-semibold">Edit thread</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Input
              aria-label="Topic"
              placeholder="Topic"
              className="bg-light_grey h-12 rounded-xl border-0"
              {...register("topic")}
            />
            {errors.topic && (
              <p className="text-red-1 text-meta leading-normal">{errors.topic.message}</p>
            )}
            <Textarea
              aria-label="Thoughts"
              placeholder="Share your thoughts..."
              className="bg-light_grey min-h-40 resize-none rounded-xl border-0"
              {...register("thoughts")}
            />
            {errors.thoughts && (
              <p className="text-red-1 text-meta leading-normal">{errors.thoughts.message}</p>
            )}
            <Button
              type="submit"
              loading={editMutation.isPending}
              className="bg-gradient-green hover:bg-gradient-green h-11 w-full rounded-xl border-none shadow-none"
            >
              <p className="font-semi-normal text-body-l">Save changes</p>
            </Button>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default EditThreadModal;
