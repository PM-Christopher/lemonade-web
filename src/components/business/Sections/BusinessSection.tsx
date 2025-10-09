"use client"
import React, {useEffect, useState} from 'react';
import BusinessCarousel from "@/components/global/BusinessCarousel";
import AllBusinessCard from "@/components/business/AllBusinessCard";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {Spinner} from "evergreen-ui";
import {BusinessInterface} from "@/interfaces/BusinessInterface";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {axiosInstance} from "@/lib/axiosInstane";
import PaymentConfirmModal from "@/components/business/Modals/PaymentConfirmModal";
import {useAppDispatch} from "@/redux/hook";
import {addJob, getBusinesses} from "@/features/business/business.slice";
import {RootState} from "@/redux/store";
import {AllBusinessSkeleton, BusinessCarouselSkeleton} from "@/components/Skeletons";

const BusinessSection = () => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const trxref = searchParams.get("trxref")
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [isVerifyJob, setIsVerifyJob] = useState(false)
    const {job} = useSelector((state: any) => state.business)
    const {authToken} = useSelector((state: any) => state.auth)
    const { businesses, loading } = useSelector((state: RootState) => state.business);
    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const toggleVerifyJob = () => {
        setIsVerifyJob(!isVerifyJob)
    }

    useEffect(() => {
        dispatch(getBusinesses({ token: authToken }))
    }, [dispatch]);

    useEffect(() => {
        const verifyPayment = async () => {
            if (trxref) {
                setVerifyLoading(true);
                try {
                    const { data } = await axiosInstance.patch(`business/verify-payment?reference=${trxref}`, {}, getHeader());
                    if (data.status) {
                        if (data.data.verified) {
                            setIsVerifyJob(true)
                            dispatch(addJob({job: data.data.job}))
                        }
                    }
                } catch (error) {
                } finally {
                    setVerifyLoading(false);
                }
            }
        };
        verifyPayment();
    }, [trxref]);

    const { data } = useRequest("/business")

    return (
        <section className="mt-4 flex flex-col items-center">
            <div className="p-[16px] w-full laptop:w-[1312px] rounded-0 laptop:rounded-[12px] gap-[12px] bg-light-green-50">
                <p className="font-semibold text-[18px]">Featured</p>
                {
                    loading ? (
                        <BusinessCarouselSkeleton count={4} />
                    ) : data?.featured?.length > 0 ? (
                        <BusinessCarousel
                            businesses={data.featured}
                            showDots={false}
                            showArrows={false}
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 text-gray-400"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9V5.25m4.5 3.75V5.25M3 9h18M4.5 19.5h15a1.5 1.5 0 001.5-1.5V9H3v9a1.5 1.5 0 001.5 1.5z" />
                                    </svg>
                                </div>
                                <p className="text-base font-semibold text-gray-700">No Featured Businesses</p>
                                <p className="mt-1 text-sm text-gray-500">Check back later — new businesses may be added soon.</p>
                            </div>
                        </div>
                    )
                }

            </div>
            <div className="p-[16px] rounded-[12px] w-full laptop:w-[1312px] shadow-sm mt-[24px]">
                <p className="font-semibold text-[18px]">All business</p>
                <div className="grid grid-cols-1 laptop:grid-cols-4 gap-2">
                    {
                        loading ? (
                            <AllBusinessSkeleton count={4} />
                        ) : (
                            businesses?.map((business: BusinessInterface, index: number) => (
                                <Link href={`/business/${business.id}`} key={index}>
                                    <AllBusinessCard business={business} />
                                </Link>
                            ))
                        )
                    }
                </div>
            </div>

            <PaymentConfirmModal isOpen={isVerifyJob} toggleMenu={toggleVerifyJob} job={job} />
        </section>
    );
}

export default BusinessSection;