import React, { useEffect, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { FormikButton } from "@/components/global/FormikButton";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Dialog,
  DialogContentBare,
  DialogTitle,
} from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import * as yup from "yup";
import { useFormik } from "formik";
import { useBanksQuery } from "@/features/shared/queries";
import { useVerifyAccountMutation } from "@/features/shared/mutations";
import { useCreateBankAccountMutation } from "@/features/settings/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { updateHasBankAccount } from "@/features/authentication/authSlice";

type RequestPayoutInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const RequestPayoutModal: React.FC<RequestPayoutInterface> = ({
  isOpen,
  toggle,
}) => {
  const [bankCode, setBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const { data: banksData, isLoading: loading } = useBanksQuery({
    enabled: isOpen,
  });
  const banks = banksData?.banks ?? [];
  const verifyAccountMutation = useVerifyAccountMutation();
  const createBankAccountMutation = useCreateBankAccountMutation();

  const bankAccountSchema = yup.object({
    bank_name: yup.string().required(),
    account_number: yup.string().required(),
    account_name: yup.string().required(),
  });

  const formik = useFormik({
    initialValues: {
      bank_name: "",
      account_number: "",
      account_name: "",
    },
    validationSchema: bankAccountSchema,
    onSubmit: async (values) => {
      // FOUND, FIXED (found live-testing, not a guess — see the
      // matching NOTE in features/settings/api.ts): this modal is
      // shown exactly when the user has no bank account yet
      // (wallet/page.tsx's handlePayoutRequest), collects bank_name/
      // account_number/account_name, and its own success toast says
      // "Error creating account" and dispatches updateHasBankAccount()
      // — every sign this was always meant to create a bank account.
      // The old code called settingsApi.requestPayout with this exact
      // payload instead, which the backend's RequestWithdrawalRequest
      // doesn't accept at all (it only takes amount/bank_account_id),
      // so this modal could never have actually worked. Now calls
      // createBankAccount, matching the payload it already builds.
      createBankAccountMutation.mutate(values, {
        onSuccess: () => {
          formik.resetForm();
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Bank account added — you can now request a payout",
              type: "success",
            }),
          );
          dispatch(updateHasBankAccount());
          toggle();
        },
        onError: (err: any) => {
          formik.resetForm();
          dispatch(
            updateToastifyReducer({
              show: true,
              message: err?.message || "Error creating account",
              type: "error",
            }),
          );
        },
      });
    },
  });

  const getAccount = () => {
    formik.setFieldValue("account_name", "");
    verifyAccountMutation.mutate(
      { bankCode, accountNumber },
      {
        onSuccess: (res) => {
          setError("");
          formik.setFieldValue("account_name", res.account_name);
        },
        onError: () => {
          setError("Invalid account details");
          formik.setFieldValue("account_name", "");
        },
      },
    );
  };

  useEffect(() => {
    if (accountNumber.length === 10) {
      getAccount();
    }
    // getAccount closes over formik (recreated every keystroke) and the
    // mutation object (recreated every render) — including it here would
    // re-verify on every render instead of only when accountNumber
    // reaches 10 digits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Bank Account</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <div className="w-[640px] rounded-lg bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="cursor-pointer" onClick={toggle}>
                  <CloseIcon />
                </div>
                <p className="font-sans font-semibold leading-[27px] tracking-custom text-[18p]">
                  Bank Account
                </p>
              </div>
              <div>
                <FormikButton
                  loading={formik.isSubmitting}
                  title="Submit"
                  error={formik.isValid}
                />
              </div>
            </div>
            <div className="mt-10">
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Bank Name
                </Label>
                <select
                  value={formik.values.bank_name}
                  className="form-font h-12 w-full rounded-xl border-0 bg-light_grey p-2"
                  onChange={(e) => {
                    setBankCode(e.target.value);
                    formik.setFieldValue("bank_name", e.target.value);
                  }}
                >
                  {loading ? (
                    <option>Loading...</option>
                  ) : (
                    <>
                      <option value="">Select Bank</option>
                      {banks &&
                        banks.map((bank: any, index: number) => (
                          <option value={bank.code} key={index}>
                            {bank?.name}
                          </option>
                        ))}
                    </>
                  )}
                </select>
              </div>
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Account number
                </Label>
                <Input
                  id="fullname"
                  type="number"
                  placeholder=""
                  className="form-font h-12 rounded-xl border-0 bg-light_grey"
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    formik.setFieldValue("account_number", e.target.value);
                  }}
                />
              </div>
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Account name
                </Label>
                <Input
                  id="fullname"
                  type="text"
                  placeholder=""
                  className="form-font h-12 rounded-xl border-0 bg-light_grey"
                  readOnly={true}
                  value={formik.values.account_name}
                />
                {error && <p className={"text-[13px] text-red-2"}>{error}</p>}
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default RequestPayoutModal;
