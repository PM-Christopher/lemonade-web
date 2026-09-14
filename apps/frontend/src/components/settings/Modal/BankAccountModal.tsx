import React, { useEffect, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/redux/hook";
import {useFormik} from "formik";
import * as yup from "yup";
import {FormikButton} from "@/components/global/FormikButton";
import {useBanksQuery} from "@/features/shared/queries";
import {useVerifyAccountMutation} from "@/features/shared/mutations";
import {useCreateBankAccountMutation} from "@/features/settings/mutations";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type BankAccountInterface = {
  isOpen: boolean;
  toggle: () => void;
};

const BankAccountModal: React.FC<BankAccountInterface> = ({
  isOpen,
  toggle,
}) => {
  const [bankCode, setBankCode] = useState<string>("");
  const [accountNumber, setAccountNumber] = useState("");
   const [error, setError] = useState("");
  const dispatch = useAppDispatch();

  const { data: banksData, isLoading: loading } = useBanksQuery({enabled: isOpen});
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
      account_name: ""
    },
    validationSchema: bankAccountSchema,
    onSubmit: async (values) => {
      createBankAccountMutation.mutate(values, {
        onSuccess: () => {
          formik.resetForm()
          dispatch(
              updateToastifyReducer({
                show: true,
                message: "Account created successfully",
                type: "success",
              })
          );
          toggle()
        },
        onError: (err: any) => {
          dispatch(
              updateToastifyReducer({
                show: true,
                message: err?.message || "Error creating account",
                type: "error",
              })
          );
        },
      });
    },
  });

  const getAccount =  () => {
    formik.setFieldValue("account_name", "");
    verifyAccountMutation.mutate({bankCode, accountNumber}, {
      onSuccess: (res) => {
        setError('')
        formik.setFieldValue("account_name", res.account_name);
      },
      onError: () => {
        setError("Invalid account details");
        formik.setFieldValue("account_name", "");
      },
    });
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
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon />
              </div>
              <p className="font-sans font-semibold text-[18p] leading-[27px] tracking-custom">
                Bank Account
              </p>
            </div>
            <div>
              <FormikButton loading={formik.isSubmitting} title="Submit" error={formik.isValid}/>
            </div>
          </div>
          <div className="mt-10">
            <div className="grid gap-2 mt-[24px]">
              <Label
                  htmlFor="fullname"
                  className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
              >
                Bank Name
              </Label>
              <Select
                  onValueChange={(value) => {
                    const selectedItem = JSON.parse(value);
                    setBankCode(selectedItem.code);
                    formik.setFieldValue('bank_name', selectedItem.name);
                  }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Bank" />
                </SelectTrigger>
                <SelectContent className="form-font">
                  {data?.map((item: any, index: number) => (
                      <SelectItem value={JSON.stringify(item)} key={index}>{item?.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 mt-[24px]">
              <Label
                  htmlFor="fullname"
                  className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
              >
                Account number
              </Label>
              <Input
                  id="fullname"
                  type="number"
                  placeholder=""
                  className="h-12 rounded-xl bg-light_grey form-font border-0"
                  onChange={(e) => {
                    setAccountNumber(e.target.value);
                    formik.setFieldValue("account_number", e.target.value);
                  }}
              />
            </div>
            <div className="grid gap-2 mt-[24px]">
              <Label
                  htmlFor="fullname"
                  className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
              >
                Account name
              </Label>
              <Input
                  id="fullname"
                  type="text"
                  placeholder=""
                  className="h-12 rounded-xl bg-light_grey form-font border-0"
                  readOnly={true}
                  value={formik.values.account_name}
              />
              {
                  error && (
                      <p className={'text-[13px] text-red-2'}>{error}</p>
                  )
              }
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BankAccountModal;
