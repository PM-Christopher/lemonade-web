"use client";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useEffect, useEffectEvent, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Label, Input, Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";

import { useSelector } from "react-redux";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bankAccountSchema, type BankAccountInput } from "@/features/settings/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { SubmitButton } from "@/components/global/SubmitButton";
import { resetEventState } from "@/features/events/event.slice";
import { useCreateEventMutation } from "@/features/events/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { RootState } from "@/redux/store";
import { useBanksQuery } from "@/features/shared/queries";
import { useVerifyAccountMutation } from "@/features/shared/mutations";

type BankAccountInterface = {
  toggle: () => void;
  option: boolean;
};

const BankAccountModal: React.FC<BankAccountInterface> = ({ toggle, option }) => {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();

  const [bankCode, setBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [, setError] = useState("");

  const { event, newTickets } = useSelector((state: RootState) => state.event);
  const { data: banksData, isLoading: loading } = useBanksQuery({
    enabled: option,
  });
  const banks = banksData?.banks ?? [];
  const createEventMutation = useCreateEventMutation();
  const verifyAccountMutation = useVerifyAccountMutation();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    setError: setFormError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BankAccountInput>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      bank_name: "",
      account_number: "",
      account_name: "",
    },
    mode: "onTouched",
  });

  const values = useWatch({ control });

  const onSubmit = (formValues: BankAccountInput) => {
    // Find the selected bank by matching the code
    const selectedBank = banks.find((bank) => bank.code === formValues.bank_name);
    if (!selectedBank) {
      setError("Select a bank");
      return;
    }
    const data = {
      event,
      tickets: newTickets,
      bank: {
        bank_name: selectedBank.name,
        account_name: formValues.account_name,
        account_number: formValues.account_number,
      },
    };
    createEventMutation.mutate(data, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Event created successfully",
            type: "success",
          }),
        );
        dispatch(resetEventState());
        push(routes.EVENT);
      },
      onError: (error) => {
        if (applyServerErrors(error, setFormError, ["bank_name", "account_number", "account_name"]))
          return;
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Error creating event",
            type: "error",
          }),
        );
      },
    });
  };

  const getAccount = useEffectEvent(() => {
    verifyAccountMutation.mutate(
      { bankCode, accountNumber },
      {
        onSuccess: (result) => {
          setValue("account_name", result.account_name, { shouldValidate: true });
        },
        onError: () => {
          setError("Invalid account details");
        },
      },
    );
  });

  // Look the account up once there's a bank and a full 10-digit number.
  useEffect(() => {
    if (bankCode && accountNumber.length === 10) {
      getAccount();
    }
  }, [bankCode, accountNumber]);

  return (
    <Dialog
      open={option}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Bank Account"}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="laptop:h-full laptop:w-160 h-screen w-full rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="cursor-pointer" onClick={toggle}>
                  <CloseIcon />
                </div>
                <p className="tracking-custom font-sans leading-6.75 font-semibold text-[18p]">
                  Bank Account
                </p>
              </div>
              <div>
                <SubmitButton
                  title="Submit"
                  isValid={isValid}
                  loading={isSubmitting}
                  classes="w-full h-12 rounded-xl px-3.5 p-2.5 rounded-xl border-step-color shadow-green-inset hover:shadow-green-inset-strong"
                />
              </div>
            </div>
            <div className="mt-10">
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Bank Name
                </Label>
                <select
                  className="form-font bg-light_grey h-12 w-full rounded-xl border-0 p-2"
                  {...register("bank_name", {
                    onChange: (e) => {
                      setBankCode(e.target.value);
                    },
                  })}
                >
                  {loading ? (
                    <option>Loading...</option>
                  ) : (
                    <>
                      <option value="">Select Bank</option>
                      {banks &&
                        banks.map((bank, index: number) => (
                          <option value={bank.code} key={index}>
                            {bank?.name}
                          </option>
                        ))}
                    </>
                  )}
                </select>
                <FieldError message={errors.bank_name?.message} />
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Account number
                </Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  value={values.account_number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setAccountNumber(value);
                      setValue("account_number", value, {
                        shouldValidate: true,
                        shouldTouch: true,
                      });
                    }
                  }}
                  maxLength={10}
                />
                <FieldError message={errors.account_number?.message} />
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Account name
                </Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  readOnly={true}
                  value={values.account_name}
                />
                <FieldError message={errors.account_name?.message} />
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default BankAccountModal;
