import React from "react";
import { XIcon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label, Input, Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  roleSchema,
  useCreateRoleMutation,
  usePermissionCatalogQuery,
  useUpdateRoleMutation,
  type AdminRole,
  type RoleInput,
} from "@/features/roles";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { useRoleChangeRefresh } from "@/hooks/useRoleChangeRefresh";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { SubmitButton } from "@/components/global/SubmitButton";
import { applyServerErrors } from "@/lib/form-errors";

interface RoleFormModalProps {
  isOpen: boolean;
  toggle: () => void;
  // Present when editing; absent when creating.
  role?: AdminRole;
}

function RoleFormModal({ isOpen, toggle, role }: RoleFormModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const title = role ? "Edit role" : "Create role";
  const createRole = useCreateRoleMutation();
  const updateRole = useUpdateRoleMutation(role?.id);
  const refreshAfterChange = useRoleChangeRefresh();
  const { data: catalog } = usePermissionCatalogQuery();
  const { data: currentAdmin } = useCurrentAdminQuery();
  const held = new Set(currentAdmin?.permissions ?? []);

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<RoleInput>({
    resolver: zodResolver(roleSchema),
    values: { name: role?.label ?? "", permissions: role?.permissions ?? [] },
    mode: "onTouched",
  });

  const onSubmit = (values: RoleInput) => {
    const mutation = role ? updateRole : createRole;
    mutation.mutate(values, {
      onSuccess: () => {
        refreshAfterChange();
        dispatch(
          updateToastifyReducer({
            show: true,
            message: apiMessage(role ? "Role updated" : "Role created"),
            type: "success",
          }),
        );
        toggle();
      },
      onError: (error) => {
        if (applyServerErrors(error, setError, ["name", "permissions"])) return;
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || "Something went wrong",
            type: "error",
          }),
        );
      },
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="w-160 max-w-[95vw] rounded-xl bg-white pt-4 pb-1">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between px-4 py-1">
              <p className="text-body-xl font-sans font-semibold">{title}</p>
              <button type="button" aria-label="Close" onClick={toggle}>
                <XIcon />
              </button>
            </div>
            <div className="flex max-h-[65vh] flex-col gap-4 overflow-y-auto px-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="role-name" className="text-text-grey text-body-s font-normal">
                  Role name
                </Label>
                <Input
                  id="role-name"
                  type="text"
                  placeholder="e.g. Finance team"
                  className="form-font bg-light-grey h-12 rounded-xl border-0"
                  {...register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>

              <div className="grid gap-3">
                <div>
                  <p className="text-body-s font-semibold">Permissions</p>
                  <p className="text-text-grey text-meta">
                    You can only give permissions you have yourself.
                  </p>
                </div>
                <Controller
                  name="permissions"
                  control={control}
                  render={({ field }) => (
                    <div className="flex flex-col gap-4">
                      {(catalog?.groups ?? []).map((group) => {
                        const grantable = group.permissions.filter((item) => held.has(item.name));
                        const selected = group.permissions.filter((item) =>
                          field.value.includes(item.name),
                        );
                        const allSelected =
                          grantable.length > 0 &&
                          grantable.every((item) => field.value.includes(item.name));
                        const toggleGroup = () => {
                          const names = new Set(grantable.map((item) => item.name));
                          field.onChange(
                            allSelected
                              ? field.value.filter((name) => !names.has(name))
                              : [...new Set([...field.value, ...names])],
                          );
                        };

                        return (
                          <fieldset
                            key={group.group}
                            className="border-grey-20 rounded-xl border p-3"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <legend className="text-body-s px-1 font-semibold">
                                {group.group}
                                <span className="text-text-grey text-meta ml-2 font-normal">
                                  {selected.length}/{group.permissions.length}
                                </span>
                              </legend>
                              <button
                                type="button"
                                disabled={grantable.length === 0}
                                className="text-light-green text-meta font-medium disabled:opacity-40"
                                onClick={toggleGroup}
                              >
                                {allSelected ? "Clear all" : "Select all"}
                              </button>
                            </div>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {group.permissions.map((item) => {
                                const allowed = held.has(item.name);
                                return (
                                  <label
                                    key={item.name}
                                    className={`text-body-s flex items-start gap-2 font-normal ${
                                      allowed ? "" : "opacity-50"
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      className="mt-1"
                                      disabled={!allowed}
                                      checked={field.value.includes(item.name)}
                                      onChange={(event) =>
                                        field.onChange(
                                          event.target.checked
                                            ? [...field.value, item.name]
                                            : field.value.filter((name) => name !== item.name),
                                        )
                                      }
                                    />
                                    {item.label}
                                  </label>
                                );
                              })}
                            </div>
                          </fieldset>
                        );
                      })}
                    </div>
                  )}
                />
                <FieldError message={errors.permissions?.message} />
              </div>
            </div>
            <div className="flex justify-between gap-4 px-4 pb-2.5">
              <button
                type="button"
                onClick={toggle}
                className="border-light-grey-50 w-full rounded-xl border bg-white px-12 py-2.75"
              >
                <p className="text-body-l font-medium text-black">Cancel</p>
              </button>
              <SubmitButton
                loading={createRole.isPending || updateRole.isPending}
                title={role ? "Save changes" : "Create role"}
                isValid={isValid}
                classes="w-full rounded-xl border border-step-color px-12 py-2.75"
              />
            </div>
          </form>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default RoleFormModal;
