import React from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useDeleteThreadMutation } from "@/features/tribes/mutations";

interface DeleteThreadIF {
  toggle: () => void;
  isOpen: boolean;
  threadId: number | null;
  setThreadId: (threadId: number | null) => void;
  tribeId: string;
}

const DeleteThreadModal: React.FC<DeleteThreadIF> = ({
  isOpen,
  threadId,
  toggle,
  setThreadId,
  tribeId,
}) => {
  const dispatch = useAppDispatch();
  const deleteThreadMutation = useDeleteThreadMutation(tribeId);

  const handleDeleteThread = () => {
    if (threadId !== null) {
      deleteThreadMutation.mutate(threadId);
    }
    dispatch(
      updateToastifyReducer({
        show: true,
        message: "Thread deleted.",
        type: "success",
      }),
    );
    setThreadId(null);
    toggle();
  };

  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[380px] rounded-lg bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="font-sans text-[18px] font-semibold leading-[27px]">Delete thread</p>
          </div>
          <div className="cursor-pointer" onClick={toggle}>
            <CloseIcon />
          </div>
        </div>
        <div className="mt-[24px] flex flex-col gap-[16px]">
          <p className="text-[14px] font-normal text-light-black">
            Are you sure you want to delete this thread?
          </p>

          <div className="flex gap-[12px]">
            <Button
              className="h-[44px] w-full rounded-[12px] border-[1px] bg-white py-[14px] shadow-none hover:bg-white"
              onClick={handleDeleteThread}
            >
              <p className="text-[16px] font-semi-normal text-red-1">Yes, delete</p>
            </Button>
            <Button
              className="h-[44px] w-full rounded-[12px] border-none bg-transparent bg-gradient-green shadow-none"
              onClick={toggle}
            >
              <p className="text-[16px] font-semi-normal">No, don&apos;t delete</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteThreadModal;
