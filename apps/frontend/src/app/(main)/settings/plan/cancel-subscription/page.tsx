import type { Metadata } from "next";
import React from "react";
import { BackHeader } from "@/components/global/BackHeader";
import MainLayout from "@/components/layouts/MainLayout";
import CancelSubscriptionClient from "./CancelSubscriptionClient";

export const metadata: Metadata = { title: "Cancel subscription" };

export default function CancelSubscriptionPage() {
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <BackHeader title="Cancel subscription" />
        <CancelSubscriptionClient />
      </section>
    </MainLayout>
  );
}
