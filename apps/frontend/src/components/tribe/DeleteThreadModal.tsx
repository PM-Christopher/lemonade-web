import React from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {Button} from "@/components/ui/button";
import {useAppDispatch} from "@/redux/hook";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {deleteThread} from "@/features/tribes/tribe.slice";

interface DeleteThreadIF {
    toggle: () => void;
    isOpen: boolean;
    threadId: number|null;
    setThreadId: (threadId: number|null) => void;
}

const DeleteThreadModal: React.FC<DeleteThreadIF> = ({isOpen, threadId, toggle, setThreadId}) => {
    const dispatch = useAppDispatch();

    const handleDeleteThread = () => {
        dispatch(deleteThread({id: threadId}))
        dispatch(
            updateToastifyReducer({
                show: true,
                message: "Thread deleted.",
                type: "success",
            })
        );
        setThreadId(null);
        toggle();
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[380px] p-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <p className="font-sans font-semibold text-[18px] leading-[27px]">
                            Delete thread
                        </p>
                    </div>
                    <div className="cursor-pointer" onClick={toggle}>
                        <CloseIcon/>
                    </div>
                </div>
                <div className="flex flex-col mt-[24px] gap-[16px]">
                    <p className="font-normal text-[14px] text-light-black">Are you sure you want to delete this
                        thread?</p>

                    <div className="flex gap-[12px]">
                        <Button className="h-[44px] bg-white shadow-none py-[14px] border-[1px] w-full rounded-[12px] hover:bg-white" onClick={handleDeleteThread}>
                            <p className="font-semi-normal text-[16px] text-red-1">Yes, delete</p>
                        </Button>
                        <Button className="bg-transparent shadow-none bg-gradient-green h-[44px] border-none w-full rounded-[12px]" onClick={toggle}>
                            <p className="font-semi-normal text-[16px]">No, don't delete</p>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default DeleteThreadModal;