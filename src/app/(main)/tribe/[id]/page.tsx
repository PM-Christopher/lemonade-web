"use client"
import React, {useEffect, useRef, useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import SearchIcon from "@/images/icons/search.svg";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import ThreadCard from "@/components/tribe/ThreadCard";
import TribeDetailsCard from "@/components/tribe/TribeDetailsCard";
import CreateThreadModal from "@/components/tribe/CreateThreadModal";
import JoinTribeModal from "@/components/tribe/JoinTribeModal";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {Thread, TribeThreadInterface} from "@/interfaces/TribeInterface";
import {useRouter} from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import EditIcon from "@/images/icons/edit.svg"
import {useMediaQuery} from "react-responsive";
import ShareTribeModal from "@/components/tribe/ShareTribeModal";
import shareTribeModal from "@/components/tribe/ShareTribeModal";
import UserInfoModal from "@/components/tribe/UserInfoModal";
import {useAppDispatch} from "@/redux/hook";
import {filterThreads, getThreads} from "@/features/tribes/tribe.slice";

interface ModalPosition {
    top: number;
    left: number;
}

const SingleTribePage = ({params}: {params: {id: number}}) => {
    const [createThreadModalOpen, setCreateThreadModalOpen] = useState(false)
    const [joinTribeModalOpen, setJoinTribeModalOpen] = useState(false)
    const [shareTribeModalOpen, setShareTribeModalOpen] = useState(false)
    const [userInfoModal, setUserInfoModal] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalPosition, setModalPosition] = useState<ModalPosition | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const moreIconRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch()

    const { user, threads, loading: dataLoading } = useSelector((state:any) => state.tribe)

    const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
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
    // const { data: dataThreads, loading: threadLoading } = useRequest(`/tribes/${params.id}/threads/all`, "GET", {}, true, getHeader())

    const activateCreateThreadModal = () => {
        setCreateThreadModalOpen(!createThreadModalOpen)
    }

    const activateJoinTribeModal = () => {
        setJoinTribeModalOpen(!joinTribeModalOpen)
    }

    const activateShareTribeModal = () => {
        setShareTribeModalOpen(!shareTribeModalOpen)
    }

    const activateUserInfoModal = () => {
        setUserInfoModal(!userInfoModal)
    }

    const handleMoreIconClick = () => {
        if (moreIconRef.current) {
            const rect = moreIconRef.current.getBoundingClientRect();
            const position: ModalPosition = {
                top: rect.top + window.scrollY,
                left: rect.right + window.scrollX - 150, // Adjust modal position relative to the button
            };
            setModalPosition(position);
        }
        setModalVisible(!isModalVisible); // Toggle modal visibility
    };

    const sortThreads = (value: any) => {
        dispatch(filterThreads({id: params.id, token: authToken, data: {filter: value}}))
    }

    useEffect(() => {
        dispatch(getThreads({id: params.id, token: authToken}))
    }, [dispatch])

    return (
        <MainLayout>
            <div className="bg-light_grey pb-10">
                <div
                    className="bg-white flex flex-col tablet:flex-row justify-between p-5 px-10 border-t-[1px] border-b-[1px] tablet:items-center gap-4">
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
                    <div className="flex justify-between items-center gap-[10px]">
                        <div
                            className="flex items-center gap-3 bg-light_grey px-[16px] h-[40px] rounded-[12px] w-[247px] tablet:w-[300px]">
                            <div>
                                <SearchIcon/>
                            </div>
                            <div className="w-full">
                                <input
                                    id="search"
                                    type="text"
                                    className="rounded-xl text-[14px] bg-light_grey border-0 w-full focus:outline-none focus:ring-0 focus:border-transparent"
                                    placeholder="Search tribe"
                                />
                            </div>
                        </div>
                        <Select onValueChange={sortThreads}>
                            <SelectTrigger className="bg-mid-grey rounded-xl border-0 w-[180px] px-[16px] h-[40px]">
                                <SelectValue
                                    placeholder={
                                        <span
                                            className="font-sans font-semibold text-[12px] leading-[14.4px] text-text-grey">Select Option</span>
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent className="form-font">
                                <SelectItem value="popular">Popularity</SelectItem>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div>
                    <div className="flex gap-2 p-10 py-4">
                        <div className="flex flex-col gap-2 w-[768px] bg-white overflow-y-auto max-h-screen hide-scrollbar">
                            {
                                dataLoading ? (
                                    <p>
                                        Loading...
                                    </p>
                                ) : (
                                    threads.map((thread: Thread, index: number) => (
                                        <ThreadCard
                                            tribe_id={data?.tribe?.id}
                                            thread={thread}
                                            toggle={activateUserInfoModal}
                                            key={index}
                                            onMoreIconClick={handleMoreIconClick}
                                            isModalVisible={isModalVisible}
                                            modalPosition={modalPosition}
                                            modalRef={modalRef}
                                            moreIconRef={moreIconRef}
                                        />
                                    ))
                                )
                            }
                        </div>
                        <div className="hidden tablet:block">
                            <TribeDetailsCard share={activateShareTribeModal} toggle={activateCreateThreadModal} tribe={data?.tribe}/>
                        </div>
                    </div>
                    <CreateThreadModal tribe_id={data?.tribe?.id} toggle={activateCreateThreadModal}
                                       isOpen={createThreadModalOpen}/>
                    <JoinTribeModal toggle={activateJoinTribeModal} isOpen={joinTribeModalOpen}/>
                    <ShareTribeModal toggle={activateShareTribeModal} isOpen={shareTribeModalOpen} tribe={data?.tribe} />
                    {
                        user && (
                            <UserInfoModal toggle={activateUserInfoModal} isOpen={userInfoModal} user={user} />
                        )
                    }
                </div>
            </div>
            {
                isMobile && (
                    <div
                        className="fixed bottom-[150px] right-4 bg-gradient-green text-white p-4 rounded-full cursor-pointer w-[60px] h-[60px] flex justify-center items-center shadow-custom-bottom"
                        onClick={activateCreateThreadModal}>
                        <EditIcon className="h-[19px] w-[19px]"/>
                    </div>
                )
            }
        </MainLayout>
    );
}

export default SingleTribePage;