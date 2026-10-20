"use client";
import React, { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContentBare, DialogTitle, FieldError, Input, Label } from "@lemonade/ui";
import CloseIcon from "@/images/icons/close.svg";
import { SearchableSelect } from "@/components/global/SearchableSelect";
import { SubmitButton } from "@/components/global/SubmitButton";
import { useBanksQuery } from "@/features/shared/queries";
import { useVerifyAccountMutation } from "@/features/shared/mutations";
import { useCreateBankAccountMutation } from "@/features/settings/mutations";
import { bankAccountSchema, type BankAccountInput } from "@/features/settings/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { errorMessage } from "@/lib/api-error";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type BusinessBankModalProps = {
  isOpen: boolean;
  toggle: () => void;
  // Called once the account is saved, so the caller can carry on listing.
  onSaved: () => void;
};

const FORM_ID = "business-bank-form";

// Collects the payout account a business owner is paid into.
const BusinessBankModal = ({ isOpen, toggle, onSaved }: BusinessBankModalProps) => {
  const dispatch = useAppDispatch();
  const { data: banksData, isLoading: banksLoading } = useBanksQuery({ enabled: isOpen });
  const verifyAccount = useVerifyAccountMutation();
  const createBankAccount = useCreateBankAccountMutation();
  const banks = banksData?.banks ?? [];

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BankAccountInput>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: { bank_name: "", account_number: "", account_name: "" },
    mode: "onTouched",
  });

  const [bankCode, accountNumber, accountName] = useWatch({
    control,
    name: ["bank_name", "account_number", "account_name"],
  });

  // Look the account up once there is a bank and a full 10-digit number.
  const { mutate: lookUp, isPending: isLookingUp } = verifyAccount;
  useEffect(() => {
    if (!bankCode || accountNumber.length !== 10) {
      setValue("account_name", "");
      return;
    }
    lookUp(
      { bankCode, accountNumber },
      {
        onSuccess: (result) =>
          setValue("account_name", result.account_name, { shouldValidate: true }),
        onError: () =>
          setError("account_number", {
            message: "We couldn't find that account. Check the details.",
          }),
      },
    );
  }, [bankCode, accountNumber, lookUp, setValue, setError]);

  const onSubmit = async (values: BankAccountInput) => {
    const bank = banks.find((item) => item.code === values.bank_name);
    if (!bank) {
      setError("bank_name", { message: "Select a bank" });
      return;
    }
    try {
      await createBankAccount.mutateAsync({
        bank_name: bank.name,
        bank_code: bank.code,
        account_name: values.account_name,
        account_number: values.account_number,
      });
      onSaved();
    } catch (error) {
      if (applyServerErrors(error, setError, ["bank_name", "account_number", "account_name"]))
        return;
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(error, "We couldn't save your bank account."),
          type: "error",
        }),
      );
    }
  };

  const submit = (classes: string) => (
    <SubmitButton
      title="Submit"
      form={FORM_ID}
      isValid={isValid && !isLookingUp}
      loading={isSubmitting}
      classes={classes}
    />
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Bank account</DialogTitle>
        <div className="laptop:h-auto laptop:w-120 laptop:rounded-lg laptop:p-6 flex h-screen w-screen flex-col bg-white p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </button>
              <p className="tracking-custom text-body-l font-sans font-semibold">Bank account</p>
            </div>
            <div className="laptop:block hidden">
              {submit("h-10 rounded-xl px-5 border-step-color")}
            </div>
          </div>

          <form
            id={FORM_ID}
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-1 flex-col gap-6"
          >
            <div className="grid gap-2">
              <Label
                htmlFor="bank-name"
                className="text-text-grey text-label font-sans font-normal"
              >
                Bank name
              </Label>
              <Controller
                name="bank_name"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    id="bank-name"
                    options={banks.map((bank) => ({ value: bank.code, label: bank.name }))}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Select bank"
                    searchPlaceholder="Search bank name"
                    emptyText="No bank found"
                    ariaLabel="Bank name"
                    loading={banksLoading}
                  />
                )}
              />
              <FieldError message={errors.bank_name?.message} />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="account-number"
                className="text-text-grey text-label font-sans font-normal"
              >
                Account number
              </Label>
              <Input
                id="account-number"
                inputMode="numeric"
                maxLength={10}
                className="form-font bg-light_grey h-12 rounded-xl border-0"
                {...register("account_number", {
                  onChange: (event) => {
                    event.target.value = event.target.value.replace(/\D/g, "");
                  },
                })}
              />
              <FieldError message={errors.account_number?.message} />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="account-name"
                className="text-text-grey text-label font-sans font-normal"
              >
                Account name
              </Label>
              <Input
                id="account-name"
                readOnly
                value={isLookingUp ? "Checking..." : accountName}
                className="form-font bg-light_grey h-12 rounded-xl border-0"
              />
              <FieldError message={errors.account_name?.message} />
            </div>
          </form>

          <div className="laptop:hidden mt-6">
            {submit("h-12 w-full rounded-xl border-step-color")}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default BusinessBankModal;
