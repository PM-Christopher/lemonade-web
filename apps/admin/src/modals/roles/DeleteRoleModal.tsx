import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useDeleteRoleMutation, type AdminRole } from "@/features/roles";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useRoleChangeRefresh } from "@/hooks/useRoleChangeRefresh";
import { apiMessage } from "@/lib/api-message";

interface DeleteRoleModalProps {
  isOpen: boolean;
  toggle: () => void;
  role: AdminRole;
  roles: AdminRole[];
}

function DeleteRoleModal({ isOpen, toggle, role, roles }: DeleteRoleModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const deleteRole = useDeleteRoleMutation();
  const refreshAfterChange = useRoleChangeRefresh();
  const [target, setTarget] = useState("");

  const admins = role.admin_count;
  const moveTo = roles.filter((item) => item.id !== role.id && !item.is_super_admin);
  const needsTarget = admins > 0;
  const canDelete = !needsTarget || target !== "";

  const confirm = () => {
    deleteRole.mutate(
      { id: role.id, reassignTo: needsTarget ? target : undefined },
      {
        onSuccess: () => {
          refreshAfterChange();
          dispatch(
            updateToastifyReducer({
              show: true,
              message: apiMessage("Role deleted"),
              type: "success",
            }),
          );
          toggle();
        },
        onError: (error) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: error?.message || "Something went wrong",
              type: "error",
            }),
          );
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Delete role</DialogTitle>
        <div className="w-100 max-w-[95vw] rounded-xl bg-white pt-4 pb-1">
          <div className="flex items-center justify-between px-4 py-1">
            <p className="text-body-xl font-sans font-semibold">Delete role</p>
            <button type="button" aria-label="Close" onClick={toggle}>
              <XIcon />
            </button>
          </div>
          <div className="flex flex-col gap-4 px-4 py-4">
            {needsTarget ? (
              <>
                <p className="text-light-black text-body-s font-normal">
                  {admins} {admins === 1 ? "admin has" : "admins have"} the &quot;{role.label}&quot;
                  role. Choose a role to move them to, then it is deleted.
                </p>
                <div className="grid gap-2">
                  <label htmlFor="move-to" className="text-text-grey text-body-s font-normal">
                    Move admins to
                  </label>
                  <select
                    id="move-to"
                    className="bg-light-grey h-12 rounded-xl px-3"
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                  >
                    <option value="">Choose a role</option>
                    {moveTo.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <p className="text-light-black text-body-s font-normal">
                Delete the &quot;{role.label}&quot; role? No one has it right now. This can&apos;t
                be undone.
              </p>
            )}
            <div className="flex justify-between gap-2.5">
              <button
                type="button"
                className="border-light-grey-50 h-12 w-full rounded-xl border bg-white"
                onClick={toggle}
              >
                <p className="text-body-l font-medium text-black">Cancel</p>
              </button>
              <button
                type="button"
                className="border-red-2 bg-red-1 h-12 w-full rounded-xl border text-center disabled:opacity-50"
                onClick={confirm}
                disabled={!canDelete || deleteRole.isPending}
              >
                <p className="text-body-l font-medium text-white">
                  {needsTarget ? "Move and delete" : "Delete"}
                </p>
              </button>
            </div>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default DeleteRoleModal;
