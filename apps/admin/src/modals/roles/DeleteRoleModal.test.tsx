import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import DeleteRoleModal from "./DeleteRoleModal";
import type { AdminRole } from "@/features/roles";

const mutate = vi.fn();
vi.mock("@/features/roles", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/features/roles")>()),
  useDeleteRoleMutation: () => ({ mutate, isPending: false }),
}));

const role = (id: number, label: string, admin_count: number, is_super_admin = false) =>
  ({
    id,
    name: label.toLowerCase(),
    label,
    admin_count,
    is_super_admin,
    permissions: [],
    permission_count: 0,
    created_at: null,
  }) as AdminRole;

const open = (target: AdminRole, all: AdminRole[]) =>
  render(
    <Provider store={configureStore({ reducer: { noop: (state = {}) => state } })}>
      <QueryClientProvider client={new QueryClient()}>
        <DeleteRoleModal isOpen toggle={vi.fn()} role={target} roles={all} />
      </QueryClientProvider>
    </Provider>,
  );

describe("DeleteRoleModal", () => {
  it("deletes an unused role straight away", () => {
    const ops = role(1, "Ops", 0);
    open(ops, [ops]);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(mutate).toHaveBeenCalledWith({ id: 1, reassignTo: undefined }, expect.anything());
  });

  it("asks where to move the admins before deleting a role that has them", () => {
    mutate.mockClear();
    const ops = role(1, "Ops", 2);
    const support = role(2, "Support", 1);
    const boss = role(3, "Super Admin", 1, true);
    open(ops, [ops, support, boss]);

    expect(screen.getByText(/2 admins have the "Ops" role/)).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "Move and delete" });
    expect(button).toBeDisabled();
    // The super admin role is never offered, nor the role being deleted.
    expect(screen.queryByRole("option", { name: "Super Admin" })).not.toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "Ops" })).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Move admins to"), { target: { value: "2" } });
    expect(button).toBeEnabled();
    fireEvent.click(button);
    expect(mutate).toHaveBeenCalledWith({ id: 1, reassignTo: "2" }, expect.anything());
  });
});
