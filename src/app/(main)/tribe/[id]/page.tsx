"use client"
import React, {useEffect, useRef, useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import SearchIcon from "@/images/icons/search.svg";
import PinnedIcon from "@/images/icons/pinnedIcon.svg"
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
import {filterThreads, getPinThreads, getThreads, pinThread, viewProfile} from "@/features/tribes/tribe.slice";
import ReportThreadModal from "@/components/tribe/ReportThreadModal";
import DeleteThreadModal from "@/components/tribe/DeleteThreadModal";
import AddMemberModal from "@/components/tribe/AddMemberModal";


const SingleTribePage = ({params}: {params: {id: number}}) => {
    const [createThreadModalOpen, setCreateThreadModalOpen] = useState(false)
    const [joinTribeModalOpen, setJoinTribeModalOpen] = useState(false)
    const [shareTribeModalOpen, setShareTribeModalOpen] = useState(false)
    const [userInfoModal, setUserInfoModal] = useState(false)
    const [reportThreadModal, setReportThreadModal] = useState(false)
    const [deleteThreadModal, setDeleteThreadModal] = useState(false)
    const [addUserModal, setAddUserModal] = useState(false)

    const [userId, setUserId] = useState<number|null>(null);
    const [threadId, setThreadId] = useState<number|null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const moreIconRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useAppDispatch()

    const { user, threads, loading: dataLoading, pinnedThreads } = useSelector((state:any) => state.tribe)

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

    const toggleAddMember = () => {
        setAddUserModal(!addUserModal)
    }

    const activateCreateThreadModal = () => {
        setCreateThreadModalOpen(!createThreadModalOpen)
    }

    const switchUserId = (id: number) => {
        setUserId(id)
        dispatch(viewProfile({ id: id, token: authToken }))
        activateUserInfoModal()
    }

    const setPinThread = (id: number) => {
        dispatch(pinThread({ id, token: authToken }))
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

    const activateReportThreadModal = () => {
        setReportThreadModal(!reportThreadModal)
    }

    const sortThreads = (value: any) => {
        dispatch(filterThreads({id: params.id, token: authToken, data: {filter: value}}))
    }

    const toggleThreadId = (id: number) => {
        setThreadId(id)
        activateReportThreadModal()
    }

    const toggleDeleteThreadModal = (id: number) => {
        setThreadId(id)
        activateDeleteThreadModal()
    }

    const activateDeleteThreadModal = () => {
        setDeleteThreadModal(!deleteThreadModal)
    }

    useEffect(() => {
        dispatch(getThreads({id: params.id, token: authToken}))

        dispatch(getPinThreads({id: params.id, token: authToken}))
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
                                    placeholder="Search thread"
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
                    <div className="flex justify-around mt-4">
                        <div className="flex flex-col px-10">
                            <div className="w-[769px] flex justify-between bg-grey-20">
                                {
                                    pinnedThreads?.length > 0 && (
                                        pinnedThreads?.map((pinned: {topic: string, image: string}) => (
                                            <div className="px-[16px] py-[12px] flex gap-[12px] items-center">
                                                <p className="truncate font-semiBold text-[14px]">
                                                    {pinned?.topic}
                                                </p>
                                                <PinnedIcon className="w-[10px]"/>
                                            </div>
                                        ))
                                    )
                                }
                            </div>
                            <div className="flex gap-2">
                                <div
                                    className="flex flex-col gap-2 w-[768px] bg-white overflow-y-auto max-h-screen hide-scrollbar">
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
                                                    switchUserId={switchUserId}
                                                    pinThread={setPinThread}
                                                    toggleThreadId={toggleThreadId}
                                                    toggleDeleteThread={toggleDeleteThreadModal}
                                                />
                                            ))
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="hidden tablet:block">
                            <TribeDetailsCard
                                share={activateShareTribeModal}
                                toggle={activateCreateThreadModal}
                                tribe={data?.tribe}
                                toggleAddMember={toggleAddMember}
                            />
                        </div>
                    </div>
                    <CreateThreadModal tribe_id={data?.tribe?.id} toggle={activateCreateThreadModal}
                                       isOpen={createThreadModalOpen}/>
                    <JoinTribeModal toggle={activateJoinTribeModal} isOpen={joinTribeModalOpen}/>
                    <ShareTribeModal toggle={activateShareTribeModal} isOpen={shareTribeModalOpen} tribe={data?.tribe}/>
                    {
                        user && (
                            <UserInfoModal toggle={activateUserInfoModal} isOpen={userInfoModal} user={user}
                                           tribe={data?.tribe}/>
                        )
                    }
                    <ReportThreadModal toggle={activateReportThreadModal} isOpen={reportThreadModal} threadId={threadId} />
                    <DeleteThreadModal toggle={activateDeleteThreadModal} isOpen={deleteThreadModal} threadId={threadId} setThreadId={setThreadId} />
                    <AddMemberModal isOpen={addUserModal} toggle={toggleAddMember}  />
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