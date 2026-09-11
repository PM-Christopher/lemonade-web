import React, {useEffect, useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {FormikButton} from "@/components/global/FormikButton";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {useAppDispatch} from "@/redux/hook";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import * as yup from "yup";
import {useFormik} from "formik";
import {verifyAccount} from "@/redux/general.slice";
import {axiosInstance} from "@/lib/axiosInstane";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {RootState} from "@/redux/store";
import {getBanks} from "@/features/transaction/transaction.slice";
import {updateHasBankAccount} from "@/features/authentication/authSlice";

type RequestPayoutInterface = {
    isOpen: boolean;
    toggle: () => void;
};

const RequestPayoutModal: React.FC<RequestPayoutInterface> = ({isOpen, toggle}) => {

    const [bankCode, setBankCode] = useState<string>("");
    const [accountNumber, setAccountNumber] = useState("");
    const [error, setError] = useState("");
    const dispatch = useAppDispatch();

    const { banks, loading } = useSelector((state: RootState) => state.transaction);


    useEffect(() => {
        dispatch(getBanks())
    }, []);

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
            await requestPayout()
        },
    });

    const getAccount = () => {
        formik.setFieldValue("account_name", "");
        dispatch(
            verifyAccount({bank_code: bankCode, account_number: accountNumber})
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

    const requestPayout = async () => {
        try {
            const formData = {
                bank_name: formik.values.bank_name,
                account_number: formik.values.account_number,
                account_name: formik.values.account_name,
                amount: 100000
            }
            const {data} = await axiosInstance.post("/profile/wallet/request-payout", formData)
            if (data.status) {
                formik.resetForm()
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Your payment is being processed and will be disbursed into the account details provided below",
                        type: "success",
                    })
                );
                dispatch(updateHasBankAccount())
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
            formik.resetForm()
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
                                <CloseIcon/>
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
                            <select
                                value={formik.values.bank_name}
                                className="h-12 rounded-xl bg-light_grey form-font border-0 p-2 w-full"
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

export default RequestPayoutModal;