import React from "react";
import { ChevronLeft, Headset, LogOut, Settings, UserCircle } from "lucide-react";
import { ActionMenu } from "@/components/global/ActionMenu";
import { useAdminLogout } from "@/hooks/useAdminLogout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { formatRoleName } from "@/utils/helper";
import { Avatar } from "@/components/global/Avatar";
import { getPageHeading } from "@/utils/pageTitle";
import { useAdminSettingsQuery } from "@/features/settings/queries";
import { useNavigation } from "@/hooks/useNavigation";
import { UserInterface } from "@/interfaces/SystemInterface";
import { NotificationBell } from "@/components/global/NotificationBell";
import { CountBadge } from "@/components/global/CountBadge";
import { useAdminNotificationsQuery } from "@/features/notifications";
import { useCurrentAdminQuery } from "@/features/authentication/queries";
import { ADMIN_PERMISSIONS } from "@/features/authentication/permissions";
import { routes } from "@/lib/routes";

function TopNav({}) {
  const user: UserInterface | null = useSelector((state: RootState) => state.auth.user);
  const { pathname, back, push } = useNavigation();
  const { data: settings } = useAdminSettingsQuery();
  const { title, parent } = getPageHeading(pathname, settings?.preferences.menu_labels);
  const { data: currentAdmin } = useCurrentAdminQuery();
  const { data: notifications } = useAdminNotificationsQuery();
  const logout = useAdminLogout();
  const canSeeSupport = currentAdmin?.permissions?.includes(ADMIN_PERMISSIONS.supportView);
  const supportUnread = notifications?.support_unread ?? 0;

  // Go back one step, or up to the list when the page was opened directly.
  const goBack = () => {
    if (window.history.length > 1) back();
    else if (parent) push(parent);
  };

  return (
    <header className="border-b-grey-20 flex shrink-0 items-center justify-between border-b bg-white px-5 py-5">
      <div className="flex items-center gap-3">
        {parent && (
          <button
            type="button"
            aria-label="Go back"
            className="bg-light_grey flex h-7 w-7 cursor-pointer items-center justify-center rounded-full"
            onClick={goBack}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
        <h1 className="font-semiBold text-body-l">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        {canSeeSupport && (
          <button
            type="button"
            aria-label={
              supportUnread > 0 ? `Support inbox, ${supportUnread} waiting` : "Support inbox"
            }
            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-100"
            onClick={() => push(routes.SUPPORT_INBOX)}
          >
            <Headset className="h-5 w-5" aria-hidden="true" />
            <CountBadge count={supportUnread} />
          </button>
        )}
        <NotificationBell />
        <ActionMenu
          label="Account menu"
          triggerClassName="flex cursor-pointer items-center gap-3 rounded-full"
          items={[
            {
              label: "Profile",
              icon: <UserCircle className="h-4 w-4" aria-hidden="true" />,
              onSelect: () => push(routes.PROFILE),
            },
            {
              label: "Settings",
              icon: <Settings className="h-4 w-4" aria-hidden="true" />,
              onSelect: () => push(routes.SETTINGS),
            },
            {
              label: "Logout",
              danger: true,
              icon: <LogOut className="h-4 w-4" aria-hidden="true" />,
              onSelect: logout,
            },
          ]}
          trigger={
            <>
              <span className="flex flex-col items-end">
                <span className="font-semiBold text-body-l">{user?.name}</span>
                <span className="text-text-grey text-meta leading-normal font-normal">
                  {formatRoleName(user?.role)}
                </span>
              </span>
              <Avatar name={user?.name} image={currentAdmin?.image} />
            </>
          }
        />
      </div>
    </header>
  );
}

export default TopNav;
