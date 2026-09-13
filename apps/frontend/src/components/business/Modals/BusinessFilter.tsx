import CloseIcon from "@/images/icons/close.svg";
import {Label} from "@/components/ui/label";
import LocationIcon from "@/images/icons/location.svg";
import React, {useState} from "react";
import {useRequest} from "@/hooks/useRequest";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import NairaIcon from "@/images/icons/nairaIcon.svg";
import {resetFilter} from "@/features/events/event.slice";
import * as yup from "yup";
import {useFormik} from "formik";
import {axiosInstance} from "@/lib/axiosInstane";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {FormikButton} from "@/components/global/FormikButton";
import {useAppDispatch} from "@/redux/hook";
import {filterBusiness} from "@/features/business/business.slice";

type FilterBusinessInterface = {
    toggle: () => void,
    isOpen: boolean
}

const BusinessFilter = ({toggle, isOpen}: FilterBusinessInterface) => {
    const dispatch = useAppDispatch()
    const { data, loading } = useRequest(`/shared/utilities/business-categories`, "GET")

    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("")
    const [serviceType, setServiceType] = useState("")
    const [startRange, setStartRange] = useState("")
    const [endRange, setEndRange] = useState("")

    const handleCategoryChange = (value: string) => {
        formik.setFieldValue("category", value)
    };

    const businessFilterSchema = yup.object({
        category: yup.string(),
        location: yup.string(),
        service_type: yup.string(),
        start_range: yup.string(),
        end_range: yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            category: "",
            location: "",
            start_range: "",
            end_range: "",
            service_type: "",
        },
        validationSchema: businessFilterSchema,
        onSubmit: async (values) => {
            dispatch(filterBusiness({value: values})).then((res:any) => {})
            toggle()
        },
    })

    const handleResetFilter = () => {
        formik.resetForm()
        toggle()
    }

    return (
        <div className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <div className="bg-white rounded-lg shadow-lg w-[480px] p-6 laptop:h-auto laptop:max-h-[90vh] overflow-y-auto hide-scrollbar">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon/>
                        </div>
                        <p>Business filter</p>
                    </div>
                </div>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mt-[24px] flex flex-col">
                        <div className="grid gap-2 mt-[24px]">
                            <Label htmlFor="fullname" className="font-sans font-normal text-[14px] leading-[16.8px] text-black-light uppercase">
                                Location
                            </Label>
                            <div className="mt-2">
                                <div className="flex h-[48px] w-full bg-light_grey rounded-lg p-[12px] items-center gap-[8px]">
                                    <LocationIcon />
                                    <input
                                        id="search"
                                        type="text"
                                        value={formik.values.location}
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent px-[4px] w-full"
                                        placeholder="Enter location"
                                        onChange={(e) => {
                                            formik.setFieldValue("location", e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/*business category*/}
                        <div className="grid gap-2 mt-[24px]">
                            <Label htmlFor="fullname" className="font-sans font-normal text-[14px] leading-[16.8px] text-black-light uppercase">
                                Business Category
                            </Label>
                            <div className="mt-2">
                                <Select onValueChange={handleCategoryChange}>
                                    <SelectTrigger className="bg-light_grey rounded-xl border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full px-[16px] h-[48px] font-sans">
                                        <SelectValue
                                            placeholder={
                                                <span className="font-sans font-semibold text-[12px] leading-[14.4px] text-text-grey">Category</span>
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="form-font">
                                        <SelectItem value="all">All Locations</SelectItem>
                                        {
                                            data?.categories?.map((item: {name: string, slug: string}, idx:number) => (
                                                <SelectItem value={item.slug} key={idx}>
                                                    {item.name}
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/*service type*/}
                        <div className="grid gap-2 mt-[24px]">
                            <Label htmlFor="fullname" className="font-sans font-normal text-[14px] leading-[16.8px] text-black-light uppercase">
                                Service Type
                            </Label>
                            <div className="mt-2">
                                <div className="flex h-[48px] w-full bg-light_grey rounded-lg p-[12px] items-center gap-[8px]">
                                    <input
                                        id="search"
                                        type="text"
                                        value={formik.values.service_type}
                                        className="rounded-xl text-[14px] bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent px-[4px] font-sans w-full"
                                        placeholder="Service Type"
                                        onChange={(e) => {
                                            formik.setFieldValue("service_type", e.target.value)
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {/*range*/}
                        <div className="grid mt-[24px]">
                            <Label htmlFor="fullname" className="font-sans font-normal text-[14px] leading-[16.8px] text-black-light uppercase">
                                Budget Range
                            </Label>
                            <div className="mt-2 flex justify-between items-center gap-[12px]">
                                <div className={'flex h-[48px] w-full bg-light_grey rounded-lg p-[12px] items-center gap-[8px]'}>
                                    <NairaIcon />
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none focus:outline-none text-sm"
                                        placeholder="1000"
                                        value={formik.values.start_range}
                                        onChange={(e) => {
                                            // Only digits 1–9 (no 0, no symbols)
                                            e.target.value = e.target.value.replace(/[^1-9]/g, ""); // update field with cleaned value
                                            formik.setFieldValue("start_range", e.target.value)
                                        }}
                                        inputMode="numeric" // brings up number pad on mobile
                                        pattern="[1-9][0-9]*" // regex: must start with 1–9
                                    />
                                </div>
                                <span>-</span>
                                <div className={'flex h-[48px] w-full bg-light_grey rounded-lg p-[12px] items-center gap-[8px]'}>
                                    <NairaIcon />
                                    <input
                                        type="text"
                                        className="w-full bg-transparent border-none outline-none focus:outline-none text-sm"
                                        placeholder="10000"
                                        value={formik.values.end_range}
                                        onChange={(e) => {
                                            // Only digits 1–9 (no 0, no symbols)
                                            e.target.value = e.target.value.replace(/[^1-9]/g, ""); // update field with cleaned value
                                            formik.setFieldValue("end_range", e.target.value)
                                        }}
                                        inputMode="numeric" // brings up number pad on mobile
                                        pattern="[1-9][0-9]*" // regex: must start with 1–9
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-[30px] flex gap-[4px]">
                            <button
                                className="w-full px-[14px] p-[10px] rounded-[12px] border-[1px] border-light-grey-50"
                                onClick={handleResetFilter}
                            >
                                <p className="font-sans font-semi-normal text-[16px] text-black-light">Reset filter</p>
                            </button>

                            <FormikButton
                                title="Apply filter"
                                error={formik.isValid}
                                loading={formik.isSubmitting}
                                classes="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color shadow-custom-bottom"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BusinessFilter;