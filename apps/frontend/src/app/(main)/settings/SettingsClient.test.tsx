import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import SettingsClient from "./SettingsClient";

const push = vi.fn();
const dispatch = vi.fn();
const logoutMutate = vi.fn();
let isMember = false;

vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ push }) }));
vi.mock("react-redux", () => ({
  useSelector: (select: (state: unknown) => unknown) =>
    select({
      auth: {
        isLoggedIn: true,
        user: { fullname: "Ada Obi", username: "ada", lemon_id: "12", socials: [] },
      },
    }),
}));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/features/settings/queries", () => ({
  useSupportUnreadQuery: () => ({ data: { unread: 0 } }),
}));
vi.mock("@/features/authentication/queries", () => ({
  useSubscriptionQuery: () => ({ data: { subscription: { is_member: isMember } } }),
}));
vi.mock("@/features/authentication/mutations", () => ({
  useLogoutMutation: () => ({ mutate: logoutMutate, isPending: false }),
}));

describe("SettingsClient", () => {
  beforeEach(() => {
    push.mockReset();
    dispatch.mockReset();
    logoutMutate.mockReset();
    isMember = false;
  });

  it("shows the Membership tag only for a paid member", () => {
    const { unmount } = render(<SettingsClient />);
    expect(screen.queryByText("Membership")).toBeNull();
    unmount();

    isMember = true;
    render(<SettingsClient />);
    expect(screen.getByText("Membership")).toBeTruthy();
  });

  it("logs out from the main settings screen and returns to login", () => {
    logoutMutate.mockImplementation((_vars, opts) => {
      opts.onSuccess();
      opts.onSettled();
    });
    render(<SettingsClient />);

    fireEvent.click(screen.getByRole("button", { name: /log out/i }));

    expect(logoutMutate).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith("/login");
  });
});
