"use client";
import React from "react";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import { useAdminSettingsQuery } from "@/features/settings/queries";
import { PlatformSettingsForm } from "@/components/settings/PlatformSettingsForm";
import { MenuEditor } from "@/components/settings/MenuEditor";
import { usePolicyPagesQuery } from "@/features/pages/queries";
import { LegalPagesSection } from "@/components/settings/LegalPagesSection";
import { pageLinks } from "@/utils/pageLinks";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5 rounded-xl bg-white p-6">
      <div>
        <h2 className="font-semiBold text-body-l">{title}</h2>
        <p className="text-text-grey text-body-s">{description}</p>
      </div>
      {children}
    </section>
  );
}

function SettingsClient() {
  const { data: admin } = useCurrentAdminQuery();
  const { data: settings } = useAdminSettingsQuery();
  const canManage = Boolean(admin?.permissions?.includes(ADMIN_PERMISSIONS.settingsManage));
  const canEditPages = Boolean(admin?.permissions?.includes(ADMIN_PERMISSIONS.pagesEdit));
  const { data: pageData } = usePolicyPagesQuery({ enabled: canEditPages });
  const allowed = pageLinks.filter(
    (link) => !link.permission || admin?.permissions?.includes(link.permission),
  );

  if (!settings) return <p className="text-text-grey text-body-s p-5">Loading settings…</p>;

  const { platform, preferences } = settings;

  return (
    <div className="mt-6 flex flex-col gap-5 px-5 pb-8">
      <Section
        title="Branding, contact and data"
        description="The logo and name shown across the console and on the login page, the support contact shown to users, how long a session can sit idle, and how long data is kept."
      >
        {/* Remounts when the saved values change so the form shows what is stored. */}
        <PlatformSettingsForm
          key={`${platform.platform_name}|${platform.logo_url}|${platform.inactivity_timeout_minutes}|${platform.support_email}|${platform.support_phone}`}
          settings={platform}
          canManage={canManage}
        />
      </Section>
      {canEditPages && pageData && (
        <Section
          title="Legal pages"
          description="Terms and conditions, privacy policy, cookie policy and community guidelines. What you save shows on the website straight away."
        >
          <LegalPagesSection pages={pageData.pages} />
        </Section>
      )}
      <Section title="Menu" description="Arrange your own sidebar. This only changes what you see.">
        <MenuEditor key={JSON.stringify(preferences)} allowed={allowed} saved={preferences} />
      </Section>
    </div>
  );
}

export default SettingsClient;
