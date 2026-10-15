import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import RequestPayoutModal from "./RequestPayoutModal";

const verifyMutate = vi.fn();
const createMutate = vi.fn();
const dispatch = vi.fn();

vi.mock("@/images/icons/close.svg", () => ({ default: () => <svg aria-hidden="true" /> }));
vi.mock("@/redux/hook", () => ({ useAppDispatch: () => dispatch }));
vi.mock("@/features/shared/queries", () => ({
  useBanksQuery: () => ({
    data: {
      banks: [
        { id: 1, name: "Test Bank", slug: "test-bank", code: "058" },
        { id: 2, name: "Other Bank", slug: "other-bank", code: "044" },
      ],
    },
    isLoading: false,
  }),
}));
vi.mock("@/features/shared/mutations", () => ({
  useVerifyAccountMutation: () => ({ mutate: verifyMutate }),
}));
vi.mock("@/features/settings/mutations", () => ({
  useCreateBankAccountMutation: () => ({ mutate: createMutate }),
}));

const renderModal = () => render(<RequestPayoutModal isOpen toggle={vi.fn()} />);

const fillAccount = () => {
  fireEvent.change(screen.getByLabelText("Bank Name"), { target: { value: "058" } });
  fireEvent.change(screen.getByLabelText("Account number"), { target: { value: "0123456789" } });
};

describe("RequestPayoutModal (add bank account)", () => {
  beforeEach(() => {
    verifyMutate.mockReset();
    createMutate.mockReset();
    dispatch.mockReset();
  });

  it("looks up the account name from the server once the number has 10 digits", async () => {
    verifyMutate.mockImplementation((_vars, opts) =>
      opts.onSuccess({ account_name: "ADA LOVELACE" }),
    );
    renderModal();

    fillAccount();

    expect(verifyMutate).toHaveBeenCalledWith(
      { bankCode: "058", accountNumber: "0123456789" },
      expect.any(Object),
    );
    expect(await screen.findByDisplayValue("ADA LOVELACE")).toBeInTheDocument();
  });

  it("waits for a bank before looking up the account", async () => {
    renderModal();

    fireEvent.change(screen.getByLabelText("Account number"), { target: { value: "0123456789" } });
    expect(verifyMutate).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Bank Name"), { target: { value: "058" } });
    await waitFor(() =>
      expect(verifyMutate).toHaveBeenCalledWith(
        { bankCode: "058", accountNumber: "0123456789" },
        expect.any(Object),
      ),
    );
  });

  it("looks the account up again when the bank changes", async () => {
    renderModal();
    fillAccount();

    fireEvent.change(screen.getByLabelText("Bank Name"), { target: { value: "044" } });

    await waitFor(() =>
      expect(verifyMutate).toHaveBeenLastCalledWith(
        { bankCode: "044", accountNumber: "0123456789" },
        expect.any(Object),
      ),
    );
  });

  it("submits the verified account and keeps the button disabled until it is valid", async () => {
    verifyMutate.mockImplementation((_vars, opts) =>
      opts.onSuccess({ account_name: "ADA LOVELACE" }),
    );
    renderModal();
    const submit = screen.getByRole("button", { name: "Submit" });
    await waitFor(() => expect(submit).toBeDisabled());

    fillAccount();
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);

    await waitFor(() =>
      expect(createMutate).toHaveBeenCalledWith(
        { bank_name: "058", account_number: "0123456789", account_name: "ADA LOVELACE" },
        expect.any(Object),
      ),
    );
  });

  it("shows the server's message when the account can't be saved", async () => {
    verifyMutate.mockImplementation((_vars, opts) =>
      opts.onSuccess({ account_name: "ADA LOVELACE" }),
    );
    createMutate.mockImplementation((_vars, opts) =>
      opts.onError(new Error("Bank account already exists")),
    );
    renderModal();

    fillAccount();
    const submit = screen.getByRole("button", { name: "Submit" });
    await waitFor(() => expect(submit).toBeEnabled());
    fireEvent.click(submit);

    await waitFor(() =>
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            message: "Bank account already exists",
            type: "error",
          }),
        }),
      ),
    );
  });

  it("has no accessibility violations", async () => {
    renderModal();
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
