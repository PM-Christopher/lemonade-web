"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { Label, Input, FieldError } from "@lemonade/ui";
import { AppDispatch } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { applyServerErrors } from "@/lib/form-errors";
import { images } from "@/lib/images";
import { FallbackImage } from "@/components/global/FallbackImage";
import { SubmitButton } from "@/components/global/SubmitButton";
import type { PlatformSettings } from "@/features/settings/api";
import {
  useUpdatePlatformSettingsMutation,
  useUploadLogoMutation,
} from "@/features/settings/mutations";
import { platformSettingsSchema, type PlatformSettingsInput } from "@/features/settings/schema";

const FORM_FIELDS = [
  "platform_name",
  "inactivity_timeout_minutes",
  "support_email",
  "support_phone",
  "audit_retention_days",
  "user_activity_retention_days",
  "account_deletion_grace_days",
] as const;

const MAX_LOGO_BYTES = 2 * 1024 * 1024;

const DAY_FIELDS = [
  {
    name: "audit_retention_days",
    label: "Keep the audit log for (days)",
    min: 0,
    hint: "Older admin activity is removed every night. Use 0 to keep it forever.",
  },
  {
    name: "user_activity_retention_days",
    label: "Keep user activity logs for (days)",
    min: 0,
    hint: "Older entries on each user's activity log are removed every night. Use 0 to keep them forever.",
  },
  {
    name: "account_deletion_grace_days",
    label: "Account deletion grace period (days)",
    min: 1,
    hint: "A deleted account can be restored by signing in within this time. After it, the person's details are erased.",
  },
] as const;

interface PlatformSettingsFormProps {
  settings: PlatformSettings;
  // Branding shows the logo, name, timeout and retention. Contact shows the support details.
  section: "branding" | "contact";
  // Without the settings permission the form is read only.
  canManage: boolean;
}

// Platform settings. Each tab shows its own fields and saves them with the rest unchanged.
export function PlatformSettingsForm({ settings, section, canManage }: PlatformSettingsFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const update = useUpdatePlatformSettingsMutation();
  const uploadLogo = useUploadLogoMutation();
  const [logoUrl, setLogoUrl] = useState<string | null>(settings.logo_url);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty },
  } = useForm<PlatformSettingsInput>({
    resolver: zodResolver(platformSettingsSchema),
    values: {
      platform_name: settings.platform_name,
      inactivity_timeout_minutes: settings.inactivity_timeout_minutes,
      support_email: settings.support_email ?? "",
      support_phone: settings.support_phone ?? "",
      audit_retention_days: settings.audit_retention_days,
      user_activity_retention_days: settings.user_activity_retention_days,
      account_deletion_grace_days: settings.account_deletion_grace_days,
    },
    mode: "onTouched",
  });

  const toast = (message: string, type: "success" | "error") =>
    dispatch(updateToastifyReducer({ show: true, message, type }));

  const onPickLogo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast("Choose an image file.", "error");
    if (file.size > MAX_LOGO_BYTES) return toast("The logo must be under 2 MB.", "error");

    uploadLogo.mutate(file, {
      onSuccess: setLogoUrl,
      onError: (error) => toast(error?.message || "Couldn't upload that logo.", "error"),
    });
  };

  const onSubmit = (values: PlatformSettingsInput) => {
    update.mutate(
      {
        ...values,
        logo_url: logoUrl,
        // An empty box means "none".
        support_email: values.support_email || null,
        support_phone: values.support_phone || null,
      },
      {
        onSuccess: () => toast(apiMessage("Settings saved"), "success"),
        onError: (error) => {
          if (applyServerErrors(error, setError, FORM_FIELDS)) return;
          toast(error?.message || "Something went wrong", "error");
        },
      },
    );
  };

  const logoChanged = logoUrl !== settings.logo_url;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {section === "branding" && (
        <>
          <div className="flex flex-col gap-3">
            <p className="text-body-l font-semibold">Logo</p>
            <div className="flex items-center gap-5">
              <div className="border-grey-20 bg-light-grey flex h-20 w-48 items-center justify-center rounded-xl border p-2">
                <FallbackImage
                  src={logoUrl}
                  fallbackSrc={images.LOGO}
                  alt="Current logo"
                  width={160}
                  height={64}
                  className="max-h-16 w-auto object-contain"
                />
              </div>
              {canManage && (
                <div className="flex flex-col items-start gap-2">
                  <label className="text-light-green text-body-s cursor-pointer font-medium">
                    {uploadLogo.isPending ? "Uploading…" : "Upload a new logo"}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={onPickLogo}
                      disabled={uploadLogo.isPending}
                    />
                  </label>
                  {logoUrl && (
                    <button
                      type="button"
                      className="text-text-grey text-body-s cursor-pointer font-medium"
                      onClick={() => setLogoUrl(null)}
                    >
                      Use the default logo
                    </button>
                  )}
                  <p className="text-text-grey text-meta">PNG, JPG or SVG, up to 2 MB.</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid max-w-md gap-2">
            <Label htmlFor="platform-name" className="text-text-grey text-body-s font-normal">
              Platform name
            </Label>
            <Input
              id="platform-name"
              disabled={!canManage}
              aria-invalid={errors.platform_name ? true : undefined}
              {...register("platform_name")}
            />
            <FieldError message={errors.platform_name?.message} />
          </div>

          <div className="grid max-w-md gap-2">
            <Label htmlFor="idle-timeout" className="text-text-grey text-body-s font-normal">
              Sign out after inactivity (minutes)
            </Label>
            <Input
              id="idle-timeout"
              type="number"
              min={1}
              max={120}
              disabled={!canManage}
              aria-invalid={errors.inactivity_timeout_minutes ? true : undefined}
              {...register("inactivity_timeout_minutes", { valueAsNumber: true })}
            />
            <FieldError message={errors.inactivity_timeout_minutes?.message} />
            <p className="text-text-grey text-meta">
              After this long without activity, admins see a prompt to stay signed in or log out.
              This applies to everyone.
            </p>
          </div>

          <div className="flex max-w-md flex-col gap-5">
            <p className="text-body-l font-semibold">Data retention</p>
            {DAY_FIELDS.map((field) => (
              <div className="grid gap-2" key={field.name}>
                <Label htmlFor={field.name} className="text-text-grey text-body-s font-normal">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type="number"
                  min={field.min}
                  disabled={!canManage}
                  aria-invalid={errors[field.name] ? true : undefined}
                  {...register(field.name, { valueAsNumber: true })}
                />
                <FieldError message={errors[field.name]?.message} />
                <p className="text-text-grey text-meta">{field.hint}</p>
              </div>
            ))}
          </div>
        </>
      )}
      {section === "contact" && (
        <>
          <div className="flex max-w-md flex-col gap-5">
            <p className="text-body-l font-semibold">Support contact</p>
            <div className="grid gap-2">
              <Label htmlFor="support-email" className="text-text-grey text-body-s font-normal">
                Support email
              </Label>
              <Input
                id="support-email"
                type="email"
                disabled={!canManage}
                aria-invalid={errors.support_email ? true : undefined}
                {...register("support_email")}
              />
              <FieldError message={errors.support_email?.message} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="support-phone" className="text-text-grey text-body-s font-normal">
                Support phone
              </Label>
              <Input
                id="support-phone"
                type="tel"
                disabled={!canManage}
                aria-invalid={errors.support_phone ? true : undefined}
                {...register("support_phone")}
              />
              <FieldError message={errors.support_phone?.message} />
              <p className="text-text-grey text-meta">
                Shown on the Help Center page and in the footer of every email. Leave both empty to
                hide them.
              </p>
            </div>
          </div>
        </>
      )}
      {canManage ? (
        <SubmitButton
          title="Save changes"
          loading={update.isPending}
          isValid={isDirty || logoChanged}
          classes="flex h-12 w-fit items-center justify-center rounded-xl px-6"
        />
      ) : (
        <p className="text-text-grey text-body-s">
          You can see these settings but need the settings permission to change them.
        </p>
      )}
    </form>
  );
}
