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

const BusinessSection = () => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const trxref = searchParams.get("trxref")
    const [verifyLoading, setVerifyLoading] = useState(false)
    const [isVerifyJob, setIsVerifyJob] = useState(false)
    const {job} = useSelector((state: any) => state.business)
    const {authToken} = useSelector((state: any) => state.auth)
    const { businesses } = useSelector((state: RootState) => state.business);
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
                console.log({trxref})
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

    const { data, loading } = useRequest("/business", "GET", {}, true, getHeader())

    return (
        <section className="mt-4 flex flex-col items-center">
            <div className="p-[16px] w-full laptop:w-[1312px] rounded-0 laptop:rounded-[12px] gap-[12px] bg-light-green-50">
                <p className="font-semibold text-[18px]">Featured</p>
                {
                    loading ? (
                        <div className="flex justify-center items-center">
                            <Spinner/>
                        </div>
                    ) : (
                        <BusinessCarousel businesses={data?.featured} showDots={false} showArrows={false}/>
                    )
                }
            </div>
            <div className="p-[16px] rounded-[12px] w-full laptop:w-[1312px] shadow-sm mt-[24px]">
                <p className="font-semibold text-[18px]">All business</p>
                <div className="grid grid-cols-1 laptop:grid-cols-4 gap-2">
                    {
                        loading ? (
                            <div className="flex justify-center items-center">
                                <Spinner/>
                            </div>
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