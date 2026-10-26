import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useOpenJobFromLink } from "./useOpenJobFromLink";

const mutate = vi.fn();
const replace = vi.fn();
const dispatch = vi.fn();
let search = "job=job-1&tab=sent-offers";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(search) }));
vi.mock("./mutations", () => ({ useGetJobMutation: () => ({ mutate }) }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ replace }) }));

describe("useOpenJobFromLink", () => {
  beforeEach(() => {
    mutate.mockReset();
    replace.mockReset();
    dispatch.mockReset();
    search = "job=job-1&tab=sent-offers";
  });

  it("fetches the linked job once and opens it", () => {
    const onOpen = vi.fn();
    const { rerender } = renderHook(() => useOpenJobFromLink("business", onOpen));
    rerender();

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate.mock.calls[0][0]).toEqual({ id: "job-1", type: "business" });
    mutate.mock.calls[0][1].onSuccess({ job: { id: "job-1" } });
    expect(onOpen).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalled();
  });

  it("does nothing without a job in the link or when switched off", () => {
    search = "tab=sent-offers";
    renderHook(() => useOpenJobFromLink("business", vi.fn()));
    search = "job=job-2";
    renderHook(() => useOpenJobFromLink("listing", vi.fn(), false));

    expect(mutate).not.toHaveBeenCalled();
  });
});
