"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useGetJobMutation } from "./mutations";
import { useAppDispatch } from "@/redux/hook";
import { setSelectedJob } from "@/redux/tempSlice";
import { useNavigation } from "@/hooks/useNavigation";

// Opens the job named in ?job= (from a notification link), once, then clears it from the address.
export function useOpenJobFromLink(
  type: "business" | "listing",
  onOpen: () => void,
  enabled = true,
) {
  const jobId = useSearchParams().get("job");
  const dispatch = useAppDispatch();
  const { replace } = useNavigation();
  const { mutate } = useGetJobMutation();
  const handled = useRef<string | null>(null);

  useEffect(() => {
    if (!enabled || !jobId || handled.current === jobId) return;
    handled.current = jobId;
    mutate(
      { id: jobId, type },
      {
        onSuccess: (payload) => {
          dispatch(setSelectedJob(payload.job));
          onOpen();
          const params = new URLSearchParams(window.location.search);
          params.delete("job");
          const rest = params.toString();
          replace(`${window.location.pathname}${rest ? `?${rest}` : ""}`);
        },
      },
    );
  }, [enabled, jobId, type, mutate, dispatch, onOpen, replace]);
}
