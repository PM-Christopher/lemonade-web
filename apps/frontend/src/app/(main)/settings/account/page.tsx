import type { Metadata } from "next";
import React from "react";
import { BackHeader } from "@/components/global/BackHeader";
import MainLayout from "@/components/layouts/MainLayout";
import AccountSettingsClient from "./AccountSettingsClient";

export const metadata: Metadata = { title: "Account settings" };

export default function AccountSettingsPage() {
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <BackHeader title="Account settings" />
        <AccountSettingsClient />
      </section>
    </MainLayout>
  );
}
