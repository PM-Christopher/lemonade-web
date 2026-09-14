"use client"
import React, {useEffect, useState} from 'react';
import {useRequest} from "@/hooks/useRequest";
import {useRouter} from "next/navigation";
import * as yup from "yup";
import {useFormik} from "formik";
import {useBusinessQuery} from "@/features/business/queries";
import {useUpdateListingMutation} from "@/features/business/mutations";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useAppDispatch} from "@/redux/hook";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {SingleFileUploader} from "@/components/global/FileUploader";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {MultiSelect} from "@/components/ui/multi-select";
import CountryList from "country-list-with-dial-code-and-flag";
import CloseIcon from "@/images/icons/close.svg";
import MultipleFileUploader from "@/components/global/MultipleFileUploader";
import MessageIcon from "@/images/icons/messageIcon.svg";
import PhoneIcon from "@/images/icons/phoneIcon.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import {FormikButton} from "@/components/global/FormikButton";
import MainLayout from "@/components/layouts/MainLayout";

interface businessCategories {
    value: string
    label: string
}

interface FormValues {
    services: string[];
    image: string
    name: string
    categories: string[]
    description: string
    city: string
    country: string
    service_rate: number
    gallery: string[]
    email: string
    phone_number: string
    website_url: string
}

const EditBusinessPage = ({params}: {params: {id: number}}) => {
    const router =  useRouter()
    const dispatch = useAppDispatch()
    const [isOpen, setIsOpen] = useState(false)
    const [isRequestOpen, setIsRequestOpen] = useState(false)
    const [displayCount, setDisplayCount] = useState(4); // Initial number of reviews to show
    const [reviews, setReviews] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
    const [frameworksList, setFrameworksList] = useState<businessCategories[]>([]);

    const { data } = useBusinessQuery(params.id)
    const updateListingMutation = useUpdateListingMutation(params.id)
    // NOTE: business-categories is a /shared/utilities/* endpoint not wired
    // to business.slice.ts at all — out of scope for this migration, same
    // as BusinessFilter.tsx's identical call (see
    // docs/ARCHITECTURE.md's business domain note).
    const { data: categories, loading: categoryLoading } = useRequest(`/shared/utilities/business-categories`)

    const addService = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            if (!formik.values.services.includes(inputValue.trim())) {
                // Update Formik field for services
                formik.setFieldValue('services', [...formik.values.services, inputValue.trim()]);
            }
            setInputValue(''); // Clear input field
        }
    };

    const removeService = (serviceToRemove: string) => {
        // Remove service and update Formik field
        const updatedServices = formik.values.services.filter(service => service !== serviceToRemove);
        formik.setFieldValue('services', updatedServices);
    };

    const editBusinessSchema = yup.object({
        image: yup
            .string()
            .required("Business image is required"),
        name: yup
            .string()
            .required("Business name is required"),
        categories: yup
            .array()
            .of(yup.string())
            .required("Categories is required")
            .min(1, "At least one category is required"),
        description: yup
            .string()
            .required("Description is required"),
        city: yup
            .string()
            .required("City is required"),
        country: yup
            .string()
            .required("Country is required"),
        services: yup
            .array()
            .of(yup.string())
            .required("Services is required")
            .min(1, "At least one service is required"),
        service_rate: yup
            .number()
            .nullable(),
        gallery: yup
            .array()
            .of(yup.string())
            .required("Portfolio gallery is required"),
        email: yup
            .string()
            .email()
            .required("Email is required"),
        phone_number: yup
            .string()
            .required("Phone number is required"),
        website_url: yup
            .string()
            .url("Website must be a valid URL")
            .required("Website url is required")
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            image: "",
            name: "",
            categories: [],
            description: "",
            city: "",
            country: "",
            services: [],
            service_rate: 0,
            gallery: [],
            email: "",
            phone_number: "",
            website_url: ""
        },
        validationSchema: editBusinessSchema,
        onSubmit: (values) => {
            updateListingMutation.mutate(values, {
                onSuccess: () => {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "business updated",
                            type: "success",
                        })
                    );
                    router.push("/business")
                },
                onError: () => {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Error adding business",
                            type: "error",
                        })
                    );
                },
            })
        },
    })

    useEffect(() => {
        if (categories?.categories) {
            const updatedFrameworksList = categories.categories.map((category: { name: string; slug: string }) => ({
                label: category.name,
                value: category.name
            }));
            setFrameworksList(updatedFrameworksList);
        }
    }, [categories]);

    useEffect(() => {
        if (data?.business) {
            formik.setFieldValue("image", data?.business?.image)
            formik.setFieldValue("name", data?.business?.name)
            formik.setFieldValue("categories", data?.business?.categories)
            formik.setFieldValue("description", data?.business?.description)
            formik.setFieldValue("city", data?.business?.city)
            formik.setFieldValue("country", data?.business?.country)
            formik.setFieldValue("services", data?.business?.services)
            formik.setFieldValue("service_rate", data?.business?.service_rate)
            formik.setFieldValue("gallery", data?.business?.gallery)
            formik.setFieldValue("email", data?.business?.email)
            formik.setFieldValue("phone_number", data?.business?.phone_number)
            formik.setFieldValue("website_url", data?.business?.website_url)

            setSelectedFrameworks([...data?.business?.categories])
        }

    }, [data?.business])

    return (
        <MainLayout>
            <section className="bg-white laptop:bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer" onClick={() => router.back()}>
                        <ChevronLeft />
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Edit business</p>
                    </div>
                </div>
                <section className="mt-0 laptop:mt-4 flex flex-col items-center">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="bg-white mt-0 laptop:mt-10 w-full laptop:w-[640px] p-[48px] rounded-[12px] flex flex-col">
                            <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px]">BUSINESS
                                DETAILS</p>
                            <SingleFileUploader length="single" type="business" setField={formik}
                                                image={data?.business?.image}
                                                title="Upload business image"/>
                            {formik.errors.image ? (
                                <p className="text-[#FF8D8D] text-[12px]">
                                    {formik.errors.image}
                                </p>
                            ) : null}
                            <div className="grid gap-2 mt-[24px]">
                                <Label htmlFor="business_name"
                                       className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Business
                                    name</Label>
                                <Input
                                    id="business_name"
                                    type="text"
                                    placeholder=""
                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                    name="business_name"
                                    value={formik.values.name}
                                    onChange={(e) => {
                                        formik.setFieldValue("name", e.target.value)
                                    }}
                                />
                                {formik.errors.name ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.name}
                                    </p>
                                ) : null}
                            </div>
                            <div className="grid gap-2 mt-[24px]">
                                <Label htmlFor="fullname"
                                       className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Business
                                    category</Label>
                                <MultiSelect
                                    options={frameworksList}
                                    onValueChange={(values) => {
                                        console.log({values})
                                        formik.setFieldValue("categories", values)
                                    }}
                                    defaultValue={selectedFrameworks}
                                    placeholder="Select Category"
                                    className="h-12 rounded-xl bg-light_grey form-font border-0 shadow-none"
                                />
                                {formik.errors.categories ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.categories}
                                    </p>
                                ) : null}
                            </div>
                            <div className="grid gap-2 mt-[24px]">
                                <Label htmlFor="fullname"
                                       className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Business
                                    description</Label>
                                <textarea
                                    className="h-[131px] rounded-xl bg-light_grey form-font border-0 resize-none p-4"
                                    value={formik.values.description}
                                    onChange={(e) => {
                                        formik.setFieldValue("description", e.target.value)
                                    }}
                                ></textarea>
                                {formik.errors.description ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.description}
                                    </p>
                                ) : null}
                            </div>
                            <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">BUSINESS
                                ADDRESS</p>
                            <div className="grid gap-2 mt-[24px]">
                                <Label htmlFor="city"
                                       className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">City</Label>
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder=""
                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                    value={formik.values.city}
                                    onChange={(e) => {
                                        formik.setFieldValue("city", e.target.value)
                                    }}
                                />
                                {formik.errors.city ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.city}
                                    </p>
                                ) : null}
                            </div>
                            <div className="grid gap-2 mt-[24px]">
                                <Label htmlFor="country"
                                       className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Country</Label>
                                <select id="country" className="h-12 rounded-xl bg-light_grey form-font border-0 px-2"
                                        value={formik.values.country} onChange={(e) => {
                                    formik.setFieldValue("country", e.target.value)
                                }}>
                                    <option value="">Select country</option>
                                    {
                                        CountryList.getAll().map((country, index) => (
                                            <option value={country.name} key={index}>{country.name}</option>
                                        ))
                                    }
                                </select>
                                {formik.errors.country ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.country}
                                    </p>
                                ) : null}
                            </div>
                            <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">SERVICE
                                DETAILS</p>
                            <div className="grid gap-2 mt-[24px]">
                                <Label htmlFor="services"
                                       className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Services</Label>
                                <Input
                                    id="services"
                                    type="text"
                                    placeholder=""
                                    value={inputValue}
                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={addService}
                                />
                                {formik.errors.services ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.services}
                                    </p>
                                ) : null}
                                <p className="text-text-grey my-[5px] text-[12px]">Click <i>enter</i> to add service</p>
                                <div className="mt-[8px] flex flex-wrap gap-[4px]">
                                    {formik.values.services.map((service, index) => (
                                        <div
                                            className="flex p-[8px] px-[12px] gap-[8px] rounded-[8px] items-center bg-grey-20"
                                            key={index}>
                                            <p className="text-text-grey font-semi-normal text-[14px]">{service}</p>
                                            <CloseIcon className="w-[8px] h-[8px] cursor-pointer"
                                                       onClick={() => removeService(service)}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-2 mt-[24px]">
                            <Label htmlFor="city"
                                       className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">Service
                                    Rate (Optional)</Label>
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder=""
                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                    value={formik.values.service_rate}
                                    onChange={(e) => {
                                        formik.setFieldValue("service_rate", e.target.value)
                                    }}
                                />
                            </div>
                            <p className="font-normal text-[14px] text-text-grey mt-[24px]">Portfolio
                                gallery <span>(Optional)</span></p>
                            <MultipleFileUploader length="multiple" type="business" setField={formik}
                                                  images={formik.values.gallery}
                                                  title="Upload multiple images"/>
                            <p className="font-sans font-bold text-[12px] text-light-black leading-[14.4px] mt-[48px]">CONTACT
                                DETAILS</p>
                            <div className="grid grid-cols-1">
                                <div
                                    className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                                    <div>
                                        <MessageIcon/>
                                    </div>
                                    <div className="w-full">
                                        <input
                                            id="search"
                                            type="text"
                                            className="rounded-xl text-[14px] font-sans bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
                                            placeholder="Email address"
                                            value={formik.values.email}
                                            onChange={(e) => {
                                                formik.setFieldValue("email", e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                {formik.errors.email ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.email}
                                    </p>
                                ) : null}
                            </div>
                            <div className="grid grid-cols-1">
                                <div
                                    className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                                    <div>
                                        <PhoneIcon/>
                                    </div>
                                    <div className="w-full">
                                        <input
                                            id="search"
                                            type="text"
                                            className="rounded-xl text-[14px] font-sans bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
                                            placeholder="Phone number"
                                            value={formik.values.phone_number}
                                            onChange={(e) => {
                                                formik.setFieldValue("phone_number", e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                {formik.errors.phone_number ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.phone_number}
                                    </p>
                                ) : null}
                            </div>
                            <div className="grid grid-cols-1">
                                <div
                                    className="flex items-center gap-3 bg-light_grey p-2 px-[12px] rounded-[12px] mt-[16px]">
                                    <div>
                                        <WebIcon/>
                                    </div>
                                    <div className="w-full">
                                        <input
                                            id="search"
                                            type="text"
                                            className="rounded-xl text-[14px] font-sans bg-light_grey border-0 focus:outline-none focus:ring-0 focus:border-transparent w-full"
                                            placeholder="Website URL"
                                            value={formik.values.website_url}
                                            onChange={(e) => {
                                                formik.setFieldValue("website_url", e.target.value)
                                            }}
                                        />
                                    </div>
                                </div>
                                {formik.errors.website_url ? (
                                    <p className="text-[#FF8D8D] text-[12px]">
                                        {formik.errors.website_url}
                                    </p>
                                ) : null}
                            </div>
                            <FormikButton title="Save changes" error={formik.isValid} loading={formik.isSubmitting}
                                          classes="mt-[32px] h-[48px] p-[14px] px-[48px] rounded-[12px] border-[1px] border-step-color shadow-custom-bottom"/>
                        </div>
                    </form>
                </section>
            </section>
        </MainLayout>
    );
}

export default EditBusinessPage;