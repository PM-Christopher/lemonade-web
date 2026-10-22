import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RoleFormModal from "./RoleFormModal";

const mutate = vi.fn();
vi.mock("@/features/roles", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/roles")>()),
  useCreateRoleMutation: () => ({ mutate, isPending: false }),
  useUpdateRoleMutation: () => ({ mutate: vi.fn(), isPending: false }),
  usePermissionCatalogQuery: () => ({
    data: {
      groups: [
        {
          group: "Wallet management",
          permissions: [
            { name: "wallet.view", label: "View wallets" },
            { name: "wallet.funds.add", label: "Add funds to a wallet" },
          ],
        },
      ],
    },
  }),
}));
vi.mock("@/features/authentication/queries", () => ({
  useCurrentAdminQuery: () => ({ data: { permissions: ["wallet.view"] } }),
}));

const open = () =>
  render(
    <Provider store={configureStore({ reducer: { noop: (state = {}) => state } })}>
      <QueryClientProvider client={new QueryClient()}>
        <RoleFormModal isOpen toggle={vi.fn()} />
      </QueryClientProvider>
    </Provider>,
  );

describe("RoleFormModal", () => {
  it("lets an admin pick only permissions they hold", () => {
    open();

    expect(screen.getByLabelText("View wallets")).toBeEnabled();
    expect(screen.getByLabelText("Add funds to a wallet")).toBeDisabled();
  });

  it("selects every grantable permission in an area at once", () => {
    open();

    fireEvent.click(screen.getByRole("button", { name: "Select all" }));

    expect(screen.getByLabelText("View wallets")).toBeChecked();
    expect(screen.getByLabelText("Add funds to a wallet")).not.toBeChecked();
    expect(screen.getByRole("button", { name: "Clear all" })).toBeInTheDocument();
  });

  it("asks for a name and at least one permission before saving", async () => {
    open();

    fireEvent.change(screen.getByLabelText("Role name"), { target: { value: "Finance" } });
    fireEvent.click(screen.getByLabelText("View wallets"));
    fireEvent.blur(screen.getByLabelText("Role name"));
    const save = screen.getByRole("button", { name: "Create role" });
    await vi.waitFor(() => expect(save).toBeEnabled());
    fireEvent.click(save);

    await vi.waitFor(() =>
      expect(mutate).toHaveBeenCalledWith(
        { name: "Finance", permissions: ["wallet.view"] },
        expect.anything(),
      ),
    );
  });
});
