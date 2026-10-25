"use client";
import React, { useState } from "react";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import { useAdminSettingsQuery } from "@/features/settings/queries";
import { usePolicyPagesQuery } from "@/features/pages/queries";
import { PlatformSettingsForm } from "@/components/settings/PlatformSettingsForm";
import { LegalPagesSection } from "@/components/settings/LegalPagesSection";
import { MenuEditor } from "@/components/settings/MenuEditor";
import { FaqManager } from "@/components/helpCenter/FaqManager";
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

type TabKey = "branding" | "legal" | "faq" | "help" | "menu";

function SettingsClient() {
  const { data: admin } = useCurrentAdminQuery();
  const { data: settings } = useAdminSettingsQuery();
  const permissions = admin?.permissions;
  const canManage = Boolean(permissions?.includes(ADMIN_PERMISSIONS.settingsManage));
  const canEditPages = Boolean(permissions?.includes(ADMIN_PERMISSIONS.pagesEdit));
  const canManageFaqs = Boolean(permissions?.includes(ADMIN_PERMISSIONS.faqsManage));
  const { data: pageData } = usePolicyPagesQuery({ enabled: canEditPages });
  const allowed = pageLinks.filter(
    (link) => !link.permission || permissions?.includes(link.permission),
  );
  const [tab, setTab] = useState<TabKey>("branding");

  // Branding, Help Center and Menu Management are open to every admin. The others need their own permission.
  const tabs: { key: TabKey; label: string }[] = [
    { key: "branding", label: "Branding" },
    ...(canEditPages ? [{ key: "legal" as const, label: "Legal Pages" }] : []),
    ...(canManageFaqs ? [{ key: "faq" as const, label: "FAQ" }] : []),
    { key: "help", label: "Help Center" },
    { key: "menu", label: "Menu Management" },
  ];
  const active = tabs.some((item) => item.key === tab) ? tab : "branding";

  if (!settings) return <p className="text-text-grey text-body-s p-5">Loading settings…</p>;

  const { platform, preferences } = settings;
  // Remounts when the saved values change so each form shows what is stored.
  const formKey = [
    platform.platform_name,
    platform.logo_url,
    platform.inactivity_timeout_minutes,
    platform.support_email,
    platform.support_phone,
    platform.audit_retention_days,
    platform.user_activity_retention_days,
    platform.account_deletion_grace_days,
  ].join("|");

  return (
    <div className="mt-6 flex flex-col gap-5 px-5 pb-8">
      <div role="tablist" aria-label="Settings" className="flex max-w-full gap-2 overflow-x-auto">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`settings-tab-${item.key}`}
            aria-selected={item.key === active}
            aria-controls={`settings-panel-${item.key}`}
            className={`text-body-s shrink-0 cursor-pointer rounded-lg px-4 py-2 font-medium whitespace-nowrap ${item.key === active ? "bg-white shadow-sm" : "text-text-grey"}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`settings-panel-${active}`}
        aria-labelledby={`settings-tab-${active}`}
        className="flex flex-col gap-5"
      >
        {active === "branding" && (
          <Section
            title="Branding and data"
            description="The logo and name shown across the console and on the login page, how long a session can sit idle, and how long data is kept."
          >
            <PlatformSettingsForm
              key={`branding|${formKey}`}
              settings={platform}
              section="branding"
              canManage={canManage}
            />
          </Section>
        )}

        {active === "menu" && (
          <Section
            title="Menu Management"
            description="Arrange your own sidebar. This only changes what you see."
          >
            <MenuEditor key={JSON.stringify(preferences)} allowed={allowed} saved={preferences} />
          </Section>
        )}

        {active === "legal" && pageData && (
          <Section
            title="Legal pages"
            description="Terms and conditions, privacy policy, cookie policy and community guidelines. What you save shows on the website straight away."
          >
            <LegalPagesSection pages={pageData.pages} />
          </Section>
        )}

        {active === "faq" && (
          <Section
            title="FAQ"
            description="The questions and answers users read on the Help Center page. Write in plain, friendly English."
          >
            <FaqManager />
          </Section>
        )}

        {active === "help" && (
          <Section
            title="Help Center"
            description="How users reach you. These details show on the Help Center page and in the footer of every email."
          >
            <PlatformSettingsForm
              key={`help|${formKey}`}
              settings={platform}
              section="contact"
              canManage={canManage}
            />
          </Section>
        )}
      </div>
    </div>
  );
}

export default SettingsClient;
