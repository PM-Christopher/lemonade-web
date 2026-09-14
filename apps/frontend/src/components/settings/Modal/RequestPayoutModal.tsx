import React, {useEffect, useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {FormikButton} from "@/components/global/FormikButton";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {useAppDispatch} from "@/redux/hook";
import * as yup from "yup";
import {useFormik} from "formik";
import {useBanksQuery} from "@/features/shared/queries";
import {useVerifyAccountMutation} from "@/features/shared/mutations";
import {useCreateBankAccountMutation} from "@/features/settings/mutations";
import {updateToastifyReducer} from "@/redux/toastifySlice";
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

    const { data: banksData, isLoading: loading } = useBanksQuery({enabled: isOpen});
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
            account_name: ""
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
                    formik.resetForm()
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Bank account added — you can now request a payout",
                            type: "success",
                        })
                    );
                    dispatch(updateHasBankAccount())
                    toggle()
                },
                onError: (err: any) => {
                    formik.resetForm()
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

    const getAccount = () => {
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