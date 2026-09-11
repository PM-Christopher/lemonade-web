import React from 'react';
import {Button} from "@/components/ui/button";
import CloseIcon from "@/images/icons/close.svg";
import * as yup from "yup";
import {useFormik} from "formik";
import {axiosInstance} from "@/lib/axiosInstane";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import MultipleFileUploader from "@/components/global/MultipleFileUploader";
import {FormikButton} from "@/components/global/FormikButton";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";
import {useAppDispatch} from "@/redux/hook";
import {disputeJob} from "@/features/business/business.slice";

interface SubmitDisputeModalProps {
    isOpen: boolean;
    toggle: () => void;
}

const SubmitDisputeModal: React.FC<SubmitDisputeModalProps> = ({isOpen, toggle}) => {
    const {job, disputeLoading} = useSelector((state: RootState) => state.business)
    const disputeJobSchema = yup.object({
        dispute: yup
            .string()
            .trim()
            .required("Dispute is required"),
        attachments: yup
            .array()
            .of(yup.string())
    });
    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues: {
            dispute: "",
            attachments: [],
        },
        validationSchema: disputeJobSchema,
        onSubmit: async (values) => {
            await handleDispute(values)
        },
    })

    const handleDispute = async (values: any) => {
        const {payload} = await dispatch(disputeJob({url: `/user/business/jobs/${job.id}/dispute`, data: values}))
        if (payload.status) {
            toggle()
            dispatch(updateToastifyReducer({
                show: true,
                message: payload?.message,
                type: "success",
            }))
        } else {
            dispatch(updateToastifyReducer({
                show: true,
                message: 'Something went wrong. Please try again',
                type: "error",
            }))
        }
    }

    return (
        <div
            className={`fixed inset-0 bg-gray-900 bg-opacity-50 flex items-start justify-center z-50 p-4 ${
                isOpen ? "flex" : "hidden"
            }`}
        >
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white rounded-2xl shadow-xl w-full max-w-[640px] max-h-[90vh] p-6 laptop:p-8 overflow-y-auto scroll-smooth hide-scrollbar"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white z-10 pt-2 pb-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="cursor-pointer p-1 rounded-full hover:bg-gray-100 transition"
                            onClick={toggle}
                        >
                            <CloseIcon/>
                        </div>
                        <h2 className="font-sans font-semibold text-[16px] laptop:text-[18px] text-black">
                            Dispute Job
                        </h2>
                    </div>

                    <FormikButton
                        title="Submit"
                        classes="h-[40px] w-[90px] rounded-[12px]"
                        loading={formik.isSubmitting}
                        error={formik.isValid}
                    />
                </div>

                {/* Body */}
                <div className="flex flex-col gap-6 pb-6">
                    {/* Dispute Textarea */}
                    <div className="flex flex-col w-full gap-2">
                        <div className="flex justify-between">
                            <label
                                htmlFor="dispute"
                                className="font-normal text-[14px] text-text-grey"
                            >
                                Dispute
                            </label>
                            <span className="font-normal text-[12px] text-text-grey">
                                200 characters
                            </span>
                        </div>
                        <textarea
                            id="dispute"
                            name="dispute"
                            className={`w-full h-[130px] p-4 rounded-xl bg-light_grey border ${
                                formik.touched.dispute && formik.errors.dispute
                                    ? "border-red-500"
                                    : "border-gray-200"
                            } focus:outline-none focus:ring-2 focus:ring-step-color focus:border-transparent placeholder:text-[14px] placeholder:text-grey-40 placeholder:font-normal text-[14px] transition`}
                            placeholder="Dispute details"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.dispute}
                        />
                        {formik.touched.dispute && formik.errors.dispute && (
                            <p className="text-red-500 text-[12px] mt-1">
                                {formik.errors.dispute}
                            </p>
                        )}
                    </div>

                    {/* Attachments */}
                    <div className="flex flex-col w-full gap-2">
                        <label className="font-normal text-[14px] text-text-grey">
                            Attachments
                        </label>
                        <MultipleFileUploader
                            length="multiple"
                            type="dispute"
                            setField={formik}
                            images={[]}
                            title="Upload multiple images"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default SubmitDisputeModal;