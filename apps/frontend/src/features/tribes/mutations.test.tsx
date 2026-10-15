import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { tribeKeys } from "./queries";

const createThread = vi.fn();

vi.mock("./api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./api")>()),
  tribesApi: { createThread: (...args: unknown[]) => createThread(...args) },
}));

const { useCreateThreadMutation } = await import("./mutations");

describe("useCreateThreadMutation", () => {
  beforeEach(() => createThread.mockReset());

  it("refetches the tribe's threads and details so the new thread shows up", async () => {
    createThread.mockResolvedValue({ thread: { id: "t1" } });
    const queryClient = new QueryClient();
    const invalidate = vi.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useCreateThreadMutation("naija-arts"), { wrapper });

    result.current.mutate({ tribeId: 1, data: { topic: "Hi", thoughts: "Hello" } as never });

    await waitFor(() =>
      expect(invalidate).toHaveBeenCalledWith({ queryKey: tribeKeys.threads("naija-arts") }),
    );
    expect(invalidate).toHaveBeenCalledWith({ queryKey: tribeKeys.detail("naija-arts") });
  });
});
