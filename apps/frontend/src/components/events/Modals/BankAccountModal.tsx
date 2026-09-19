"use client";
import React, { useEffect, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import {
  Button,
  Label,
  Input,
  Dialog,
  DialogContentBare,
  DialogTitle,
} from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useFormik } from "formik";
import { FormikButton } from "@/components/global/FormikButton";
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

const BankAccountModal: React.FC<BankAccountInterface> = ({
  toggle,
  option,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [bankCode, setBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
  const [error, setError] = useState("");

  const { event, newTickets } = useSelector((state: RootState) => state.event);
  const { data: banksData, isLoading: loading } = useBanksQuery({
    enabled: option,
  });
  const banks = banksData?.banks ?? [];
  const createEventMutation = useCreateEventMutation();
  const verifyAccountMutation = useVerifyAccountMutation();

  const createEventSchema = yup.object({
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
    validationSchema: createEventSchema,
    onSubmit: async (values) => {
      // Find the selected bank by matching the code
      const selectedBank = banks.find((bank) => bank.code === values.bank_name);
      if (!selectedBank) {
        setError("Select a bank");
        return;
      }
      const data = {
        event,
        tickets: newTickets,
        bank: {
          bank_name: selectedBank.name,
          account_name: values.account_name,
          account_number: values.account_number,
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
          router.push("/event");
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error creating event",
              type: "error",
            }),
          );
        },
      });
    },
  });

  useEffect(() => {
    if (accountNumber.length === 10) {
      getAccount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountNumber]);

  const getAccount = () => {
    verifyAccountMutation.mutate(
      { bankCode, accountNumber },
      {
        onSuccess: (result) => {
          formik.setFieldValue("account_name", result.account_name);
        },
        onError: () => {
          setError("Invalid account details");
        },
      },
    );
  };

  return (
    <Dialog
      open={option}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">{"Bank Account"}</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <div className="h-screen w-full rounded-lg bg-white p-6 shadow-lg laptop:h-full laptop:w-[640px]">
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
                  title="Submit"
                  error={formik.isValid}
                  loading={formik.isSubmitting}
                  classes="w-full h-[48px] rounded-xl px-[14px] p-[10px] rounded-[12px] border-step-color shadow-green-inset hover:shadow-green-inset-strong"
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
                  type="text"
                  placeholder=""
                  className="form-font h-12 rounded-xl border-0 bg-light_grey"
                  value={formik.values.account_number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setAccountNumber(value);
                      formik.setFieldValue("account_number", value);
                    }
                  }}
                  maxLength={10}
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
              </div>
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default BankAccountModal;
