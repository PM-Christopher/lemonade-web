"use client"
import React, {useEffect, useState} from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import business_logo from "@/images/business/jobLogo.png";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import PhoneIcon from "@/images/icons/phoneIcon.svg";
import MessageIcon from "@/images/icons/messageIcon.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import PencilIcon from "@/images/icons/editIcon.svg"
import RocketIcon from "@/images/icons/rocketIcon.svg"
import CaseIcon from "@/images/icons/caseIcon.svg"
import TrashIcon from "@/images/icons/trashIcon.svg"
import RocketIconGreen from "@/images/icons/rocketIconGreen.svg"
import RocketIconGrey from "@/images/icons/rocketIconGrey.svg"

import RatingsBar from "@/components/global/RatingsBar";
import Reviews from "@/components/global/Reviews";
import ReviewModal from "@/components/business/Modals/ReviewModal";
import RequestServiceModal from "@/components/business/Modals/RequestServiceModal";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {formatNumberWithCommas} from "@/lib/formatNumber";
import {formatDecimal, formatStringUCFirst} from "@/lib/helper";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {axiosInstance} from "@/lib/axiosInstane";
import VerifyBoost from "@/components/business/Modals/VerifyBoost";
import BoostDetailsModal from "@/components/business/Modals/BoostDetailsModal";
import MainLayout from "@/components/layouts/MainLayout";


const BusinessDetailsPage = ({params}: {params: {id: number}}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isRequestOpen, setIsRequestOpen] = useState(false)
    const [displayCount, setDisplayCount] = useState(4); // Initial number of reviews to show
    const [reviews, setReviews] = useState([]);
    const searchParams = useSearchParams()
    const trxref = searchParams.get("trxref")
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [isVerifyBoost, setIsVerifyBoost] = useState(false)
    const [boost, setBoost] = useState<any>(null)
    const [boostDetails, setBoostDetails] = useState(false)

    const {authToken} = useSelector((state: any) => state.auth)
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const toggleRequestModal = () => {
        setIsRequestOpen(!isRequestOpen)
    }

    const toggleVerifyBoost = () => {
        setIsVerifyBoost(!isVerifyBoost)
    }

    const toggleBoostDetails = () => {
        setBoostDetails(!boostDetails)
    }

    // business data
    const { data, loading } = useRequest(`/business/${params.id}`, "GET", {}, true, getHeader())
    // business reviews
    const { data: reviewData, loading: reviewLoading } = useRequest(`/business/${params.id}/business-reviews`, "GET", {}, true, getHeader())

    useEffect(() => {
        if (reviewData) {
            setReviews(reviewData?.reviews)
        }
    }, [reviewData])

    useEffect(() => {
        const verifyBusinessBoost = async () => {
            if (trxref) {
                console.log({trxref})
                setVerifyLoading(true);
                try {
                    const { data } = await axiosInstance.patch(`listing/verify-business-boost?reference=${trxref}`, {}, getHeader());
                    if (data.status) {
                        if (data.data.verified) {
                            setBoost(data.data.boost)
                            setIsVerifyBoost(true)
                        }
                    }
                } catch (error) {
                } finally {
                    setVerifyLoading(false);
                }
            }
        };
        verifyBusinessBoost();
    }, [trxref]);

    const loadMore = () => {
        setDisplayCount((prevCount) => prevCount + 4); // Increase the count by 4
    };

    const hasMoreReviews = displayCount < reviews.length;

    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Business details</p>
                    </div>
                </div>
                <section className="min-h-screen mt-4 flex flex-col items-center gap-4">
                    <div className="w-[640px] relative bg-white rounded-[12px] p-[16px] bg-cover bg-center bg-no-repeat"
                         style={{backgroundImage: `url('/images/business-bg.png')`}}>
                        <div className="flex flex-col">
                            <div className="flex justify-center">
                                <Image src={"/images/business/jobLogo.png"} alt="logo"
                                       className="rounded-[16px] border-[1px] border-step-color flex justify-center" width={64} height={64}/>
                            </div>
                            <div className="flex justify-center flex-col mt-[8px]">
                                <p className="text-center font-semibold text-[16px]">{data?.business?.name}</p>
                                <p className="text-center font-semi-normal text-[14px] text-text-grey">{data?.business?.city}, {data?.business?.country}</p>
                                {
                                    data?.business?.service_rate ? (
                                        <p className="text-center mt-[4px] text-[16px] font-semibold">N {formatNumberWithCommas(data?.business?.service_rate)}/hr</p>
                                    ) : (
                                        <></>
                                    )
                                }
                            </div>
                            <div className="flex justify-center mt-[8px]">
                                <div
                                    className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl justify-center w-fit">
                                    <div>
                                        <Image src={"/images/medal.png"} alt="medal" width={16} height={16}/>
                                    </div>
                                    <div>
                                        <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">
                                            {formatDecimal(data?.business?.rating, 1)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {
                                !data?.business?.owner && (
                                    <div className="flex justify-center mt-[16px]">
                                        <Button className="bg-gradient-green w-fit p-[14px] px-[24px] shadow-custom-bottom">
                                            <p className="font-normal text-white" onClick={toggleRequestModal}>Request
                                                service</p>
                                        </Button>
                                    </div>
                                )
                            }
                        </div>
                        {
                            data?.business?.owner && data?.business.hasBoost && (
                                <div
                                    className="absolute top-0 right-0 bg-light-green-10 rounded-bl-[12px] rounded-tr-[12px]">
                                    <div className="flex p-[4px] px-[8px] gap-[4px] items-center">
                                        <RocketIconGreen/>
                                        <p className="text-[14px] font-semi-normal text-mid-green">Boosted</p>
                                    </div>
                                </div>
                            )
                        }
                    </div>

                    {
                        data?.business?.owner ? (
                            <div className="flex justify-center items-center mt-[24px] gap-8">
                                <Link href={`/business/${params.id}/jobs`}>
                                    <div className="flex flex-col items-center gap-[8px]">
                                        <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                                            <CaseIcon/>
                                        </div>
                                        <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Jobs</p>
                                    </div>
                                </Link>
                                {
                                    data?.business.hasBoost ? (
                                        <div className="flex flex-col items-center gap-[8px] cursor-pointer"
                                             onClick={toggleBoostDetails}>
                                            <div
                                                className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                                                <RocketIconGrey/>
                                            </div>
                                            <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Boost</p>
                                        </div>
                                    ) : (
                                        <Link href={`/business/${params.id}/boost-business`}>
                                            <div className="flex flex-col items-center gap-[8px]">
                                                <div
                                                    className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                                                    <RocketIcon/>
                                                </div>
                                                <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Boost</p>
                                            </div>
                                        </Link>
                                    )
                                }
                                <Link href={`/business/${params.id}/edit-business`}>
                                    <div className="flex flex-col items-center gap-[8px]">
                                        <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                                            <PencilIcon/>
                                        </div>
                                        <div>
                                            <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Edit</p>
                                        </div>
                                    </div>
                                </Link>
                                <div className="flex flex-col items-center gap-[8px]">
                                    <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                                        <TrashIcon/>
                                    </div>
                                    <div>
                                        <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Delete</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center mt-[24px] gap-8">
                                <div className="flex flex-col items-center gap-[8px]">
                                    <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                                        <PhoneIcon/>
                                    </div>
                                    <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Call</p>
                                </div>
                                <div className="flex flex-col items-center gap-[8px]">
                                    <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                                        <MessageIcon/>
                                    </div>
                                    <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Send
                                        email</p>
                                </div>
                                <div className="flex flex-col items-center gap-[8px]">
                                    <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                                        <WebIcon/>
                                    </div>
                                    <div>
                                        <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Visit
                                            Website</p>
                                    </div>
                                </div>
                            </div>
                        )
                    }

                    <div className="w-[640px] rounded-tl-[24px] rounded-tr-[24px] bg-purple-tint-1">
                        <div className="pt-[16px] pr-[16px] pl-[16px] pb-[8px]">
                            <p className="font-semi-normal text-[14px]">Lemonade protects in-app transactions only. Use
                                caution outside the app</p>
                        </div>
                        <div className="rounded-tl-[24px] rounded-tr-[24px] bg-white">
                            <div className="pt-[16px] pr-[16px] pb-[24px] pl-[16px]">
                                <p className="font-semibold text-[16px]">About business</p>
                                <p className="font-normal text-[14px] mt-[12px] text-light-black">
                                    {data?.business?.description}
                                </p>
                                <p className="text-light-green font-semi-normal text-[14px]">More</p>
                                <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                                <p className="font-semibold text-[16px]">Business categories</p>
                                <p className="font-normal text-[14px] mt-[12px] text-light-black">
                                    {
                                        data?.business?.categories?.map((category: string, index: number) => (
                                            <span key={index}>
                                            {formatStringUCFirst(category)}
                                                {index < data?.business?.categories?.length - 1 && ', '}
                                        </span>
                                        ))
                                    }
                                </p>
                                <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                                <p className="font-semibold text-[16px]">Services</p>
                                <p className="font-normal text-[14px] mt-[12px] text-light-black">
                                    {
                                        data?.business?.services?.map((service: string, index: number) => (
                                            <span key={index}>
                                            {formatStringUCFirst(service)}
                                                {index < data?.business?.services?.length - 1 && ', '}
                                        </span>
                                        ))
                                    }
                                </p>
                                <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                                <p className="font-semibold text-[16px]">Portfolio Gallery</p>
                                <div className="flex flex-wrap gap-1">
                                    {
                                        data?.business?.gallery?.map((item: string, index: string) => (
                                            <Image src={item} alt="image_1"
                                                   className="w-[170.5px] h-[170.5px] rounded-[4px]" width={170.5}
                                                   height={170.5} key={index}/>
                                        ))
                                    }
                                </div>
                                <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                                <p className="font-semibold text-[16px]">Reviews</p>
                                <div className="flex justify-between">
                                    <div className="flex flex-col p-[12px] px-[20px] rounded-[12px] bg-light_grey">
                                        <div className="flex justify-center">
                                            <Image src={"/images/medal.png"} alt="medal" width={20.57} height={20.57}/>
                                        </div>
                                        <div>
                                            <p className="text-center text-[20px] font-bold">
                                                {formatDecimal(data?.business?.rating, 1)}/<span
                                                className="font-semi-normal">5</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="font-normal text-[12px] text-text-grey">{reviewData?.reviews.length} ratings</p>
                                        </div>
                                    </div>
                                    <RatingsBar max_count={reviewData?.reviews.length}
                                                ratings={reviewData?.subReviews}/>
                                </div>
                                {
                                    reviews.length > 0 ? (
                                        <>
                                            <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                                            {
                                                !reviewLoading && reviews.slice(0, displayCount).map((review, index) => (
                                                    <Reviews review={review} key={index}/>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <Image src={'/images/noReviews.png'} alt="no-reviews" width={114} height={98}/>
                                            <p className="font-semi-normal text-[14px] text-text-grey">No reviews
                                                yet</p>
                                        </div>
                                    )
                                }
                                {
                                    hasMoreReviews && (
                                        <div className="mt-[38px]">
                                            <p className="text-center font-semi-normal text-[16px] text-light-green cursor-pointer"
                                               onClick={loadMore}>Load more
                                                reviews</p>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </section>
                <VerifyBoost boost={boost} isOpen={isVerifyBoost} toggleMenu={toggleVerifyBoost}/>
                <ReviewModal isOpen={isOpen} toggleMenu={toggleMenu}/>
                <RequestServiceModal id={params.id} token={authToken} isOpen={isRequestOpen}
                                     toggleMenu={toggleRequestModal} services={data?.business?.services}/>
                <BoostDetailsModal boost={data?.business.boost} isOpen={boostDetails} toggleMenu={toggleBoostDetails}/>
            </section>
        </MainLayout>
    );
}

export default BusinessDetailsPage;