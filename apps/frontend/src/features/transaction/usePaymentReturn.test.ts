import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePaymentReturn } from "./usePaymentReturn";

const mutate = vi.fn();
const replace = vi.fn();
const dispatch = vi.fn();
let search = "";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(search) }));
vi.mock("@/hooks/useNavigation", () => ({ useNavigation: () => ({ replace }) }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("./mutations", () => ({ useVerifyTransactionMutation: () => ({ mutate }) }));

const respond = (status: "successful" | "unsuccessful") =>
  mutate.mockImplementation((_vars, opts) => opts.onSuccess({ status, data: { id: 7 } }));

describe("usePaymentReturn", () => {
  beforeEach(() => {
    mutate.mockReset();
    replace.mockReset();
    dispatch.mockReset();
    search = "trxref=T1&reference=T1&tab=info";
  });

  it("does nothing without a trxref", () => {
    search = "tab=info";
    renderHook(() => usePaymentReturn(vi.fn()));

    expect(mutate).not.toHaveBeenCalled();
  });

  it("verifies the trxref, clears it from the URL and reports the payment", () => {
    respond("successful");
    const onPaid = vi.fn();

    renderHook(() => usePaymentReturn(onPaid));

    expect(mutate).toHaveBeenCalledWith({ trx_ref: "T1" }, expect.any(Object));
    expect(replace).toHaveBeenCalledWith("?tab=info");
    expect(onPaid).toHaveBeenCalledWith({ id: 7 });
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("shows an error instead of success when the payment wasn't confirmed", () => {
    respond("unsuccessful");
    const onPaid = vi.fn();

    renderHook(() => usePaymentReturn(onPaid));

    expect(onPaid).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("?tab=info");
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: expect.objectContaining({ type: "error" }) }),
    );
  });

  it("verifies once per trxref across re-renders", () => {
    const { rerender } = renderHook(({ cb }) => usePaymentReturn(cb), {
      initialProps: { cb: vi.fn() },
    });
    rerender({ cb: vi.fn() });

    expect(mutate).toHaveBeenCalledTimes(1);
  });
});
