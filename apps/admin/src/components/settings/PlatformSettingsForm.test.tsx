import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PlatformSettingsForm } from "./PlatformSettingsForm";
import type { PlatformSettings } from "@/features/settings/api";

const mutate = vi.fn();

vi.mock("react-redux", () => ({ useDispatch: () => vi.fn() }));
vi.mock("@/features/settings/mutations", () => ({
  useUpdatePlatformSettingsMutation: () => ({ mutate, isPending: false }),
  useUploadLogoMutation: () => ({ mutate: vi.fn(), isPending: false }),
}));

const settings: PlatformSettings = {
  platform_name: "Lemonade",
  logo_url: null,
  support_email: null,
  support_phone: null,
  inactivity_timeout_minutes: 3,
  audit_retention_days: 365,
  user_activity_retention_days: 180,
  account_deletion_grace_days: 30,
  referral_subscribe_percent: 5,
  referral_renewal_percent: 5,
};

describe("PlatformSettingsForm referral rewards", () => {
  beforeEach(() => mutate.mockReset());

  it("shows both rates and saves a change to each", async () => {
    render(<PlatformSettingsForm settings={settings} section="branding" canManage />);

    expect(screen.getByLabelText(/When a referred person subscribes/)).toHaveValue(5);
    fireEvent.change(screen.getByLabelText(/When a referred person subscribes/), {
      target: { value: "7.5" },
    });
    fireEvent.change(screen.getByLabelText(/When a referred person renews/), {
      target: { value: "0" },
    });
    fireEvent.submit(screen.getByLabelText(/When a referred person renews/).closest("form")!);

    await waitFor(() => expect(mutate).toHaveBeenCalled());
    expect(mutate.mock.calls[0][0]).toMatchObject({
      referral_subscribe_percent: 7.5,
      referral_renewal_percent: 0,
    });
  });

  it("refuses a rate over 100", async () => {
    render(<PlatformSettingsForm settings={settings} section="branding" canManage />);

    fireEvent.change(screen.getByLabelText(/When a referred person renews/), {
      target: { value: "120" },
    });
    fireEvent.submit(screen.getByLabelText(/When a referred person renews/).closest("form")!);

    expect(await screen.findByText("At most 100%")).toBeInTheDocument();
    expect(mutate).not.toHaveBeenCalled();
  });
});
