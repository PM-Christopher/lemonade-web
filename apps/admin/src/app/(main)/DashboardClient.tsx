"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import DateRangePicker, { type DateRange } from "@/components/global/DateRangePicker";
import MainLayout from "@/components/layouts/MainLayout";
import DataCard from "@/components/global/DataCard";
import { useSelector } from "react-redux";
import { useDashboardMetricsQuery } from "@/features/dashboard/queries";
import { RootState } from "@/redux/store";

function DashboardClient() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [range, setRange] = useState<DateRange | null>(null);
  const { data: metrics } = useDashboardMetricsQuery({
    enabled: isLoggedIn,
    from: range ? dayjs(range.start).format("YYYY-MM-DD") : undefined,
    to: range ? dayjs(range.end).format("YYYY-MM-DD") : undefined,
  });

  const data = [
    { title: "Total Users", value: metrics?.total_users || 0, isPrice: false },
    {
      title: "Total Subscription Revenue",
      value: metrics?.total_subscription_revenue || 0,
      isPrice: true,
    },
    {
      title: "Total Tickets Revenue",
      value: metrics?.total_tickets_revenue || 0,
      isPrice: true,
    },
    {
      title: "Total Business Boosting Revenue",
      value: metrics?.total_business_boosting_revenue || 0,
      isPrice: true,
    },
    {
      title: "Total Event Promotion Revenue",
      value: metrics?.total_event_promotion_revenue || 0,
      isPrice: true,
    },
    {
      title: "Total Referral Earnings",
      value: metrics?.total_referral_earnings || 0,
      isPrice: true,
    },
    {
      title: "Total Affiliate Earnings",
      value: metrics?.total_affiliate_earnings || 0,
      isPrice: true,
    },
    {
      title: "Total Paid Tribe Earnings",
      value: metrics?.total_paid_tribe_earnings || 0,
      isPrice: true,
    },
    {
      title: "Total Paid Tribe Commissions",
      value: metrics?.total_paid_tribe_commissions || 0,
      isPrice: true,
    },
    {
      title: "Total Membership Plan Users",
      value: metrics?.total_membership_plan_users || 0,
      isPrice: false,
    },
    {
      title: "Total Free Plan Users",
      value: metrics?.total_free_plan_users || 0,
      isPrice: false,
    },
    {
      title: "Total Number of Referrers",
      value: metrics?.total_number_of_referrers || 0,
      isPrice: false,
    },
    {
      title: "Total Number of Referrals",
      value: metrics?.total_number_of_referrals || 0,
      isPrice: false,
    },
    {
      title: "Total Tribes",
      value: metrics?.total_tribes || 0,
      isPrice: false,
    },
    {
      title: "Total Paid Tribes",
      value: metrics?.total_paid_tribes || 0,
      isPrice: false,
    },
    {
      title: "Total Businesses",
      value: metrics?.total_business || 0,
      isPrice: false,
    },
    {
      title: "Total Events",
      value: metrics?.total_events || 0,
      isPrice: false,
    },
    {
      title: "Total Boosted Businesses",
      value: metrics?.total_boosted_business || 0,
      isPrice: false,
    },
    {
      title: "Total Promoted Events",
      value: metrics?.total_promoted_events || 0,
      isPrice: false,
    },
  ];

  return (
    <MainLayout>
      <div className="mt-5 flex flex-col gap-5 px-10">
        <div className={"w-fit"}>
          <DateRangePicker value={range} onChange={setRange} />
        </div>
        <div className={"grid grid-cols-4 gap-5"}>
          {data.map((item, index) => (
            <DataCard
              styles={"w-69 h-33"}
              isPrice={item.isPrice}
              key={index}
              title={item.title}
              count={item.value}
            />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default DashboardClient;
