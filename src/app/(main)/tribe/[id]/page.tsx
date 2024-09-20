import React from 'react';
import TopNav from "@/components/Navigation/TopNav";
import {Button} from "@/components/ui/button";
import ImageIcon from "@/image/icons/image.svg"
import VideoIcon from "@/image/icons/video-camera.svg";
import PollIcon from "@/image/icons/votes.svg";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import SearchIcon from "@/image/icons/search.svg";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import ThreadCard from "@/components/Tribe/ThreadCard";
import TribeDetailsCard from "@/components/Tribe/TribeDetailsCard";
import CloseIcon from "@/image/icons/close.svg"
import CreateThreadModal from "@/components/Tribe/CreateThreadModal";
import CheckedIcon from "@/image/icons/CheckedIcon.svg";
import JoinTribeModal from "@/components/Tribe/JoinTribeModal";

function SingleTribePage() {
    return (
        <div className="bg-light_grey pb-10">
            <TopNav/>
            <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2">
                    <div>
                        <ChevronLeft />
                    </div>
                    <div>
                        <p className="font-sans font-semibold text-[16px] leading-[24px]">Start-Ups</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px]">
                        <div>
                            <SearchIcon />
                        </div>
                        <div>
                            <input
                                id="search"
                                type="text"
                                className="rounded-xl text-[14px] bg-light_grey border-0 w-[300px] focus:outline-none focus:ring-0 focus:border-transparent"
                                placeholder="Search tribe"
                            />
                        </div>
                    </div>
                    <Select>
                        <SelectTrigger className="bg-mid-grey rounded-xl border-0 w-[180px] px-[16px]">
                            <SelectValue
                                placeholder={
                                <span className="font-sans font-semibold text-[12px] leading-[14.4px] text-text-grey">POPULAR</span>
                            }
                            />
                        </SelectTrigger>
                        <SelectContent className="form-font">
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <div className="flex gap-2 p-10 py-4">
                    <div className="flex flex-col gap-2 w-[768px]">
                        <ThreadCard/>
                        <ThreadCard/>
                    </div>
                    <TribeDetailsCard/>
                </div>
                <CreateThreadModal/>
                <JoinTribeModal />
            </div>
        </div>
    );
}

export default SingleTribePage;