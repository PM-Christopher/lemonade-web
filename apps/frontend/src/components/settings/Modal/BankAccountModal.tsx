import React, { useEffect, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useRequest } from "@/hooks/useRequest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/redux/hook";
import { verifyAccount } from "@/redux/general.slice";
import {useFormik} from "formik";
import {createTickets} from "@/features/events/event.slice";
import * as yup from "yup";
import {FormikButton} from "@/components/global/FormikButton";
import {axiosInstance} from "@/lib/axiosInstane";
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

  const { authToken } = useSelector((state: any) => state.auth);
  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };

  const { data, loading } = useRequest(
    `/get-all-banks`,
  );

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
      await createAccount()
    },
  });

  const getAccount =  () => {
    formik.setFieldValue("account_name", "");
    console.log({"status": "Loading!!!!", bankCode, accountNumber})
    dispatch(
      verifyAccount({ bank_code: bankCode, account_number: accountNumber })
    ).then((res) => {
      if (res.payload.status) {
        setError('')
        formik.setFieldValue("account_name", res.payload.data.account_name);
      } else {
        setError("Invalid account details");
        formik.setFieldValue("account_name", "");
      }
    });
  };

  const createAccount = async () => {
    try {
      const formData = {
        bank_name: formik.values.bank_name,
        account_number: formik.values.account_number,
        account_name: formik.values.account_name,
      }
      const { data } = await axiosInstance.post("/profile/bank-account/create-account", formData, getHeader())
      if(data.status) {
        formik.resetForm()
        dispatch(
            updateToastifyReducer({
              show: true,
              message: "Account created successfully",
              type: "success",
            })
        );
        toggle()
      } else {
        dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error creating account",
              type: "error",
            })
        );
      }
    } catch (err: any) {
      dispatch(
          updateToastifyReducer({
            show: true,
            message: err?.response?.data?.message || "error",
            type: "error",
          })
      );
    }
  }

  useEffect(() => {
    if (accountNumber.length === 10) {
      getAccount();
    }
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
