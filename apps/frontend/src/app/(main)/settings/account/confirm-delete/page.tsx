import type { Metadata } from "next";
import React from "react";
import { BackHeader } from "@/components/global/BackHeader";
import MainLayout from "@/components/layouts/MainLayout";
import ConfirmDeleteClient from "./ConfirmDeleteClient";

export const metadata: Metadata = { title: "Delete account" };

export default function ConfirmDeletePage() {
  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <BackHeader title="Delete account" />
        <ConfirmDeleteClient />
      </section>
    </MainLayout>
  );
}
