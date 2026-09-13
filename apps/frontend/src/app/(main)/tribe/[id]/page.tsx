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
import {useRouter, useSearchParams} from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import EditIcon from "@/images/icons/edit.svg"
import {useMediaQuery} from "react-responsive";
import ShareTribeModal from "@/components/tribe/ShareTribeModal";
import shareTribeModal from "@/components/tribe/ShareTribeModal";
import UserInfoModal from "@/components/tribe/UserInfoModal";
import {useAppDispatch} from "@/redux/hook";
import {
    filterThreads,
    getPinThreads,
    getThreads,
    getTribe,
    pinThread, verifyTribePayment,
    viewProfile
} from "@/features/tribes/tribe.slice";
import ReportThreadModal from "@/components/tribe/ReportThreadModal";
import DeleteThreadModal from "@/components/tribe/DeleteThreadModal";
import AddMemberModal from "@/components/tribe/AddMemberModal";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import useDebounce from "@/hooks/useDebounce";
import useNxtSearchParams from "@/hooks/useSearchParams";
import PadlockIcon from "@/images/icons/padlockIconFilled.svg"
import JoinedTribeModal from "@/components/tribe/JoinedTribeModal";
import {RootState} from "@/redux/store";
import {ThreadsSkeleton} from "@/components/Skeletons";


const SingleTribePage = ({params}: { params: { id: string } }) => {
    const [createThreadModalOpen, setCreateThreadModalOpen] = useState(false)
    const [joinTribeModalOpen, setJoinTribeModalOpen] = useState(false)
    const [shareTribeModalOpen, setShareTribeModalOpen] = useState(false)
    const [userInfoModal, setUserInfoModal] = useState(false)
    const [reportThreadModal, setReportThreadModal] = useState(false)
    const [deleteThreadModal, setDeleteThreadModal] = useState(false)
    const [addUserModal, setAddUserModal] = useState(false)
    const [joinedTribeModal, setJoinedTribeModal] = useState(false)

    const [userId, setUserId] = useState<number | null>(null);
    const [threadId, setThreadId] = useState<number | null>(null);
    const dispatch = useAppDispatch()

    const {user, threads, loading: dataLoading, pinnedThreads, tribe} = useSelector((state: RootState) => state.tribe)

    const isMobile = useMediaQuery({query: "(max-width: 1024px)"});
    const router = useRouter()
    const searchParams = useSearchParams();
    const {setSearchParams, nxtSearchParams} = useNxtSearchParams();

    const {isLoggedIn} = useSelector((state: any) => state.auth)

    const query = nxtSearchParams?.get("search");
    const [searchValue, setSearchValue] = useState("");
    const {debouncedValue} = useDebounce(searchValue, 500);
    useEffect(() => {
        setSearchParams({search: debouncedValue});
    }, [debouncedValue]);

    const [data, setData] = useState<any[] | undefined>(undefined);

    useEffect(() => {
        if (threads && threads.length > 0) {
            setData(threads);
        } else if (threads && threads.length === 0) {
            setData([]);
        }
    }, [threads]);

    useEffect(() => {
        if (query?.trim() === "") {
            setData(threads);
        } else {
            const q = query?.toLowerCase()?.trim();
            const filtered = threads.filter((thread: any) => {
                return !q ||
                    thread?.topic?.toLowerCase().includes(q) ||
                    thread?.thoughts?.toLowerCase().includes(q);
            });

            setData(filtered);
        }
    }, [query]);

    const trxref = searchParams.get('trxref');
    const reference = searchParams.get('reference');

    useEffect(() => {
        if (trxref) {
            dispatch(verifyTribePayment({reference: trxref}))
                .unwrap()
                .then(() => {
                    // Remove trxref from URL
                    const params = new URLSearchParams(searchParams);
                    params.delete('trxref');
                    params.delete('reference');
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Joined tribe successfully",
                            type: "success",
                        })
                    );
                    setJoinedTribeModal(true)
                    // Update the URL without reloading
                    router.replace(`?${params.toString()}`);
                })
                .catch((err) => {
                    console.error('Payment verification failed:', err);
                });
        }
    }, [trxref, dispatch, searchParams, router]);

    useEffect(() => {
        if (isLoggedIn && params?.id) {
            dispatch(getTribe({id: params.id}))
        }
    }, []);

    const toggleAddMember = () => {
        setAddUserModal(!addUserModal)
    }

    const activateCreateThreadModal = () => {
        setCreateThreadModalOpen(!createThreadModalOpen)
    }

    const switchUserId = (id: number) => {
        setUserId(id)
        dispatch(viewProfile({id: id}))
        activateUserInfoModal()
    }

    const setPinThread = (id: number) => {
        dispatch(pinThread({id}))
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
        if (!tribe) return; // do nothing if tribe is undefined

        dispatch(
            filterThreads({
                id: tribe.id, // safe, guaranteed number
                data: { filter: value },
            })
        );
    };

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
        dispatch(getThreads({id: params.id}))

        dispatch(getPinThreads({id: params.id}))
    }, [])

    const handleScroll = (id: number) => {
        let itemId = `pinned-${id}`
        const element = document.getElementById(itemId);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
    };

    const toggleJoinedTribeModal = () => {
        setJoinedTribeModal(!joinedTribeModal)
    }

    console.log({tribe})

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
                                {tribe?.tribe_name}

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
                                    onChange={(e) => setSearchValue(e.target.value)}
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
                <div className="flex justify-around mt-4">
                    {/* Left Content Section */}
                    <div className="flex flex-col px-4 laptop:px-10 w-full max-w-[1000px]">
                        {/* Pinned Threads */}
                        {pinnedThreads?.length > 0 && (
                            <div className="flex flex-wrap items-center justify-start gap-3 bg-grey-20 p-3 rounded-lg">
                                {pinnedThreads.map((pinned, index) => (
                                    <button
                                        key={pinned.id ?? index}
                                        onClick={() => handleScroll(pinned.id)}
                                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-md hover:bg-grey-10 transition"
                                    >
                                        <p className="truncate font-semibold text-sm text-gray-800 max-w-[150px]">
                                            {pinned.topic}
                                        </p>
                                        <PinnedIcon className="w-3 text-gray-600" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Threads Section */}
                        <div
                            className={`mt-4 flex flex-col gap-4 bg-white rounded-xl shadow-sm ${
                                tribe?.has_joined ? "overflow-y-auto" : "overflow-hidden"
                            } max-h-[100vh] hide-scrollbar p-4`}
                        >
                            {dataLoading || data === undefined ? (
                                <ThreadsSkeleton count={4} />
                            ) : data.length === 0 ? (
                                <div className="p-6 text-center text-gray-500">
                                    No threads found...
                                </div>
                            ) : (
                                <div className="flex flex-col gap-6">
                                    {data.map((thread: Thread) => (
                                        <ThreadCard
                                            key={thread.id ?? Math.random()}
                                            tribe_id={tribe?.id}
                                            tribe={tribe}
                                            thread={thread}
                                            toggle={activateUserInfoModal}
                                            switchUserId={switchUserId}
                                            pinThread={setPinThread}
                                            toggleThreadId={toggleThreadId}
                                            toggleDeleteThread={toggleDeleteThreadModal}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Monetized Tribe Overlay */}
                        {tribe && !tribe.has_joined && tribe.monetized && (
                            <div className="fixed bottom-0 left-0 w-full h-[130px] bg-white/60 backdrop-blur-md flex flex-col items-center justify-center gap-3 z-50">
                                <div className="flex items-center gap-2 text-gray-700">
                                    <PadlockIcon />
                                    <p>Paid Tribe</p>
                                </div>
                                <button
                                    onClick={activateJoinTribeModal}
                                    className="text-light-green text-sm underline font-medium hover:text-green-700 transition"
                                >
                                    Unlock Tribe content
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar (Desktop only) */}
                    {!isMobile && (
                        <aside className="hidden tablet:block">
                            <TribeDetailsCard
                                share={activateShareTribeModal}
                                toggle={activateCreateThreadModal}
                                tribe={tribe}
                                toggleAddMember={toggleAddMember}
                                toggleJoin={activateJoinTribeModal}
                                threads={threads}
                            />
                        </aside>
                    )}

                    {/* Modals */}
                    <CreateThreadModal
                        tribe_id={tribe?.id}
                        toggle={activateCreateThreadModal}
                        isOpen={createThreadModalOpen}
                    />
                    <JoinTribeModal
                        toggle={activateJoinTribeModal}
                        isOpen={joinTribeModalOpen}
                        tribe={tribe}
                    />
                    <JoinedTribeModal
                        toggle={toggleJoinedTribeModal}
                        isOpen={joinedTribeModal}
                        tribe={tribe}
                    />
                    <ShareTribeModal
                        toggle={activateShareTribeModal}
                        isOpen={shareTribeModalOpen}
                        tribe={tribe}
                    />
                    {user && (
                        <UserInfoModal
                            toggle={activateUserInfoModal}
                            isOpen={userInfoModal}
                            user={user}
                            tribe={tribe}
                        />
                    )}
                    <ReportThreadModal
                        toggle={activateReportThreadModal}
                        isOpen={reportThreadModal}
                        threadId={threadId}
                    />
                    <DeleteThreadModal
                        toggle={activateDeleteThreadModal}
                        isOpen={deleteThreadModal}
                        threadId={threadId}
                        setThreadId={setThreadId}
                    />
                    <AddMemberModal
                        isOpen={addUserModal}
                        toggle={toggleAddMember}
                        id={params.id}
                    />
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