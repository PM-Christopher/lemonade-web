import type { Metadata } from "next";
import React from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import MainLayout from "@/components/layouts/MainLayout";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="laptop:px-16 flex items-center justify-between bg-white p-2 px-4">
          <div className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1">
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">User profile</p>
          </div>
        </div>
        <SettingsClient />
      </section>
    </MainLayout>
  );
}
