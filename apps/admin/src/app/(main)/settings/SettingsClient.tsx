"use client";
import React from "react";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import { useAdminSettingsQuery } from "@/features/settings/queries";
import { PlatformSettingsForm } from "@/components/settings/PlatformSettingsForm";
import { MenuEditor } from "@/components/settings/MenuEditor";
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
  const allowed = pageLinks.filter(
    (link) => !link.permission || admin?.permissions?.includes(link.permission),
  );

  if (!settings) return <p className="text-text-grey text-body-s p-5">Loading settings…</p>;

  const { platform, preferences } = settings;

  return (
    <div className="mt-6 flex flex-col gap-5 px-5 pb-8">
      <Section
        title="Branding and session"
        description="The logo and name shown across the console and on the login page, and how long a session can sit idle."
      >
        {/* Remounts when the saved values change so the form shows what is stored. */}
        <PlatformSettingsForm
          key={`${platform.platform_name}|${platform.logo_url}|${platform.inactivity_timeout_minutes}`}
          settings={platform}
          canManage={canManage}
        />
      </Section>
      <Section title="Menu" description="Arrange your own sidebar. This only changes what you see.">
        <MenuEditor key={JSON.stringify(preferences)} allowed={allowed} saved={preferences} />
      </Section>
    </div>
  );
}

export default SettingsClient;
