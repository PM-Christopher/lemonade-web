"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import SearchIcon from "@/images/icons/search.svg";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import ThreadCard from "@/components/Tribe/ThreadCard";
import TribeDetailsCard from "@/components/Tribe/TribeDetailsCard";
import CreateThreadModal from "@/components/Tribe/CreateThreadModal";
import JoinTribeModal from "@/components/Tribe/JoinTribeModal";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {TribeThreadInterface} from "@/interfaces/TribeInterface";
import {useRouter} from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";

const SingleTribePage = ({params}: {params: {id: number}}) => {
    const [createThreadModalOpen, setCreateThreadModalOpen] = useState(false)
    const [joinTribeModalOpen, setJoinTribeModalOpen] = useState(false)
    const router = useRouter()

    const {authToken} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data, loading } = useRequest(`/tribes/${params.id}`, "GET", {}, true, getHeader())

    const activateCreateThreadModal = () => {
        setCreateThreadModalOpen(!createThreadModalOpen)
    }

    const activateJoinTribeModal = () => {
        setJoinTribeModalOpen(!joinTribeModalOpen)
    }

    return (
        <MainLayout>
            <div className="bg-light_grey pb-10">
                <TopNav/>
                <div className="bg-white flex justify-between p-5 px-10 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 items-center cursor-pointer" onClick={() => router.push("/tribe")}>
                        <div>
                            <ChevronLeft/>
                        </div>
                        <div>
                            <p className="font-sans font-semibold text-[16px] leading-[24px]">
                                {data?.tribe?.tribe_name}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px]">
                            <div>
                                <SearchIcon/>
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
                                        <span
                                            className="font-sans font-semibold text-[12px] leading-[14.4px] text-text-grey">POPULAR</span>
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
                            {
                                data?.threads.map((thread: TribeThreadInterface, index: number) => (
                                    <ThreadCard tribe_id={data?.tribe?.id} thread={thread}/>
                                ))
                            }
                        </div>
                        <TribeDetailsCard toggle={activateCreateThreadModal} tribe={data?.tribe}/>
                    </div>
                    <CreateThreadModal tribe_id={data?.tribe?.id} toggle={activateCreateThreadModal}
                                       isOpen={createThreadModalOpen}/>
                    <JoinTribeModal toggle={activateJoinTribeModal} isOpen={joinTribeModalOpen}/>
                </div>
            </div>
        </MainLayout>
    );
}

export default SingleTribePage;