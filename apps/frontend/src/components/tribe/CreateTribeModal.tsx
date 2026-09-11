import React, {useRef, useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import {FormikButton} from "@/components/global/FormikButton";
import Image from "next/image";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import DollarBillIcon from "@/images/icons/dollar-bill.svg";
import InfoIcon from "@/images/icons/infoIcon.svg";
import PadlockIcon from "@/images/icons/padlock.svg";
import * as yup from "yup";
import {useFormik} from "formik";
import {tribesApi} from "@/features/tribes/api";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {authFailure, loadStop} from "@/features/authentication/authSlice";
import {useAppDispatch} from "@/redux/hook";
import {useRouter} from "next/navigation";
import {useRequest} from "@/hooks/useRequest";
import Switch from "react-switch";
import {useMediaQuery} from "react-responsive";

interface CreateTribeModalProps {
    modalFlag: boolean;
    activateModal: () => void;
}

const CreateTribeModal = ({modalFlag, activateModal}: CreateTribeModalProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [image, setImage] = useState(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [monetizedCheck, setMonetizedChecked] = useState(false);
    const [privateCheck, setPrivateCheck] = useState(false);
    const isMobile = useMediaQuery({query: "(max-width: 640px)"});

    const createTribeSchema = yup.object({
        tribe_name: yup.string().required("Tribe name is required"),
        category: yup.string().required("Category is required"),
        description: yup.string().required("Description is required"),
        image: yup.string().required("Image is required"),
        private: yup.boolean().required(),
        monetized: yup.boolean().required(),
        membership_fee: yup
            .number()
            .default(0)
            .when("monetized", {
                is: true,
                then: (schema) => schema.required("Membership fee is required"),
            }),
        members: yup.array().when("private", {
            is: true,
            then: (schema) => schema.of(yup.string()),
        }),
    });

    const formik = useFormik({
        initialValues: {
            tribe_name: "",
            category: "",
            description: "",
            image: "",
            private: false,
            monetized: false,
            membership_fee: 0,
            members: [],
        },
        validationSchema: createTribeSchema,
        onSubmit: async (values) => {
            values.membership_fee = values.membership_fee ? values.membership_fee : 0;
            try {
                const {data} = await tribesApi.createTribe(values);
                if (data.status) {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Tribe created",
                            type: "success",
                        })
                    );
                    activateModal();
                    // redirect to the newly created tribe
                    router.push(`/tribe/${data?.data?.tribe?.slug}`);
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Something went wrong",
                            type: "error",
                        })
                    );
                }
            } catch (err: any) {
                dispatch(authFailure());
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: err?.response?.data?.message || "error",
                        type: "error",
                    })
                );
            } finally {
                dispatch(loadStop());
            }
        },
    });

    const {data: tribe_cat} = useRequest(
        `/shared/utilities/tribes-categories`,
    );

    const handleChange = (type: string) => {
        if (type === "monetized") {
            setMonetizedChecked((prev) => !prev);
        } else if (type === "private") {
            setPrivateCheck((prev) => !prev);
        }
    };

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const {data} = await tribesApi.upload(formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (data.status) {
                    setImage(data.data.image);
                    await formik.setFieldValue("image", data.data.image);
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Image uploaded",
                            type: "success",
                        })
                    );
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Error uploading image",
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
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${modalFlag ? "opacity-100 visible bg-gray-800/50" : "opacity-0 invisible"}`}
        >
            <div
                className="bg-white rounded-none laptop:rounded-lg shadow-2xl w-full laptop:w-[640px] p-6 h-screen laptop:h-auto laptop:max-h-[90vh] overflow-y-auto
               flex flex-col justify-between hide-scrollbar"
            >
                <form onSubmit={formik.handleSubmit} className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-[8px]">
                            <CloseIcon onClick={activateModal} className="cursor-pointer"/>
                            <p className="font-semiBold text-[18px]">Create Tribe</p>
                        </div>
                        <div className="hidden tablet:block">
                            <FormikButton
                                title="Create tribe"
                                error={formik.isValid}
                                loading={formik.isSubmitting}
                                classes="px-[14px] p-[10px] rounded-[12px] border-step-color"
                            />
                        </div>
                    </div>
                    <div className="flex justify-center mt-[48px] tablet:mt-[24px]">
                        {image ? (
                            <Image
                                src={image}
                                alt="upload"
                                width={89}
                                height={83}
                                className="border-[1px] cursor-pointer w-[89px] h-[89px] rounded-[24px]"
                                onClick={handleImageClick}
                            />
                        ) : (
                            <Image
                                src={"/images/upload.png"}
                                alt="upload"
                                width={89}
                                height={83}
                                className="cursor-pointer"
                                onClick={handleImageClick}
                            />
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{display: "none"}}
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="mt-[16px] flex flex-col">
                        <div className="grid gap-2">
                            <Label
                                htmlFor="tribe-name"
                                className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey"
                            >
                                Tribe name
                            </Label>
                            <Input
                                id="tribe-name"
                                type="text"
                                className="h-[48px] rounded-xl bg-light_grey form-font border-0"
                                value={formik.values.tribe_name}
                                onChange={(e: any) => {
                                    formik.setFieldValue("tribe_name", e.target.value);
                                }}
                            />
                        </div>
                        <div className="grid gap-2 mt-4">
                            <Label
                                htmlFor="tribe-name"
                                className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey"
                            >
                                Category
                            </Label>
                            <Select
                                value={formik.values.category}
                                onValueChange={(value) => {
                                    formik.setFieldValue("category", value);
                                }}
                            >
                                <SelectTrigger className="bg-light_grey rounded-xl border-0 h-[48px]">
                                    <SelectValue placeholder="Select category"/>
                                </SelectTrigger>
                                <SelectContent className="form-font">
                                    {tribe_cat?.categories?.map((category: any, index: number) => (
                                            <SelectItem value={category?.name} key={index}>
                                                {category?.name}
                                            </SelectItem>
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2 mt-4">
                            <div className="flex justify-between items-center">
                                <Label
                                    htmlFor="description"
                                    className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey"
                                >
                                    Description
                                </Label>
                                <p className="font-normal text-text-grey text-[12px]">
                                    100 characters
                                </p>
                            </div>
                            <Textarea
                                id="description"
                                className="rounded-xl bg-light_grey form-font border-0 h-[91px] resize-none"
                                placeholder="Description about this tribe"
                                value={formik.values.description}
                                onChange={(e: any) => {
                                    formik.setFieldValue("description", e.target.value);
                                }}
                            />
                        </div>

                        <div className="flex flex-col mt-8">
                            <div className="flex justify-between mb-[24px]">
                                <div className="flex gap-2">
                                    <div>
                                        <DollarBillIcon/>
                                    </div>
                                    <div>
                                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-black-light">
                                            Monetize tribe
                                        </p>
                                        <p className="font-sans font-normal text-text-grey text-[12px] leading-[14.4px]">
                                            User will pay to be part of your tribe
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Switch
                                        onChange={(change) => {
                                            handleChange("monetized");
                                            formik.setFieldValue("monetized", change);
                                        }}
                                        checked={monetizedCheck}
                                        checkedIcon={false}
                                        uncheckedIcon={false}
                                        onColor="#9BE303"
                                    />
                                </div>
                            </div>
                            {monetizedCheck && (
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="tribe-name"
                                        className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey"
                                    >
                                        Acceptance fee (₦)
                                    </Label>
                                    <Input
                                        id="tribe-name"
                                        type="number"
                                        className="h-[48px] rounded-xl bg-light_grey form-font border-0"
                                        value={formik.values.membership_fee}
                                        onChange={(e: any) => {
                                            formik.setFieldValue("membership_fee", e.target.value);
                                        }}
                                    />
                                    <div className="flex gap-2 items-center mt-[5px] mb-[24px]">
                                        <InfoIcon/>
                                        <p className="text-text-grey font-normal text-[12px]">
                                            {" "}
                                            10% of membership fees go to the Lemonade Network
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <div className="flex gap-2">
                                    <div>
                                        <PadlockIcon/>
                                    </div>
                                    <div>
                                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-black-light">
                                            Private tribe
                                        </p>
                                        <p className="font-sans font-normal text-text-grey text-[12px] leading-[14.4px]">
                                            Tribe will only be available to invited members
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <Switch
                                        onChange={(change) => {
                                            handleChange("private");
                                            formik.setFieldValue("private", change);
                                        }}
                                        checked={privateCheck}
                                        checkedIcon={false}
                                        uncheckedIcon={false}
                                        onColor="#9BE303"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {isMobile && (
                        <div
                            className="flex flex-col fixed bottom-0 left-0 w-full pt-[16px] pr-[16px] pb-[24px] pl-[16px] justify-center items-center">
                            <div className="mt-auto">
                                <FormikButton
                                    title="Create tribe"
                                    error={formik.isValid}
                                    loading={formik.isSubmitting}
                                    classes="w-[343px] px-[14px] p-[10px] rounded-[12px] border-step-color h-[48px]"
                                />
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateTribeModal;