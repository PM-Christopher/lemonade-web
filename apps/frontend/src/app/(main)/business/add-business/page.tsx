"use client";
import React, { useEffect, useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { SingleFileUploader } from "@/components/global/FileUploader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import MessageIcon from "@/images/icons/messageIcon.svg";
import PhoneIcon from "@/images/icons/phoneIcon.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import CloseIcon from "@/images/icons/close.svg";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { useFormik } from "formik";
import { useAppDispatch } from "@/redux/hook";
import { MultiSelect } from "@/components/ui/multi-select";
import { useRequest } from "@/hooks/useRequest";
import CountryList from "country-list-with-dial-code-and-flag";
import { FormikButton } from "@/components/global/FormikButton";
import MultipleFileUploader from "@/components/global/MultipleFileUploader";
import { useCreateListingMutation } from "@/features/business/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import MainLayout from "@/components/layouts/MainLayout";
import { checkError } from "@/lib/checkError";

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

const AddBusinessPage = () => {
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

  const { data, loading } = useRequest(`/shared/utilities/business-categories`, "GET");

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [frameworksList, setFrameworksList] = useState<businessCategories[]>([]);

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

  useEffect(() => {
    if (data?.categories) {
      const updatedFrameworksList = data.categories.map(
        (category: { name: string; slug: string }) => ({
          label: category.name,
          value: category.name,
        }),
      );

      setFrameworksList(updatedFrameworksList);
    }
  }, [data]);

  return (
    <MainLayout>
      <section className="bg-white pb-10 laptop:bg-light_grey">
        <div className="flex items-center justify-between border-b-[1px] border-t-[1px] border-b-grey-20 border-t-grey-20 bg-white p-[12px] px-10">
          <div className="flex items-center gap-2 rounded-[12px] p-[4px] pl-[4px] pr-[16px]">
            <ChevronLeft className="cursor-pointer" onClick={() => router.back()} />
            <p className="font-sans text-[16px] font-semibold tracking-custom">Add business</p>
          </div>
        </div>
        <section className="mt-0 flex flex-col items-center laptop:mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-0 flex w-full flex-col rounded-[12px] bg-white p-[48px] laptop:mt-10 laptop:w-[640px]">
              <p className="font-sans text-[12px] font-bold leading-[14.4px] text-light-black">
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
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="business_name"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Business name
                </Label>
                <Input
                  id="business_name"
                  type="text"
                  placeholder=""
                  className="form-font h-12 rounded-xl border-0 bg-light_grey"
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
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
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
                  className="form-font h-12 rounded-xl border-0 bg-light_grey shadow-none"
                />
                {formik.errors.categories ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.categories}</p>
                ) : null}
              </div>
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="fullname"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Business description
                </Label>
                <textarea
                  className="form-font h-[131px] resize-none rounded-xl border-0 bg-light_grey p-4"
                  value={formik.values.description}
                  onChange={(e) => {
                    formik.setFieldValue("description", e.target.value);
                  }}
                ></textarea>
                {formik.errors.description ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.description}</p>
                ) : null}
              </div>
              <p className="mt-[48px] font-sans text-[12px] font-bold leading-[14.4px] text-light-black">
                BUSINESS ADDRESS
              </p>
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="city"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder=""
                  className="form-font h-12 rounded-xl border-0 bg-light_grey"
                  value={formik.values.city}
                  onChange={(e) => {
                    formik.setFieldValue("city", e.target.value);
                  }}
                />
                {formik.errors.city ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.city}</p>
                ) : null}
              </div>
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="country"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Country
                </Label>
                <select
                  id="country"
                  className="form-font h-12 rounded-xl border-0 bg-light_grey px-2"
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
              <p className="mt-[48px] font-sans text-[12px] font-bold leading-[14.4px] text-light-black">
                SERVICE DETAILS
              </p>
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="city"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Services
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder=""
                  value={inputValue}
                  className="form-font h-12 rounded-xl border-0 bg-light_grey"
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={addService}
                />
                {formik.errors.services ? (
                  <p className="text-[12px] text-[#FF8D8D]">{formik.errors.services}</p>
                ) : null}
                <p className="my-[5px] text-[12px] text-text-grey">
                  Click <i>enter</i> to add service
                </p>
                <div className="mt-[8px] flex flex-wrap gap-[4px]">
                  {formik.values.services.map((service, index) => (
                    <div
                      className="flex items-center gap-[8px] rounded-[8px] bg-grey-20 p-[8px] px-[12px]"
                      key={index}
                    >
                      <p className="text-[14px] font-semi-normal text-text-grey">{service}</p>
                      <CloseIcon
                        className="h-[8px] w-[8px] cursor-pointer"
                        onClick={() => removeService(service)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-[24px] grid gap-2">
                <Label
                  htmlFor="city"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Service Rate (Optional)
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder=""
                  className="form-font h-12 rounded-xl border-0 bg-light_grey"
                  value={formik.values.service_rate}
                  onChange={(e) => {
                    formik.setFieldValue("service_rate", e.target.value);
                  }}
                />
              </div>
              <p className="mt-[24px] text-[14px] font-normal text-text-grey">
                Portfolio gallery <span>(Optional)</span>
              </p>
              <MultipleFileUploader
                length="multiple"
                type="business"
                setField={formik}
                images={[]}
                title="Upload multiple images"
              />
              <p className="mt-[48px] font-sans text-[12px] font-bold leading-[14.4px] text-light-black">
                CONTACT DETAILS
              </p>
              <div className="grid grid-cols-1">
                <div className="mt-[16px] flex items-center gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
                  <div>
                    <MessageIcon />
                  </div>
                  <div className="w-full">
                    <input
                      id="search"
                      type="text"
                      className="w-full border-0 bg-light_grey pl-[5px] font-sans text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
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
                <div className="mt-[16px] flex items-center gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
                  <div>
                    <PhoneIcon />
                  </div>
                  <div className="w-full">
                    <input
                      id="search"
                      type="text"
                      className="w-full border-0 bg-light_grey pl-[5px] font-sans text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
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
                <div className="mt-[16px] flex items-center gap-3 rounded-[12px] bg-light_grey p-2 px-[12px]">
                  <div>
                    <WebIcon />
                  </div>
                  <div className="w-full">
                    <input
                      id="search"
                      type="text"
                      className="w-full border-0 bg-light_grey pl-[5px] font-sans text-[14px] focus:border-transparent focus:outline-none focus:ring-0"
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
                classes="mt-[32px] h-[48px] p-[14px] px-[48px] rounded-[12px] border-[1px] border-step-color shadow-custom-bottom"
              />
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default AddBusinessPage;
