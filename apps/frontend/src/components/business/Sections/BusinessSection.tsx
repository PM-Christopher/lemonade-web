"use client"
import React, {useEffect, useState} from 'react';
import BusinessCarousel from "@/components/global/BusinessCarousel";
import AllBusinessCard from "@/components/business/AllBusinessCard";
import {useSelector} from "react-redux";
import {Spinner} from "evergreen-ui";
import {BusinessInterface} from "@/interfaces/BusinessInterface";
import Link from "next/link";
import {useRouter, useSearchParams} from "next/navigation";
import {axiosInstance} from "@/lib/axiosInstane";
import PaymentConfirmModal from "@/components/business/Modals/PaymentConfirmModal";
import {useAppDispatch} from "@/redux/hook";
import {setSelectedJob} from "@/redux/tempSlice";
import {RootState} from "@/redux/store";
import {AllBusinessSkeleton, BusinessCarouselSkeleton} from "@/components/Skeletons";

interface BusinessSectionProps {
    businesses: BusinessInterface[];
    featured: BusinessInterface[];
    loading: boolean;
}

const BusinessSection: React.FC<BusinessSectionProps> = ({businesses, featured, loading}) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParams = useSearchParams()
    const trxref = searchParams.get("trxref")
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [isVerifyJob, setIsVerifyJob] = useState(false)
    const {selectedJob: job} = useSelector((state: RootState) => state.temp)

    const toggleVerifyJob = () => {
        setIsVerifyJob(!isVerifyJob)
    }

    useEffect(() => {
        const verifyPayment = async () => {
            if (trxref) {
                setVerifyLoading(true);
                try {
                    const {data} = await axiosInstance.patch(`business/verify-payment?reference=${trxref}`);
                    if (data.status) {
                        if (data.data.verified) {
                            // Remove trxref from URL
                            const params = new URLSearchParams(searchParams);
                            params.delete('trxref');
                            params.delete('reference');
                            setIsVerifyJob(true)
                            dispatch(setSelectedJob(data.data.job))
                            // Update the URL without reloading
                            router.replace(`?${params.toString()}`);
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

    return (
        <section className="mt-4 flex flex-col items-center px-4 sm:px-6 lg:px-8">
            {/* Featured Section */}
            <div className="p-4 w-full max-w-[1312px] rounded-none sm:rounded-xl gap-3 bg-light-green-50">
                <p className="font-semibold text-lg sm:text-xl mb-3">Featured</p>
                {
                    loading ? (
                        <BusinessCarouselSkeleton count={4}/>
                    ) : featured?.length > 0 ? (
                        <BusinessCarousel
                            businesses={featured}
                            showDots={false}
                            showArrows={false}
                        />
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex flex-col items-center text-center max-w-md">
                                <div
                                    className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 text-gray-400"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M9.75 9V5.25m4.5 3.75V5.25M3 9h18M4.5 19.5h15a1.5 1.5 0 001.5-1.5V9H3v9a1.5 1.5 0 001.5 1.5z"/>
                                    </svg>
                                </div>
                                <p className="text-base font-semibold text-gray-700">No Featured Businesses</p>
                                <p className="mt-1 text-sm text-gray-500">Check back later — new businesses may be added
                                    soon.</p>
                            </div>
                        </div>
                    )
                }
            </div>

            {/* All Business Sections */}
            <div className="p-4 rounded-xl w-full max-w-[1312px] shadow-sm mt-6 bg-white">
                <p className="font-semibold text-lg sm:text-xl mb-4">All businesses</p>
                <div
                    className={`grid gap-2 ${
                        !loading && (!businesses || businesses.length === 0)
                            ? "grid-cols-1"
                            : "grid-cols-1 phone:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-4"
                    }`}
                >
                    {loading ? (
                        <AllBusinessSkeleton count={4}/>
                    ) : businesses?.length > 0 ? (
                        businesses.map((business: BusinessInterface, index: number) => (
                            <Link href={`/business/${business.id}`} key={index}>
                                <AllBusinessCard business={business}/>
                            </Link>
                        ))
                    ) : (
                        <div
                            className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex flex-col items-center text-center max-w-md">
                                <div
                                    className="w-12 h-12 mb-3 flex items-center justify-center rounded-full bg-gray-100">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-6 h-6 text-gray-400"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.75 9V5.25m4.5 3.75V5.25M3 9h18M4.5 19.5h15a1.5 1.5 0 001.5-1.5V9H3v9a1.5 1.5 0 001.5 1.5z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-base font-semibold text-gray-700">No Businesses</p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Check back later — new businesses may be added soon.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <PaymentConfirmModal isOpen={isVerifyJob} toggleMenu={toggleVerifyJob} job={job}/>
        </section>
    );
}

export default BusinessSection;