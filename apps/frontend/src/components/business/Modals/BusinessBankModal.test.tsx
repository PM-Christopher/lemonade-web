import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BusinessBankModal from "./BusinessBankModal";

const mocks = vi.hoisted(() => ({
  lookUp: vi.fn(),
  save: vi.fn(),
  dispatch: vi.fn(),
}));

vi.mock("@/images/icons/close.svg", () => ({ default: () => null }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => mocks.dispatch }));
vi.mock("@/features/shared/queries", () => ({
  useBanksQuery: () => ({
    isLoading: false,
    data: { banks: [{ id: 1, name: "Access Bank", slug: "access", code: "044" }] },
  }),
}));
vi.mock("@/features/shared/mutations", () => ({
  useVerifyAccountMutation: () => ({ mutate: mocks.lookUp, isPending: false }),
}));
vi.mock("@/features/settings/mutations", () => ({
  useCreateBankAccountMutation: () => ({ mutateAsync: mocks.save }),
}));

const setup = () => {
  const onSaved = vi.fn();
  render(<BusinessBankModal isOpen toggle={vi.fn()} onSaved={onSaved} />);
  return { onSaved };
};

const fillIn = () => {
  fireEvent.click(screen.getByRole("button", { name: "Bank name" }));
  fireEvent.click(screen.getByRole("option", { name: "Access Bank" }));
  fireEvent.change(screen.getByLabelText("Account number"), { target: { value: "2209123122" } });
};

describe("BusinessBankModal", () => {
  it("looks up the account name once the bank and a 10-digit number are in", async () => {
    mocks.lookUp.mockImplementation((_args, options) =>
      options.onSuccess({ account_name: "Christine Joseph" }),
    );
    setup();

    fillIn();

    await waitFor(() =>
      expect(mocks.lookUp).toHaveBeenCalledWith(
        { bankCode: "044", accountNumber: "2209123122" },
        expect.any(Object),
      ),
    );
    expect(await screen.findByDisplayValue("Christine Joseph")).toBeInTheDocument();
  });

  it("saves the account and tells the caller", async () => {
    mocks.lookUp.mockImplementation((_args, options) =>
      options.onSuccess({ account_name: "Christine Joseph" }),
    );
    mocks.save.mockResolvedValue({});
    const { onSaved } = setup();
    fillIn();
    await screen.findByDisplayValue("Christine Joseph");

    fireEvent.submit(document.getElementById("business-bank-form")!);

    await waitFor(() =>
      expect(mocks.save).toHaveBeenCalledWith({
        bank_name: "Access Bank",
        bank_code: "044",
        account_name: "Christine Joseph",
        account_number: "2209123122",
      }),
    );
    expect(onSaved).toHaveBeenCalled();
  });

  it("does not save until a bank is picked", async () => {
    setup();

    fireEvent.submit(document.getElementById("business-bank-form")!);

    expect(await screen.findByText("Bank name is required")).toBeInTheDocument();
    expect(mocks.save).not.toHaveBeenCalled();
  });
});
