import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTransactionPolling } from "./useTransactionPolling";

const verifyTransaction = vi.fn();
vi.mock("@/features/transaction/api", () => ({
  transactionApi: { verifyTransaction: (...args: unknown[]) => verifyTransaction(...args) },
}));

const pending = { status: "unsuccessful" as const, data: undefined };
const paid = { status: "successful" as const, data: undefined };

const config = (onSuccess = vi.fn()) => ({
  transactionId: "T1",
  isSuccess: (r: { status: string }) => r.status === "successful",
  onSuccess,
  pollingInterval: 1000,
});

describe("useTransactionPolling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    verifyTransaction.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("polls until the payment succeeds, then stops", async () => {
    verifyTransaction.mockResolvedValueOnce(pending).mockResolvedValue(paid);
    const onSuccess = vi.fn();

    renderHook(() => useTransactionPolling(config(onSuccess)));
    await act(() => vi.advanceTimersByTimeAsync(5000));

    expect(verifyTransaction).toHaveBeenCalledTimes(2);
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("waits for a slow check before starting the next one", async () => {
    let resolve: (v: typeof paid) => void = () => {};
    verifyTransaction.mockReturnValue(new Promise((r) => (resolve = r)));
    const onSuccess = vi.fn();

    renderHook(() => useTransactionPolling(config(onSuccess)));
    await act(() => vi.advanceTimersByTimeAsync(5000));
    expect(verifyTransaction).toHaveBeenCalledTimes(1);

    await act(async () => resolve(paid));
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it("ignores a response that lands after unmount", async () => {
    let resolve: (v: typeof paid) => void = () => {};
    verifyTransaction.mockReturnValue(new Promise((r) => (resolve = r)));
    const onSuccess = vi.fn();

    const { unmount } = renderHook(() => useTransactionPolling(config(onSuccess)));
    unmount();
    await act(async () => resolve(paid));

    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("does nothing without a transaction", async () => {
    renderHook(() => useTransactionPolling(null));
    await act(() => vi.advanceTimersByTimeAsync(5000));

    expect(verifyTransaction).not.toHaveBeenCalled();
  });
});
