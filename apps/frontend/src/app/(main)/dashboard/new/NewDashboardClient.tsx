"use client";
import React from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Briefcase as BusinessIcon,
  CalendarPlus as EventIcon,
  MessageCircle as ConnectIcon,
  Users as TribeIcon,
} from "lucide-react";
import MainLayout from "@/components/layouts/MainLayout";
import { FeedSection } from "@/components/feed/FeedSection";
import TribeCard from "@/components/dashboard/TribeCard";
import EventCard from "@/components/dashboard/EventCard";
import BusinessCard from "@/components/dashboard/BusinessCard";
import { BusinessesSkeleton, EventsSkeleton, TribesSkeleton } from "@/components/Skeletons";
import {
  useDashboardBusinessesQuery,
  useDashboardEventsQuery,
  useDashboardTribesQuery,
} from "@/features/dashboard/queries";
import { useNavigation } from "@/hooks/useNavigation";
import { formatName } from "@/lib/helper";
import { routes } from "@/lib/routes";
import type { RootState } from "@/redux/store";
import type { TribeInterface } from "@/interfaces/TribeInterface";
import type { EventInterface } from "@/interfaces/EventInterface";
import type { BusinessInterface } from "@/interfaces/BusinessInterface";

const QUICK_ACTIONS = [
  { label: "Create event", href: routes.EVENT_CREATE, Icon: EventIcon },
  { label: "Add business", href: routes.BUSINESS_ADD, Icon: BusinessIcon },
  { label: "Find tribes", href: routes.TRIBE, Icon: TribeIcon },
  { label: "Connect", href: routes.CONNECT, Icon: ConnectIcon },
] as const;

const Empty = ({ text }: { text: string }) => (
  <p className="text-body-s text-text-grey w-full rounded-2xl bg-gray-50 py-8 text-center">
    {text}
  </p>
);

/** A titled card holding one sideways row of content. */
const Rail = ({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-title-r font-sans font-semibold">{title}</h2>
      <Link
        href={href}
        className="bg-light-green-10 text-light-green text-body-s rounded-full px-3 py-1 font-semibold"
      >
        See all
      </Link>
    </div>
    <div className="scrollbar-hide -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-1">{children}</div>
  </section>
);

const NewDashboardClient = () => {
  const { push } = useNavigation();
  const { isLoggedIn, user } = useSelector((state: RootState) => state.auth);
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
  const firstName = user?.fullname ? formatName(user.fullname)?.[0] : "";

  return (
    <MainLayout>
      <div className="phone:px-10 laptop:px-6 mx-auto w-full max-w-300 px-4 pt-4">
        <section className="bg-gradient-light-green rounded-3xl p-5 shadow-sm ring-1 ring-black/5">
          <p className="text-primary-black text-title-xl font-sans font-semibold">
            Hello{firstName ? `, ${firstName}` : ""}
          </p>
          <p className="text-light-black text-body-s mt-1">
            See what is new in your tribes, events and businesses today.
          </p>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {QUICK_ACTIONS.map(({ label, href, Icon }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/80 px-1 py-3 text-center transition hover:bg-white"
              >
                <span className="bg-light-green-50 text-light-green flex h-10 w-10 items-center justify-center rounded-full">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-meta text-light-black font-semibold">{label}</span>
              </Link>
            ))}
          </div>
        </section>

        <div className="laptop:grid-cols-[minmax(0,1fr)_380px] mt-5 grid grid-cols-1 items-start gap-5">
          <section aria-labelledby="feed-title" className="min-w-0">
            <h2 id="feed-title" className="text-title-r font-sans font-semibold">
              Your feed
            </h2>
            <p className="text-body-s text-text-grey mb-3">
              Fresh posts from your tribes and beyond.
            </p>
            <FeedSection layout="list" showHeading={false} />
          </section>

          <aside className="laptop:sticky laptop:top-24 flex min-w-0 flex-col gap-5">
            <Rail title="Upcoming events" href={routes.EVENT}>
              {eventLoading ? (
                <EventsSkeleton count={3} />
              ) : events.length > 0 ? (
                events.map((event: EventInterface) => (
                  <div
                    key={event.id}
                    className="w-[70vw] max-w-64 shrink-0 cursor-pointer"
                    onClick={() => push(routes.EVENT_DETAIL(event.id))}
                  >
                    <EventCard event={event} />
                  </div>
                ))
              ) : (
                <Empty text="No upcoming events right now." />
              )}
            </Rail>

            <Rail title="Featured businesses" href={routes.BUSINESS}>
              {businessLoading ? (
                <BusinessesSkeleton count={2} />
              ) : businesses.length > 0 ? (
                businesses.map((business: BusinessInterface) => (
                  <div
                    key={business.id}
                    className="w-[78vw] max-w-72 shrink-0 cursor-pointer"
                    onClick={() => push(routes.BUSINESS_DETAIL(business.id))}
                  >
                    <BusinessCard business={business} />
                  </div>
                ))
              ) : (
                <Empty text="No businesses to show right now." />
              )}
            </Rail>

            <Rail title="Discover tribes" href={routes.TRIBE}>
              {tribeLoading ? (
                <TribesSkeleton count={2} />
              ) : tribes.length > 0 ? (
                tribes.map((tribe: TribeInterface) => (
                  <div key={tribe.id} className="w-[78vw] max-w-72 shrink-0">
                    <TribeCard tribe={tribe} />
                  </div>
                ))
              ) : (
                <Empty text="No tribes to discover right now." />
              )}
            </Rail>
          </aside>
        </div>
      </div>
    </MainLayout>
  );
};

export default NewDashboardClient;
