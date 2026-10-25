import type { Metadata } from "next";
import React from "react";
import { BackHeader } from "@/components/global/BackHeader";
import MainLayout from "@/components/layouts/MainLayout";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { helpServerApi } from "@/features/help/api.server";

export const metadata: Metadata = { title: "Privacy policy" };

// The text comes from the admin console, so edits show here straight away.
const PrivacyPage = async () => {
  const page = await helpServerApi.getPage("privacy_policy");

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <BackHeader title="Privacy Policy" />
        <section className="mt-4 flex flex-col items-center">
          <div className="laptop:w-160 laptop:bg-white flex w-full flex-col gap-4 rounded-xl p-6">
            <LegalDocument page={page} />
          </div>
        </section>
      </section>
    </MainLayout>
  );
};

export default PrivacyPage;
