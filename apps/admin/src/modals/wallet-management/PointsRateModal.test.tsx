import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PointsRateModal from "./PointsRateModal";

const mutateMock = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
}));

vi.mock("@/features/wallet/mutations", () => ({
  useUpdatePointsRateMutation: () => ({ mutate: mutateMock, isPending: false }),
}));

describe("PointsRateModal", () => {
  it("prefills the real current rate and submits the parsed major-unit value", async () => {
    render(<PointsRateModal isOpen={true} toggle={vi.fn()} currency="NGN" currentRate="1" />);

    const input = screen.getByPlaceholderText("e.g. 1") as HTMLInputElement;
    expect(input.value).toBe("1");

    fireEvent.change(input, { target: { value: "1.5" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    await vi.waitFor(() => {
      expect(mutateMock).toHaveBeenCalledWith({ currency: "NGN", rate: 1.5 }, expect.any(Object));
    });
  });

  it("names the currency in the explanation copy, not a hardcoded one", () => {
    render(<PointsRateModal isOpen={true} toggle={vi.fn()} currency="USD" currentRate="2" />);

    expect(screen.getByText(/100 USD/)).toBeInTheDocument();
  });
});
