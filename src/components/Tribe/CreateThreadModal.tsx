import React from 'react';
import CloseIcon from "@/image/icons/close.svg";
import {Button} from "@/components/ui/button";
import ImageIcon from "@/image/icons/image.svg";
import VideoIcon from "@/image/icons/video-camera.svg";
import PollIcon from "@/image/icons/votes.svg";

function CreateThreadModal() {
    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 hidden`}>
            <div className="flex flex-col bg-white rounded-[12px]">
                <div className="shadow-lg w-[800px] p-6 h-[300px]">
                    <div className="flex justify-between items-center">
                        <div className="cursor-pointer">
                            <CloseIcon/>
                        </div>
                        <div>
                            <Button className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color">
                                <p className="font-sans font-semi-normal text-[12px]">Post</p>
                            </Button>
                        </div>
                    </div>
                    <div className="mt-2">
                        <div className="grid gap-2">
                            <input
                                id="tribe-name"
                                type="text"
                                className="font-sans font-semibold text-[18px] border-0 shadow-none focus:outline-none focus:border-0 focus:ring-0 focus:border-transparent"
                                placeholder="Topic"
                            />
                        </div>
                        <div className="grid gap-2 mt-4">
                                    <textarea
                                        id="tribe-name"
                                        className="font-sans h-[160px] font-normal text-[16px] border-0 shadow-none focus:outline-none focus:ring-0 focus:border-transparent resize-none"
                                        placeholder="Share your thoughts..."
                                    />
                        </div>
                    </div>
                </div>
                <div className="bg-mid-grey flex p-4 gap-6 items-center rounded-bl-[12px] rounded-br-[12px]">
                    <ImageIcon/>
                    <VideoIcon/>
                    <PollIcon/>
                    <div className="flex ml-4">
                        <p>+ Add tags</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateThreadModal;