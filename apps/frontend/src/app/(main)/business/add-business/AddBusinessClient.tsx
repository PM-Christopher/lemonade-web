"use client";
import React, { useMemo, useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { SingleFileUploader } from "@/components/global/FileUploader";
import { Label, Input } from "@lemonade/ui";
import MessageIcon from "@/images/icons/messageIcon.svg";
import PhoneIcon from "@/images/icons/phoneIcon.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import CloseIcon from "@/images/icons/close.svg";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useFormik } from "formik";
import { useAppDispatch } from "@/redux/hook";
import { MultiSelect } from "@/components/ui/multi-select";
import { useBusinessCategoriesQuery } from "@/features/shared/queries";
import CountryList from "country-list-with-dial-code-and-flag";
import { FormikButton } from "@/components/global/FormikButton";
import MultipleFileUploader from "@/components/global/MultipleFileUploader";
import { useCreateListingMutation } from "@/features/business/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import MainLayout from "@/components/layouts/MainLayout";

interface businessCategories {
  value: string;
  label: string;
}

interface FormValues {
  services: string[];
  image: string;
  name: string;
  categories: string[];
  description: string;
  city: string;
  country: string;
  service_rate: number;
  gallery: string[];
  email: string;
  phone_number: string;
  website_url: string;
}

const AddBusinessClient = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const createListingMutation = useCreateListingMutation();
  const [inputValue, setInputValue] = useState("");

  const addService = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      if (!formik.values.services.includes(inputValue.trim())) {
        // Update Formik field for services
        formik.setFieldValue("services", [...formik.values.services, inputValue.trim()]);
      }
      setInputValue(""); // Clear input field
    }
  };

  const removeService = (serviceToRemove: string) => {
    // Remove service and update Formik field
    const updatedServices = formik.values.services.filter((service) => service !== serviceToRemove);
    formik.setFieldValue("services", updatedServices);
  };

  const { data } = useBusinessCategoriesQuery();
  const frameworksList = useMemo<businessCategories[]>(() => {
    if (!data?.categories) return [];
    return data.categories.map((category: { name: string }) => ({
      label: category.name,
      value: category.name,
    }));
  }, [data]);

  const [selectedFrameworks] = useState<string[]>([]);

  const createBusinessSchema = yup.object({
    image: yup.string().required("Business image is required"),
    name: yup.string().required("Business name is required"),
    categories: yup
      .array()
      .of(yup.string())
      .required("Categories is required")
      .min(1, "At least one category is required"),
    description: yup.string().required("Description is required"),
    city: yup.string().required("City is required"),
    country: yup.string().required("Country is required"),
    services: yup
      .array()
      .of(yup.string())
      .required("Services is required")
      .min(1, "At least one service is required"),
    service_rate: yup.number().nullable(),
    gallery: yup.array().of(yup.string()).required("Portfolio gallery is required"),
    email: yup.string().email().required("Email is required"),
    phone_number: yup.string().required("Phone number is required"),
    website_url: yup
      .string()
      .url("Website must be a valid URL")
      .required("Website url is required"),
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
      website_url: "",
    },
    validationSchema: createBusinessSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      createListingMutation.mutate(values, {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "business uploaded",
              type: "success",
            }),
          );
          router.push("/business");
        },
        onError: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error adding business",
              type: "error",
            }),
          );
        },
      });
    },
  });

  return (
    <MainLayout>
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="border-b-grey-20 border-t-grey-20 flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1">
            <ChevronLeft className="cursor-pointer" onClick={() => router.back()} />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Add business</p>
          </div>
        </div>
        <section className="laptop:mt-4 mt-0 flex flex-col items-center">
          <form onSubmit={formik.handleSubmit}>
            <div className="laptop:mt-10 laptop:w-[640px] mt-0 flex w-full flex-col rounded-xl bg-white p-12">
              <p className="text-light-black font-sans text-[12px] leading-[14.4px] font-bold">
                BUSINESS DETAILS
              </p>
              <SingleFileUploader
                length="single"
                type="business"
                setField={formik}
                image=""
                title="Upload business image"
              />
              {formik.errors.image ? (
                <p className="text-[12px] text-[#FF8D8D]">{formik.errors.image}</p>
              ) : null}
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="business_name"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Business name
                </Label>
                <Input
                  id="business_name"
                  type="text"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  name="business_name"
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.setFieldValue("name", e.target.value);
                  }}
                />
                {formik.errors.name ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.name}</p>
                ) : null}
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Business categories
                </Label>
                <MultiSelect
                  options={frameworksList}
                  onValueChange={(values) => {
                    formik.setFieldValue("categories", values);
                  }}
                  defaultValue={selectedFrameworks}
                  placeholder="Select Category"
                  className="form-font bg-light_grey h-12 rounded-xl border-0 shadow-none"
                />
                {formik.errors.categories ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.categories}</p>
                ) : null}
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Business description
                </Label>
                <textarea
                  className="form-font bg-light_grey h-[131px] resize-none rounded-xl border-0 p-4"
                  value={formik.values.description}
                  onChange={(e) => {
                    formik.setFieldValue("description", e.target.value);
                  }}
                ></textarea>
                {formik.errors.description ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.description}</p>
                ) : null}
              </div>
              <p className="text-light-black mt-12 font-sans text-[12px] leading-[14.4px] font-bold">
                BUSINESS ADDRESS
              </p>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="city"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  value={formik.values.city}
                  onChange={(e) => {
                    formik.setFieldValue("city", e.target.value);
                  }}
                />
                {formik.errors.city ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.city}</p>
                ) : null}
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="country"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Country
                </Label>
                <select
                  id="country"
                  className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                  value={formik.values.country}
                  onChange={(e) => {
                    formik.setFieldValue("country", e.target.value);
                  }}
                >
                  <option value="">Select country</option>
                  {CountryList.getAll().map((country, index) => (
                    <option value={country.name} key={index}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {formik.errors.country ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.country}</p>
                ) : null}
              </div>
              <p className="text-light-black mt-12 font-sans text-[12px] leading-[14.4px] font-bold">
                SERVICE DETAILS
              </p>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="city"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Services
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder=""
                  value={inputValue}
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={addService}
                />
                {formik.errors.services ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.services}</p>
                ) : null}
                <p className="text-text-grey my-[5px] text-[12px]">
                  Click <i>enter</i> to add service
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {formik.values.services.map((service, index) => (
                    <div
                      className="bg-grey-20 flex items-center gap-2 rounded-[8px] p-2 px-3"
                      key={index}
                    >
                      <p className="font-semi-normal text-text-grey text-[14px]">{service}</p>
                      <CloseIcon
                        className="h-2 w-2 cursor-pointer"
                        onClick={() => removeService(service)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="city"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Service Rate (Optional)
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  value={formik.values.service_rate}
                  onChange={(e) => {
                    formik.setFieldValue("service_rate", e.target.value);
                  }}
                />
              </div>
              <p className="text-text-grey mt-6 text-[14px] font-normal">
                Portfolio gallery <span>(Optional)</span>
              </p>
              <MultipleFileUploader
                length="multiple"
                type="business"
                setField={formik}
                images={[]}
                title="Upload multiple images"
              />
              <p className="text-light-black mt-12 font-sans text-[12px] leading-[14.4px] font-bold">
                CONTACT DETAILS
              </p>
              <div className="grid grid-cols-1">
                <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                  <div>
                    <MessageIcon />
                  </div>
                  <div className="w-full">
                    <input
                      id="search"
                      type="text"
                      className="bg-light_grey w-full border-0 pl-[5px] font-sans text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                      placeholder="Email address"
                      value={formik.values.email}
                      onChange={(e) => {
                        formik.setFieldValue("email", e.target.value);
                      }}
                    />
                  </div>
                </div>
                {formik.errors.email ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.email}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-1">
                <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                  <div>
                    <PhoneIcon />
                  </div>
                  <div className="w-full">
                    <input
                      id="search"
                      type="text"
                      className="bg-light_grey w-full border-0 pl-[5px] font-sans text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                      placeholder="Phone number"
                      value={formik.values.phone_number}
                      onChange={(e) => {
                        formik.setFieldValue("phone_number", e.target.value);
                      }}
                    />
                  </div>
                </div>
                {formik.errors.phone_number ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.phone_number}</p>
                ) : null}
              </div>
              <div className="grid grid-cols-1">
                <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                  <div>
                    <WebIcon />
                  </div>
                  <div className="w-full">
                    <input
                      id="search"
                      type="text"
                      className="bg-light_grey w-full border-0 pl-[5px] font-sans text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                      placeholder="Website URL"
                      value={formik.values.website_url}
                      onChange={(e) => {
                        formik.setFieldValue("website_url", e.target.value);
                      }}
                    />
                  </div>
                </div>
                {formik.errors.website_url ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.website_url}</p>
                ) : null}
              </div>

              <FormikButton
                title="List business"
                error={formik.isValid}
                loading={formik.isSubmitting}
                classes="mt-8 h-12 p-3.5 px-12 rounded-xl border border-step-color shadow-custom-bottom"
              />
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default AddBusinessClient;
