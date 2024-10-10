'use client'
import Link from "next/link"
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import TopNav from "@/components/Navigation/TopNav";
import Image from "next/image";
import TribeCard from "@/components/Dashboard/TribeCard";
import EventCard from "@/components/Dashboard/EventCard";
import BusinessCard from "@/components/Dashboard/BusinessCard";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {TribeInterface} from "@/interfaces/TribeInterface";
import {EventInterface} from "@/interfaces/EventInterface";
import {BusinessInterface} from "@/interfaces/BusinessInterface";


export default function SignupPage() {
    const router  = useRouter()

    const {authToken} = useSelector((state: any) => state.auth)

    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data } = useRequest("/tribes?type=discover", "GET", {}, true, getHeader())
    const { data: eventsData } = useRequest("/events", "GET", {}, true, getHeader())
    const { data: businessData } = useRequest("/business", "GET", {}, true, getHeader())

    return (
        <div className="bg-light_grey pb-10">
            <TopNav />
            <div className="min-h-screen">
                <section id="forums" className="bg-white p-4 rounded-lg m-4 mx-10">
                    <p className="font-sans font-semibold leading-[27px]">Tribe activities</p>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        {
                            data?.tribes.map((tribe: TribeInterface, idx: number) => (
                                <TribeCard tribe={tribe} key={idx} />
                            ))
                        }
                    </div>
                </section>
                <section id="events" className="bg-white p-4 rounded-lg m-4 mx-10">
                    <p className="font-sans font-semibold leading-[27px]">Trending events</p>
                    <div className="grid grid-cols-6 gap-2 mt-3">
                        {
                            eventsData?.events.map((event: EventInterface, idx: number) => (
                                <EventCard event={event} key={idx}  />
                            ))
                        }
                    </div>
                </section>
                <section id="business" className="bg-white p-4 pb-7 rounded-lg my-10 mx-10">
                    <p className="font-sans font-semibold leading-[27px]">Featured businesses</p>
                    <div className="grid grid-cols-4 gap-2 mt-3">
                        {
                            businessData?.businesses.map((business: BusinessInterface, idx:number) => (
                                <BusinessCard key={idx} business={business} />
                            ))
                        }
                    </div>
                </section>
            </div>
        </div>
    )
}