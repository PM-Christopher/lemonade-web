import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { PublicShell } from "@/components/legal/PublicShell";
import { helpServerApi } from "@/features/help/api.server";

export const metadata: Metadata = { title: "Cookie policy" };

export default async function CookiesPage() {
  const page = await helpServerApi.getPage("cookie_policy");

  return (
    <PublicShell title="Cookie policy">
      <LegalDocument page={page} />
    </PublicShell>
  );
}
