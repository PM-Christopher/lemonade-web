"use client";
import React from "react";
import TribeCard from "@/components/dashboard/TribeCard";
import EventCard from "@/components/dashboard/EventCard";
import { useSelector } from "react-redux";
import { TribeInterface } from "@/interfaces/TribeInterface";
import { EventInterface } from "@/interfaces/EventInterface";
import MainLayout from "@/components/layouts/MainLayout";
import { RootState } from "@/redux/store";
import {
  useDashboardBusinessesQuery,
  useDashboardEventsQuery,
  useDashboardTribesQuery,
} from "@/features/dashboard/queries";
import { BusinessInterface } from "@/interfaces/BusinessInterface";
import BusinessCard from "@/components/dashboard/BusinessCard";
import { BusinessesSkeleton, EventsSkeleton, TribesSkeleton } from "@/components/Skeletons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChevronRight from "@/images/icons/chevronRight.svg";

const SeeMore = ({ href }: { href: string }) => (
  <Link
    href={href}
    className="text-light-green text-body-s flex shrink-0 items-center gap-1 font-sans font-semibold"
  >
    See more
    <ChevronRight className="h-4 w-4" />
  </Link>
);

const DashboardClient = () => {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data: tribesData, isLoading: tribeLoading } = useDashboardTribesQuery({
    enabled: isLoggedIn,
  });
  const { data: eventsData, isLoading: eventLoading } = useDashboardEventsQuery({
    enabled: isLoggedIn,
  });
  const { data: businessesData, isLoading: businessLoading } = useDashboardBusinessesQuery({
    enabled: isLoggedIn,
  });
  const tribes = tribesData?.tribes ?? [];
  const events = eventsData?.events ?? [];
  const businesses = businessesData?.businesses ?? [];

  return (
    <MainLayout>
      {/*<NotificationToast payload={{title: "This is a test", body: "This is the body of the test"}} />*/}
      <div className="w-full">
        <section id="forums" className="phone:mx-10 m-4 mx-4 rounded-lg bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-title-r font-sans font-semibold">Tribe activities</p>
            <SeeMore href="/tribe" />
          </div>
          <div className="scrollbar-hide mt-3 flex gap-3 overflow-x-auto py-4 shadow-none">
            {tribeLoading ? (
              <TribesSkeleton count={4} />
            ) : tribes.length > 0 ? (
              tribes.map((tribe: TribeInterface, idx: number) => (
                <div className="phone:w-[422px] w-[80vw] max-w-[422px] shrink-0" key={idx}>
                  <TribeCard tribe={tribe} />
                </div>
              ))
            ) : (
              <div className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-10">
                <p className="text-body-s font-sans font-medium text-gray-600">
                  No featured tribes available right now.
                </p>
                <p className="text-meta mt-1 text-gray-400">Check back later for updates.</p>
              </div>
            )}
          </div>
        </section>
        <section id="events" className="phone:mx-10 m-4 mx-4 rounded-lg bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-title-r font-sans font-semibold">Trending events</p>
            <SeeMore href="/event" />
          </div>
          <div className="scrollbar-hide phone:max-w-[1280px] mt-3 flex gap-4 overflow-x-auto py-4">
            {eventLoading ? (
              <EventsSkeleton count={6} />
            ) : events?.length > 0 ? (
              events?.map((event: EventInterface, idx: number) => (
                <div
                  className="phone:w-[200px] w-[78vw] shrink-0 cursor-pointer"
                  key={idx}
                  onClick={() => router.push(`/event/${event.id}`)}
                >
                  <EventCard event={event} />
                </div>
              ))
            ) : (
              <div className="col-span-6 flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-10">
                <p className="text-body-s font-sans font-medium text-gray-600">
                  No trending events available right now.
                </p>
                <p className="text-meta mt-1 text-gray-400">Check back later for updates.</p>
              </div>
            )}
          </div>
        </section>
        <section id="business" className="phone:mx-10 mx-4 my-10 rounded-lg bg-white p-4 pb-7">
          <div className="flex items-center justify-between gap-4">
            <p className="text-title-r font-sans font-semibold">Featured businesses</p>
            <SeeMore href="/business" />
          </div>
          <div className="scrollbar-hide mt-3 flex gap-4 overflow-x-auto py-4 shadow-none">
            {businessLoading ? (
              <BusinessesSkeleton count={3} />
            ) : businesses?.length > 0 ? (
              businesses?.map((business: BusinessInterface, idx: number) => (
                <div
                  className="tablet:w-[320px] w-[78vw] max-w-[320px] shrink-0 cursor-pointer"
                  key={idx}
                  onClick={() => router.push(`/business/${business.id}`)}
                >
                  <BusinessCard key={idx} business={business} />
                </div>
              ))
            ) : (
              <div className="flex w-full flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 py-10">
                <p className="text-body-s font-sans font-medium text-gray-600">
                  No businesses available right now.
                </p>
                <p className="text-meta mt-1 text-gray-400">Check back later for updates.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default DashboardClient;
