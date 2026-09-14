"use client";
import React from "react";
import TribeCard from "@/components/dashboard/TribeCard";
import EventCard from "@/components/dashboard/EventCard";
import {useSelector} from "react-redux";
import {TribeInterface} from "@/interfaces/TribeInterface";
import {EventInterface} from "@/interfaces/EventInterface";
import MainLayout from "@/components/layouts/MainLayout";
import {useMediaQuery} from "react-responsive";
import {RootState} from "@/redux/store";
import {useDashboardBusinessesQuery, useDashboardEventsQuery, useDashboardTribesQuery} from "@/features/dashboard/queries";
import {BusinessInterface} from "@/interfaces/BusinessInterface";
import BusinessCard from "@/components/dashboard/BusinessCard";
import {BusinessesSkeleton, EventsSkeleton, TribesSkeleton} from "@/components/Skeletons";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function DashboardPage() {
    const isMobile = useMediaQuery({query: "(max-width: 640px)"});
    const router = useRouter()
    const {isLoggedIn} = useSelector((state: RootState) => state.auth)
    const {data: tribesData, isLoading: tribeLoading} = useDashboardTribesQuery({enabled: isLoggedIn});
    const {data: eventsData, isLoading: eventLoading} = useDashboardEventsQuery({enabled: isLoggedIn});
    const {data: businessesData, isLoading: businessLoading} = useDashboardBusinessesQuery({enabled: isLoggedIn});
    const tribes = tribesData?.tribes ?? [];
    const events = eventsData?.events ?? [];
    const businesses = businessesData?.businesses ?? [];

    return (
        <MainLayout>
            {/*<NotificationToast payload={{title: "This is a test", body: "This is the body of the test"}} />*/}
            <div className="w-full">
                <section id="forums" className="bg-white p-4 rounded-lg m-4 mx-10">
                    <p className="font-sans font-semibold leading-[27px]">
                        Tribe activities
                    </p>
                    <div className="flex overflow-x-auto mt-3 space-x-2 scrollbar-hide py-4 shadow-none">
                        {
                            tribeLoading ? (
                                <TribesSkeleton count={4}/>
                            ) : (
                                tribes.length > 0 ? (
                                    tribes.map((tribe: TribeInterface, idx: number) => (
                                        <div className="w-[422px]" key={idx}>
                                            <TribeCard tribe={tribe}/>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full py-10 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-gray-600 font-sans text-sm font-medium">
                                            No featured tribes available right now.
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            Check back later for updates.
                                        </p>
                                    </div>
                                )
                            )
                        }
                    </div>
                </section>
                <section id="events" className="bg-white p-4 rounded-lg m-4 mx-10">
                    <p className="font-sans font-semibold leading-[27px]">
                        Trending events
                    </p>
                    <div className="grid grid-cols-6 gap-2 mt-3">
                        {
                            eventLoading ? (
                                <EventsSkeleton count={6}/>
                            ) : (
                                events?.length > 0 ? (
                                    events?.map((event: EventInterface, idx: number) => (
                                        <div
                                            className={"cursor-pointer"}
                                            key={idx}
                                            onClick={() => router.push(`/event/${event.id}`)}
                                        >
                                            <EventCard event={event} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-6 flex flex-col items-center justify-center py-10 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-gray-600 font-sans text-sm font-medium">
                                            No trending events available right now.
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            Check back later for updates.
                                        </p>
                                    </div>
                                )
                            )
                        }
                    </div>
                </section>
                <section id="business" className="bg-white p-4 pb-7 rounded-lg my-10 mx-10">
                    <p className="font-sans font-semibold leading-[27px]">
                        Featured businesses
                    </p>
                    <div className="flex overflow-x-auto mt-3 space-x-2 scrollbar-hide py-4 shadow-none">
                        {
                            businessLoading ? (
                                <BusinessesSkeleton count={3}/>
                            ) : (
                                businesses?.length > 0 ? (
                                    businesses?.map(
                                        (business: BusinessInterface, idx: number) => (
                                            <div
                                                className="w-[343px] tablet:w-[422px] cursor-pointer"
                                                key={idx}
                                                onClick={() => router.push(`/business/${business.id}`)}
                                            >
                                                <BusinessCard key={idx} business={business}/>
                                            </div>
                                        )
                                    )
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full py-10 bg-gray-50 rounded-lg border border-gray-200">
                                        <p className="text-gray-600 font-sans text-sm font-medium">
                                            No businesses available right now.
                                        </p>
                                        <p className="text-gray-400 text-xs mt-1">
                                            Check back later for updates.
                                        </p>
                                    </div>
                                )
                            )
                        }
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
