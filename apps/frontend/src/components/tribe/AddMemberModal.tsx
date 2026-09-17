import React, { useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Label, Input } from "@lemonade/ui";
import { PlusIcon, XIcon } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { useAddTribeMemberMutation } from "@/features/tribes/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

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
              message: "Member added successfully.",
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
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="w-[640px] rounded-lg bg-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </div>
            <p className="font-sans text-[18px] font-semibold leading-[27px]">Add member</p>
          </div>
          <div>
            <Button
              className="auth-button rounded-[12px] border-step-color p-[10px] px-[14px] shadow-custom-bottom"
              onClick={handleAddTribeMember}
            >
              <p className="font-sans text-[12px] font-semi-normal">Add member</p>
            </Button>
          </div>
        </div>
        <div className="mt-10 flex flex-col px-6">
          <div className="mt-[24px] grid gap-1">
            <Label
              htmlFor="username"
              className="text-[14px] font-normal leading-[16.8px] text-text-grey"
            >
              Username
            </Label>
            <div className="flex h-[48px] items-center rounded-[12px] border-[1.5px] border-step-color bg-light_grey px-2">
              <input
                id="username"
                type="text"
                placeholder="Enter username"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full border-none bg-transparent shadow-none focus:border-transparent focus:outline-none focus:ring-0"
              />
              <PlusIcon className="cursor-pointer text-step-color" onClick={handleAddUsername} />
            </div>
          </div>
          <div className="border-b-[2px] border-b-grey-20 py-4"></div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {usernames.map((username, index) => (
              <div
                key={index}
                className="flex items-center gap-[8px] rounded-[8px] bg-grey-20 px-[12px] py-[8px]"
              >
                <p className="text-[14px] font-medium text-text-grey">{username}</p>
                {/* Clicking the XIcon removes the username */}
                <XIcon
                  onClick={() => handleRemoveUsername(index)}
                  className="w-[16px] cursor-pointer text-text-grey"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default AddMemberModal;
