"use client";
import React, {useEffect, useState} from "react";
import CloseIcon from "@/images/icons/close.svg";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useAppDispatch} from "@/redux/hook";
import {useRouter} from "next/navigation";
import {useRequest} from "@/hooks/useRequest";
import {useSelector} from "react-redux";
import {verifyAccount} from "@/redux/general.slice";
import * as yup from "yup";
import {useFormik} from "formik";
import {FormikButton} from "@/components/global/FormikButton";
import {createEvent, resetEventState} from "@/features/events/event.slice";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {RootState} from "@/redux/store";
import {useBanksQuery} from "@/features/shared/queries";

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

    const {loading: accountLoading} = useSelector(
        (state: any) => state.general
    );
    const {event, newTickets} = useSelector((state: RootState) => state.event);
    const { data: banksData, isLoading: loading } = useBanksQuery({enabled: option});
    const banks = banksData?.banks ?? [];

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
            const selectedBank = banks.find(
                (bank) => bank.code === values.bank_name
            );
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
            dispatch(createEvent({ data })).then((res) => {
                if (res.payload.status) {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Event created successfully",
                            type: "success",
                        })
                    );
                    dispatch(resetEventState());
                    router.push("/event");
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Error creating event",
                            type: "error",
                        })
                    );
                }
            });
        },
    });

    useEffect(() => {
        if (accountNumber.length === 10) {
            getAccount();
        }
    }, [accountNumber]);

    const getAccount = () => {
        dispatch(
            verifyAccount({bank_code: bankCode, account_number: accountNumber})
        ).then((res) => {
            if (res.payload.status) {
                console.log({account_name: res.payload.data.account_name});
                formik.setFieldValue("account_name", res.payload.data.account_name);
            } else {
                setError("Invalid account details");
            }
        });
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${
                option ? "flex" : "hidden"
            }`}
        >
            <form onSubmit={formik.handleSubmit}>
                <div className="bg-white rounded-lg shadow-lg w-full laptop:w-[640px] p-6 h-screen laptop:h-full">
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
                            <FormikButton
                                title="Submit"
                                error={formik.isValid}
                                loading={formik.isSubmitting}
                                classes="w-full h-[48px] rounded-xl px-[14px] p-[10px] rounded-[12px] border-step-color shadow-green-inset hover:shadow-green-inset-strong"
                            />
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
                                type="text"
                                placeholder=""
                                className="h-12 rounded-xl bg-light_grey form-font border-0"
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
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BankAccountModal;
