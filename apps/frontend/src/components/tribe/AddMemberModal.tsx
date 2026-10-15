import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Label, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { PlusIcon, XIcon } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { useAddTribeMemberMutation } from "@/features/tribes/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";

interface AddMemberIF {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

const AddMemberModal: React.FC<AddMemberIF> = ({ isOpen, toggle, id }) => {
  // State to hold the input value
  const [inputValue, setInputValue] = useState("");
  // State to hold the list of usernames
  const [usernames, setUsernames] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const addTribeMemberMutation = useAddTribeMemberMutation(id);

  // Adds the current input value to the usernames array
  const handleAddUsername = () => {
    const trimmedValue = inputValue.trim();
    if (!trimmedValue) return;
    setUsernames((prev) => [...prev, trimmedValue]);
    setInputValue("");
  };

  // Removes a username from the array by its index
  const handleRemoveUsername = (index: number) => {
    setUsernames((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddTribeMember = () => {
    addTribeMemberMutation.mutate(
      { usernames },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage("Member added successfully."),
              type: "success",
            }),
          );
          toggle();
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error adding member to tribe.",
              type: "error",
            }),
          );
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Add member</DialogTitle>
        <div className="w-160 rounded-lg bg-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
              <p className="text-body-xl font-sans font-semibold">Add member</p>
            </div>
            <div>
              <Button
                className="auth-button border-step-color shadow-custom-bottom rounded-xl p-2.5 px-3.5"
                onClick={handleAddTribeMember}
                loading={addTribeMemberMutation.isPending}
              >
                <p className="font-semi-normal text-meta font-sans leading-normal">Add member</p>
              </Button>
            </div>
          </div>
          <div className="mt-10 flex flex-col px-6">
            <div className="mt-6 grid gap-1">
              <Label htmlFor="username" className="text-text-grey text-label font-normal">
                Username
              </Label>
              <div className="border-step-color bg-light_grey flex h-12 items-center rounded-xl border-2 px-2">
                <input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full border-none bg-transparent shadow-none focus:border-transparent focus:ring-0 focus:outline-none"
                />
                <PlusIcon className="text-step-color cursor-pointer" onClick={handleAddUsername} />
              </div>
            </div>
            <div className="border-b-grey-20 border-b-2 py-4"></div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {usernames.map((username, index) => (
                <div
                  key={index}
                  className="bg-grey-20 flex items-center gap-2 rounded-lg px-3 py-2"
                >
                  <p className="text-text-grey text-body-s font-medium">{username}</p>
                  {/* Clicking the XIcon removes the username */}
                  <XIcon
                    onClick={() => handleRemoveUsername(index)}
                    className="text-text-grey w-4 cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};
export default AddMemberModal;
