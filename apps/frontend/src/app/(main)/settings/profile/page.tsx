import type { Metadata } from "next";
import React from "react";
import { BackHeader } from "@/components/global/BackHeader";
import MainLayout from "@/components/layouts/MainLayout";
import ProfileSettingsClient from "./ProfileSettingsClient";

export const metadata: Metadata = { title: "Profile settings" };

export default function ProfileSettingsPage() {
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <BackHeader title="Profile settings" />
        <ProfileSettingsClient />
      </section>
    </MainLayout>
  );
}
