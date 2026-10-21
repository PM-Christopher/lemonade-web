import type { Metadata } from "next";
import React from "react";
import MainLayout from "@/components/layouts/MainLayout";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <SettingsClient />
      </section>
    </MainLayout>
  );
}
