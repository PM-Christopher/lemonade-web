import React, { useEffect, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { FormikButton } from "@/components/global/FormikButton";
import { Label, Input, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import * as yup from "yup";
import { useFormik } from "formik";
import { useBanksQuery } from "@/features/shared/queries";
import type { Bank } from "@/features/shared/api";
import { useVerifyAccountMutation } from "@/features/shared/mutations";
import { useCreateBankAccountMutation } from "@/features/settings/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { updateHasBankAccount } from "@/features/authentication/authSlice";

type RequestPayoutInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const RequestPayoutModal: React.FC<RequestPayoutInterface> = ({ isOpen, toggle }) => {
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
    validateOnMount: true,
    onSubmit: async (values) => {
      // This modal adds the user's bank account; payouts need one first.
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
        onError: (err: Error) => {
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
    // Verify only when the number changes; getAccount is recreated every render.
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
                <button
                  type="button"
                  aria-label="Close"
                  className="cursor-pointer"
                  onClick={toggle}
                >
                  <CloseIcon />
                </button>
                <p className="tracking-custom font-sans text-lg leading-[27px] font-semibold">
                  Bank Account
                </p>
              </div>
              <div>
                <FormikButton loading={formik.isSubmitting} title="Submit" error={formik.isValid} />
              </div>
            </div>
            <div className="mt-10">
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="bank_name"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Bank Name
                </Label>
                <select
                  id="bank_name"
                  value={formik.values.bank_name}
                  className="form-font bg-light_grey h-12 w-full rounded-xl border-0 p-2"
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
                        banks.map((bank: Bank, index: number) => (
                          <option value={bank.code} key={index}>
                            {bank?.name}
                          </option>
                        ))}
                    </>
                  )}
                </select>
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="account_number"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Account number
                </Label>
                <Input
                  id="account_number"
                  type="number"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    formik.setFieldValue("account_number", e.target.value);
                  }}
                />
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="account_name"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Account name
                </Label>
                <Input
                  id="account_name"
                  type="text"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  readOnly={true}
                  value={formik.values.account_name}
                />
                {error && <p className={"text-red-2 text-[13px]"}>{error}</p>}
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default RequestPayoutModal;
