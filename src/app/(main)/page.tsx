"use client";
import React, { useEffect, useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import TribeCard from "@/components/dashboard/TribeCard";
import EventCard from "@/components/dashboard/EventCard";
import BusinessCard from "@/components/dashboard/BusinessCard";
import { useSelector } from "react-redux";
import { useRequest } from "@/hooks/useRequest";
import { TribeInterface } from "@/interfaces/TribeInterface";
import { EventInterface } from "@/interfaces/EventInterface";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import MainLayout from "@/components/layouts/MainLayout";
import BottomNav from "@/components/navigation/BottomNav";
import { useMediaQuery } from "react-responsive";

export default function DashboardPage() {
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });
  const { authToken } = useSelector((state: any) => state.auth);
  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };

  const { data } = useRequest(
    "/tribes?type=discover",
    "GET",
    {},
    true,
    getHeader()
  );
  const { data: eventsData } = useRequest(
    "/events",
    "GET",
    {},
    true,
    getHeader()
  );
  const { data: businessData } = useRequest(
    "/business",
    "GET",
    {},
    true,
    getHeader()
  );

  console.log("Events Data", eventsData)

  return (
    <MainLayout>
      <div className="w-full">
        <section id="forums" className="bg-white p-4 rounded-lg m-4 mx-10">
          <p className="font-sans font-semibold leading-[27px]">
            Tribe activities
          </p>
          <div className="flex overflow-x-auto mt-3 space-x-2 scrollbar-hide py-4 shadow-none">
            {data?.tribes.map((tribe: TribeInterface, idx: number) => (
              <div className="w-[422px]" key={idx}>
                <TribeCard tribe={tribe} />
              </div>
            ))}
          </div>
        </section>
        <section id="events" className="bg-white p-4 rounded-lg m-4 mx-10">
          <p className="font-sans font-semibold leading-[27px]">
            Trending events
          </p>
          <div className="grid grid-cols-6 gap-2 mt-3">
            {eventsData?.upcoming.map((event: EventInterface, idx: number) => (
              <EventCard event={event} key={idx} />
            ))}
          </div>
        </section>
        <section
          id="business"
          className="bg-white p-4 pb-7 rounded-lg my-10 mx-10"
        >
          <p className="font-sans font-semibold leading-[27px]">
            Featured businesses
          </p>
          <div className="flex overflow-x-auto mt-3 space-x-2 scrollbar-hide py-4 shadow-none">
            {businessData?.businesses.map(
              (business: BusinessInterface, idx: number) => (
                <div className="w-[343px] tablet:w-[422px]" key={idx}>
                  <BusinessCard key={idx} business={business} />
                </div>
              )
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
