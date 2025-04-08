import React, {useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {PlusIcon, XIcon} from "lucide-react";
import {useAppDispatch} from "@/redux/hook";
import {addTribeMember} from "@/features/tribes/tribe.slice";
import {useSelector} from "react-redux";
import {isIfStatement} from "@babel/types";
import {updateToastifyReducer} from "@/redux/toastifySlice";

interface AddMemberIF {
    isOpen: boolean;
    toggle: () => void;
    id: number
}

const AddMemberModal: React.FC<AddMemberIF> = ({isOpen, toggle, id}) => {
    // State to hold the input value
    const [inputValue, setInputValue] = useState('');
    // State to hold the list of usernames
    const [usernames, setUsernames] = useState<string[]>([]);
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)

    // Adds the current input value to the usernames array
    const handleAddUsername = () => {
        const trimmedValue = inputValue.trim();
        if (!trimmedValue) return;
        setUsernames((prev) => [...prev, trimmedValue]);
        setInputValue('');
    };

    // Removes a username from the array by its index
    const handleRemoveUsername = (index: number) => {
        setUsernames((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddTribeMember = () => {
        const data = {usernames}
        dispatch(addTribeMember({token: authToken, id, data})).then((res: any) => {
            if (res.payload.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Member added successfully.",
                        type: "success",
                    })
                );
                toggle()
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Error adding member to tribe.",
                        type: "error",
                    })
                );
            }
        }).catch(err => {
            console.log({err})
        })
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[640px] p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                        <p className="font-sans font-semibold text-[18px] leading-[27px]">
                            Add member
                        </p>
                    </div>
                    <div>
                        <Button
                            className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom"
                            onClick={handleAddTribeMember}
                        >
                            <p className="font-sans font-semi-normal text-[12px]">Add member</p>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col mt-10 px-6">
                    <div className="grid gap-1 mt-[24px]">
                        <Label htmlFor="username"
                               className="font-normal text-[14px] leading-[16.8px] text-text-grey">Username</Label>
                        <div className="flex items-center px-2 h-[48px] rounded-[12px] bg-light_grey border-[1.5px] border-step-color ">
                            <input
                                id="username"
                                type="text"
                                placeholder="Enter username"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full bg-transparent border-none shadow-none focus:outline-none focus:ring-0 focus:border-transparent"
                            />
                            <PlusIcon className="text-step-color cursor-pointer" onClick={handleAddUsername} />
                        </div>
                    </div>
                    <div className="py-4 border-b-[2px] border-b-grey-20"></div>
                    <div className="flex gap-2 items-center mt-4 flex-wrap">
                        {usernames.map((username, index) => (
                            <div
                                key={index}
                                className="px-[12px] py-[8px] flex gap-[8px] bg-grey-20 rounded-[8px] items-center"
                            >
                                <p className="font-medium text-text-grey text-[14px]">{username}</p>
                                {/* Clicking the XIcon removes the username */}
                                <XIcon
                                    onClick={() => handleRemoveUsername(index)}
                                    className="w-[16px] text-text-grey cursor-pointer"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AddMemberModal;