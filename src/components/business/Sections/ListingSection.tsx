import React, {useEffect} from 'react';
import empty_business from "@/image/business_empty.png"
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useAppDispatch} from "@/redux/hook";
import {getListings} from "@/features/business/business.slice";
import {BusinessInterface} from "@/interfaces/BusinessInterface";
import {AllBusinessSkeleton} from "@/components/Skeletons";
import Link from "next/link";
import AllBusinessCard from "@/components/business/AllBusinessCard";

interface ListingInterface {
    businesses: BusinessInterface[]
    loading: boolean
}

const ListingSection: React.FC<ListingInterface> = ({businesses, loading}) => {
    const router = useRouter()

    return (
        <section className="mt-4 flex flex-col items-center px-4 sm:px-6 lg:px-8">
            {loading ? (
                // Loading State
                <div className="p-4 rounded-xl w-full max-w-[1312px] shadow-sm mt-6 bg-white">
                    <div className="h-7 w-32 bg-gray-200 rounded animate-pulse mb-4" />
                    <div className="grid grid-cols-1 laptop:grid-cols-4 gap-2">
                        <AllBusinessSkeleton count={8} />
                    </div>
                </div>
            ) : businesses?.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                    <div className="flex flex-col items-center max-w-md text-center">
                        <Image
                            src="/images/business_empty.png"
                            alt="No businesses"
                            width={160}
                            height={148}
                            className="mb-6"
                        />
                        <h2 className="font-semibold text-xl sm:text-2xl mb-3">List your business</h2>
                        <p className="font-normal text-sm sm:text-base text-gray-600 mb-6">
                            Get started by adding your business, and get discovered by potential clients.
                        </p>
                        <Button
                            className="bg-gradient-green h-12 rounded-xl px-8 sm:px-12 hover:opacity-90 transition-opacity shadow-green-inset hover:shadow-green-inset-strong"
                            onClick={() => router.push("/business/add-business")}
                        >
                            <span className="font-semi-normal text-base">Add business</span>
                        </Button>
                    </div>
                </div>
            ) : (
                // Business List
                <div className="p-4 rounded-xl w-full max-w-[1312px] shadow-sm mt-6 bg-white">
                    <h2 className="font-semibold text-lg sm:text-xl mb-4 font-sans">
                        All Listings
                    </h2>
                    <div className="grid grid-cols-1 laptop:grid-cols-4 gap-2">
                        {businesses.map((business: BusinessInterface) => (
                            <Link
                                href={`/business/${business.id}`}
                                key={business.id}
                                className="transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <AllBusinessCard business={business} />
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default ListingSection;