import CloseIcon from "@/images/icons/close.svg";
import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@lemonade/ui";
import LocationIcon from "@/images/icons/location.svg";
import React, { useState } from "react";
import { useBusinessCategoriesQuery } from "@/features/shared/queries";
import NairaIcon from "@/images/icons/nairaIcon.svg";
import * as yup from "yup";
import { useFormik } from "formik";
import { FormikButton } from "@/components/global/FormikButton";
import { useFilterBusinessMutation } from "@/features/business/mutations";

type FilterBusinessInterface = {
  toggle: () => void;
  isOpen: boolean;
};

const BusinessFilter = ({ toggle, isOpen }: FilterBusinessInterface) => {
  const filterBusinessMutation = useFilterBusinessMutation();
  const { data } = useBusinessCategoriesQuery();

  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [startRange, setStartRange] = useState("");
  const [endRange, setEndRange] = useState("");

  const handleCategoryChange = (value: string) => {
    formik.setFieldValue("category", value);
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
    validateOnMount: true,
    onSubmit: async (values) => {
      filterBusinessMutation.mutate(values);
      toggle();
    },
  });

  const handleResetFilter = () => {
    formik.resetForm();
    toggle();
  };

  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 items-center justify-center bg-gray-800 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="hide-scrollbar laptop:h-auto laptop:max-h-[90vh] w-[480px] overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </div>
            <p>Business filter</p>
          </div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="mt-[24px] flex flex-col">
            <div className="mt-[24px] grid gap-2">
              <Label
                htmlFor="fullname"
                className="text-black-light font-sans text-[14px] leading-[16.8px] font-normal uppercase"
              >
                Location
              </Label>
              <div className="mt-2">
                <div className="bg-light_grey flex h-[48px] w-full items-center gap-[8px] rounded-lg p-[12px]">
                  <LocationIcon />
                  <input
                    id="search"
                    type="text"
                    value={formik.values.location}
                    className="bg-light_grey w-full rounded-xl border-0 px-[4px] text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Enter location"
                    onChange={(e) => {
                      formik.setFieldValue("location", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            {/*business category*/}
            <div className="mt-[24px] grid gap-2">
              <Label
                htmlFor="fullname"
                className="text-black-light font-sans text-[14px] leading-[16.8px] font-normal uppercase"
              >
                Business Category
              </Label>
              <div className="mt-2">
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger
                    aria-label="Business Category"
                    className="bg-light_grey h-[48px] w-full rounded-xl border-0 px-[16px] font-sans focus:border-transparent focus:ring-0 focus:outline-none"
                  >
                    <SelectValue
                      placeholder={
                        <span className="text-text-grey font-sans text-[12px] leading-[14.4px] font-semibold">
                          Category
                        </span>
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="form-font">
                    <SelectItem value="all">All Locations</SelectItem>
                    {data?.categories?.map((item: { name: string; slug: string }, idx: number) => (
                      <SelectItem value={item.slug} key={idx}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/*service type*/}
            <div className="mt-[24px] grid gap-2">
              <Label
                htmlFor="fullname"
                className="text-black-light font-sans text-[14px] leading-[16.8px] font-normal uppercase"
              >
                Service Type
              </Label>
              <div className="mt-2">
                <div className="bg-light_grey flex h-[48px] w-full items-center gap-[8px] rounded-lg p-[12px]">
                  <input
                    id="search"
                    type="text"
                    value={formik.values.service_type}
                    className="bg-light_grey w-full rounded-xl border-0 px-[4px] font-sans text-[14px] focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Service Type"
                    onChange={(e) => {
                      formik.setFieldValue("service_type", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
            {/*range*/}
            <div className="mt-[24px] grid">
              <Label
                htmlFor="fullname"
                className="text-black-light font-sans text-[14px] leading-[16.8px] font-normal uppercase"
              >
                Budget Range
              </Label>
              <div className="mt-2 flex items-center justify-between gap-[12px]">
                <div
                  className={
                    "bg-light_grey flex h-[48px] w-full items-center gap-[8px] rounded-lg p-[12px]"
                  }
                >
                  <NairaIcon />
                  <input
                    type="text"
                    className="w-full border-none bg-transparent text-sm outline-none focus:outline-none"
                    placeholder="1000"
                    value={formik.values.start_range}
                    onChange={(e) => {
                      // Only digits 1–9 (no 0, no symbols)
                      e.target.value = e.target.value.replace(/[^1-9]/g, ""); // update field with cleaned value
                      formik.setFieldValue("start_range", e.target.value);
                    }}
                    inputMode="numeric" // brings up number pad on mobile
                    pattern="[1-9][0-9]*" // regex: must start with 1–9
                  />
                </div>
                <span>-</span>
                <div
                  className={
                    "bg-light_grey flex h-[48px] w-full items-center gap-[8px] rounded-lg p-[12px]"
                  }
                >
                  <NairaIcon />
                  <input
                    type="text"
                    className="w-full border-none bg-transparent text-sm outline-none focus:outline-none"
                    placeholder="10000"
                    value={formik.values.end_range}
                    onChange={(e) => {
                      // Only digits 1–9 (no 0, no symbols)
                      e.target.value = e.target.value.replace(/[^1-9]/g, ""); // update field with cleaned value
                      formik.setFieldValue("end_range", e.target.value);
                    }}
                    inputMode="numeric" // brings up number pad on mobile
                    pattern="[1-9][0-9]*" // regex: must start with 1–9
                  />
                </div>
              </div>
            </div>

            <div className="mt-[30px] flex gap-[4px]">
              <button
                className="border-light-grey-50 w-full rounded-[12px] border-[1px] p-[10px] px-[14px]"
                onClick={handleResetFilter}
              >
                <p className="font-semi-normal text-black-light font-sans text-[16px]">
                  Reset filter
                </p>
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
