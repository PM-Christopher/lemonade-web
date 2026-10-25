import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { PublicShell } from "@/components/legal/PublicShell";
import { helpServerApi } from "@/features/help/api.server";

export const metadata: Metadata = { title: "Privacy policy" };

export default async function PrivacyPage() {
  const page = await helpServerApi.getPage("privacy_policy");

  return (
    <PublicShell title="Privacy policy">
      <LegalDocument page={page} />
    </PublicShell>
  );
}
