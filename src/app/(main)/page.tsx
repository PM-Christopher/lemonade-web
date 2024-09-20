'use client'
import Link from "next/link"
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import TopNav from "@/components/Navigation/TopNav";
import Image from "next/image";
import TribeCard from "@/components/Dashboard/TribeCard";
import EventCard from "@/components/Dashboard/EventCard";
import BusinessCard from "@/components/Dashboard/BusinessCard";


export default function SignupPage() {
    const router  = useRouter()
    const [user, setUser] = useState({
        email: "",
        password: "",
        username:"",
    })

    return (
        <div className="bg-light_grey pb-10">
            <TopNav />
            <div className="min-h-screen">
                <section id="forums" className="bg-white p-4 rounded-lg m-4 mx-10">
                    <p className="font-sans font-semibold leading-[27px]">Tribe activities</p>
                    <div className="grid grid-cols-3 gap-2 mt-3">
                        <TribeCard />
                        <TribeCard />
                        <TribeCard />
                    </div>
                </section>
                <section id="events" className="bg-white p-4 rounded-lg m-4 mx-10">
                    <p className="font-sans font-semibold leading-[27px]">Trending events</p>
                    <div className="grid grid-cols-6 gap-2 mt-3">
                        <EventCard />
                        <EventCard />
                        <EventCard />
                        <EventCard />
                        <EventCard />
                        <EventCard />
                    </div>
                </section>
                <section id="business" className="bg-white p-4 pb-7 rounded-lg my-10 mx-10">
                    <p className="font-sans font-semibold leading-[27px]">Featured businesses</p>
                    <div className="grid grid-cols-4 gap-2 mt-3">
                        <BusinessCard />
                        <BusinessCard />
                        <BusinessCard />
                        <BusinessCard />
                    </div>
                </section>
            </div>
        </div>
    )
}