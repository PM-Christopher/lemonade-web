import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { businessApi } from "./api";
import { useRequestServiceMutation } from "./mutations";

describe("useRequestServiceMutation", () => {
  it("sends the quote amount as a number, not the typed text", async () => {
    const send = vi
      .spyOn(businessApi, "requestService")
      .mockResolvedValue({} as Awaited<ReturnType<typeof businessApi.requestService>>);
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useRequestServiceMutation("b1"), { wrapper });

    result.current.mutate({
      services: ["Salon & Spa"],
      amount: "1,500",
      additional_information: "",
    });

    await waitFor(() => expect(send).toHaveBeenCalled());
    expect(send).toHaveBeenCalledWith("b1", expect.objectContaining({ amount: 1500 }));
  });
});
