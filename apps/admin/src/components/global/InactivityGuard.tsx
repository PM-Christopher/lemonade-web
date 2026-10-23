"use client";
import React, { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useAdminLogout } from "@/hooks/useAdminLogout";
import { authKeys } from "@/features/authentication/queries";
import { useAdminSettingsQuery } from "@/features/settings/queries";

// Used until the settings load.
const DEFAULT_TIMEOUT_MINUTES = 3;
// How long the prompt waits before it signs the admin out.
const WARNING_SECONDS = 60;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"] as const;

// Asks the admin to stay or leave after a stretch of inactivity, and signs out if there is no answer.
export function InactivityGuard() {
  const { data } = useAdminSettingsQuery();
  const minutes = data?.platform.inactivity_timeout_minutes ?? DEFAULT_TIMEOUT_MINUTES;
  const logout = useAdminLogout();
  const queryClient = useQueryClient();
  // null while the admin is active.
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const isIdle = secondsLeft !== null;
  const logoutRef = useRef(logout);

  useEffect(() => {
    logoutRef.current = logout;
  });

  // Starts the idle clock over on every sign of activity.
  useEffect(() => {
    if (isIdle) return;
    let timer: ReturnType<typeof setTimeout>;
    const restart = () => {
      clearTimeout(timer);
      timer = setTimeout(() => setSecondsLeft(WARNING_SECONDS), minutes * 60_000);
    };

    restart();
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, restart, { passive: true }));
    return () => {
      clearTimeout(timer);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, restart));
    };
  }, [minutes, isIdle]);

  // Counts the warning down, then signs out.
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      logoutRef.current();
      return;
    }
    const tick = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000);
    return () => clearTimeout(tick);
  }, [secondsLeft]);

  const stay = () => {
    setSecondsLeft(null);
    // Also renews the session with the server.
    void queryClient.invalidateQueries({ queryKey: authKeys.currentAdmin() });
  };

  return (
    <Dialog
      open={isIdle}
      onOpenChange={(open) => {
        if (!open) stay();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Are you still there?</DialogTitle>
        <div className="w-100 max-w-[95vw] rounded-xl bg-white p-5">
          <p className="text-body-xl font-sans font-semibold">Are you still there?</p>
          <p className="text-light-black text-body-s mt-2 font-normal" role="status">
            You have been inactive for a while. For your security, you will be logged out in{" "}
            <span className="font-semibold">{Math.max(secondsLeft ?? 0, 0)}</span> seconds.
          </p>
          <div className="mt-5 flex justify-between gap-2.5">
            <button
              type="button"
              className="border-light-grey-50 h-12 w-full cursor-pointer rounded-xl border bg-white"
              onClick={() => logoutRef.current()}
            >
              <p className="text-body-l font-medium text-black">Log out</p>
            </button>
            <button
              type="button"
              className="bg-gradient-green h-12 w-full cursor-pointer rounded-xl"
              onClick={stay}
            >
              <p className="text-body-l font-medium text-white">Stay signed in</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}
