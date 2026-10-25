import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { PublicShell } from "@/components/legal/PublicShell";
import { helpServerApi } from "@/features/help/api.server";

export const metadata: Metadata = { title: "Terms and conditions" };

export default async function TermsPage() {
  const page = await helpServerApi.getPage("terms_and_conditions");

  return (
    <PublicShell title="Terms and conditions">
      <LegalDocument page={page} />
    </PublicShell>
  );
}
