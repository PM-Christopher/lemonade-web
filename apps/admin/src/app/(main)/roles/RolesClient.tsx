"use client";
import { usePagination } from "@/hooks/usePagination";
import PaginationComp from "@/components/global/Pagination";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination";
import React, { useState } from "react";
import { ActionMenu } from "@/components/global/ActionMenu";
import { centerNumericColumns } from "@/utils/tableAlign";
import dynamic from "next/dynamic";
import { PlusIcon } from "lucide-react";
import { Button } from "@lemonade/ui";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRolesQuery, type AdminRole } from "@/features/roles";
import { useHasPermission } from "@/features/authentication/queries";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";

const RoleFormModal = dynamic(() => import("@/modals/roles/RoleFormModal"), { ssr: false });
const DeleteRoleModal = dynamic(() => import("@/modals/roles/DeleteRoleModal"), { ssr: false });

const HEADERS = ["ROLE", "ADMINS", "PERMISSIONS", "ACTIONS"];

function RolesClient() {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const { data, isLoading } = useRolesQuery({ enabled: isLoggedIn });
  const canCreate = useHasPermission(ADMIN_PERMISSIONS.rolesCreate);
  const canUpdate = useHasPermission(ADMIN_PERMISSIONS.rolesUpdate);
  const canDelete = useHasPermission(ADMIN_PERMISSIONS.rolesDelete);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AdminRole | undefined>();
  const [deleting, setDeleting] = useState<AdminRole | undefined>();

  const roles = data?.roles ?? [];

  const openForm = (role?: AdminRole) => {
    setEditing(role);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(undefined);
  };

  const pager = usePagination(roles);

  return (
    <>
      <section className="mt-6 flex flex-col gap-5">
        <div className="flex items-center justify-between px-5">
          <div>
            <p className="font-semiBold text-body-l">{roles.length} Roles</p>
            <p className="text-text-grey text-body-s">
              A role is a set of permissions. Give one to each team member.
            </p>
          </div>
          {canCreate && (
            <Button
              className="border-step-color bg-gradient-green flex h-10 rounded-xl"
              onClick={() => openForm()}
            >
              <PlusIcon className="h-3.75 w-3.75 text-white" />
              <p className="text-body-l font-medium text-white">Create role</p>
            </Button>
          )}
        </div>

        <div className="flex flex-col px-5">
          <div className="border-grey-20 flex flex-col rounded-xl border">
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
              <table
                className={`min-w-full table-auto border-collapse ${centerNumericColumns(HEADERS)}`}
              >
                <thead>
                  <tr className="bg-mid-grey">
                    {HEADERS.map((header) => (
                      <th
                        className="font-semiBold text-text-grey text-meta p-4 text-left leading-normal"
                        key={header}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roles.length > 0 ? (
                    pager.pageItems.map((role) => (
                      <tr key={role.id} className="border-grey-20 h-16 border-b">
                        <td className="p-4 font-sans text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <span>{role.label}</span>
                            {role.is_super_admin && (
                              <span className="bg-link-color text-meta rounded-full px-2 py-0.5 font-medium">
                                Locked
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-sans text-sm font-medium">{role.admin_count}</td>
                        <td className="p-4 font-sans text-sm font-medium">
                          {role.is_super_admin ? "All" : role.permission_count}
                        </td>
                        <td className="p-4 font-sans text-sm font-medium">
                          {role.is_super_admin ? (
                            <span className="text-text-grey text-meta font-normal">
                              Always has every permission
                            </span>
                          ) : (
                            <ActionMenu
                              label={`Actions for ${role.label}`}
                              items={[
                                ...(canUpdate
                                  ? [{ label: "Edit", onSelect: () => openForm(role) }]
                                  : []),
                                ...(canDelete
                                  ? [
                                      {
                                        label: "Delete",
                                        danger: true,
                                        onSelect: () => setDeleting(role),
                                      },
                                    ]
                                  : []),
                              ]}
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={HEADERS.length}
                        className="p-4 text-center text-sm text-gray-500"
                      >
                        {isLoading ? "Loading..." : "No roles yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <PaginationComp
                currentPage={pager.page}
                totalPages={pager.totalPages}
                onPageChange={pager.setPage}
                perPage={DEFAULT_PAGE_SIZE}
              />
            </div>
          </div>
        </div>
      </section>

      {formOpen && <RoleFormModal isOpen={formOpen} toggle={closeForm} role={editing} />}
      {deleting && (
        <DeleteRoleModal
          isOpen={Boolean(deleting)}
          toggle={() => setDeleting(undefined)}
          role={deleting}
          roles={roles}
        />
      )}
    </>
  );
}

export default RolesClient;
