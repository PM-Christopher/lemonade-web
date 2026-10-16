import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import UserSearch from "./UserSearch";
import type { FoundUser } from "@/features/connect/api";

vi.mock("@/images/icons/search.svg", () => ({ default: () => <span /> }));
// Skip the debounce wait so results show straight away.
vi.mock("@/hooks/useDebounce", () => ({
  default: (value: string) => ({ debouncedValue: value }),
}));

const found: FoundUser = {
  id: "u1",
  fullname: "Anthony Joboy",
  username: "xand3rx",
  industry: null,
  lemon_id: "Lemon 1 (L1)",
  short_lemon_id: "1",
  long_lemon_id: "Lemon 1",
  bio: null,
  socials: [],
  profile_image: null,
  distance_km: null,
  hasConnected: false,
};

const search = vi.hoisted(() => vi.fn());
vi.mock("@/features/connect/queries", () => ({
  useFindUsersQuery: (term: string) => ({ data: search(term), isFetching: false }),
}));

const type = (text: string) =>
  fireEvent.change(screen.getByRole("combobox"), { target: { value: text } });

describe("UserSearch", () => {
  it("lists matching usernames and reports the one picked", async () => {
    search.mockImplementation((term: string) => (term === "xand" ? [found] : []));
    const onSelect = vi.fn();
    render(<UserSearch onSelect={onSelect} />);

    type("xand");
    fireEvent.click(await screen.findByRole("button", { name: /xand3rx/ }));

    expect(onSelect).toHaveBeenCalledWith(found);
  });

  it("says when nobody matches", async () => {
    search.mockReturnValue([]);
    render(<UserSearch onSelect={vi.fn()} />);

    type("zz");

    expect(await screen.findByText("No users found")).toBeInTheDocument();
  });

  it("stays closed until two characters are typed", async () => {
    search.mockReturnValue([found]);
    render(<UserSearch onSelect={vi.fn()} />);

    type("x");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
