import React, { useEffect, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import {
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContentBare,
  DialogTitle,
} from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import { useFormik } from "formik";
import * as yup from "yup";
import { FormikButton } from "@/components/global/FormikButton";
import { useBanksQuery } from "@/features/shared/queries";
import { useVerifyAccountMutation } from "@/features/shared/mutations";
import { useCreateBankAccountMutation } from "@/features/settings/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import type { Bank } from "@/features/shared/api";

type BankAccountInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const BankAccountModal: React.FC<BankAccountInterface> = ({ isOpen, toggle }) => {
  const [bankCode, setBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const { data: banksData } = useBanksQuery({
    enabled: isOpen,
  });
  const data = banksData?.banks ?? [];
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
      createBankAccountMutation.mutate(values, {
        onSuccess: () => {
          formik.resetForm();
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Account created successfully",
              type: "success",
            }),
          );
          toggle();
        },
        onError: (err: Error) => {
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
    // re-verify on every render instead of only when accountNumber reaches
    // 10 digits.
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
                <p className="tracking-custom font-sans leading-[27px] font-semibold text-[18p]">
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
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Bank Name
                </Label>
                <Select
                  onValueChange={(value) => {
                    const selectedItem = JSON.parse(value);
                    setBankCode(selectedItem.code);
                    formik.setFieldValue("bank_name", selectedItem.name);
                  }}
                >
                  <SelectTrigger aria-label="Bank Name">
                    <SelectValue placeholder="Select Bank" />
                  </SelectTrigger>
                  <SelectContent className="form-font">
                    {data?.map((item: Bank, index: number) => (
                      <SelectItem value={JSON.stringify(item)} key={index}>
                        {item?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Account number
                </Label>
                <Input
                  id="fullname"
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
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Account name
                </Label>
                <Input
                  id="fullname"
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

export default BankAccountModal;
