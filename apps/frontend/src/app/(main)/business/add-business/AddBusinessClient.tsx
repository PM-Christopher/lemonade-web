"use client";
import { routes } from "@/lib/routes";
import { MoneyInput } from "@/components/global/MoneyInput";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useMemo, useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { SingleFileUploader } from "@/components/global/FileUploader";
import { Label, Input, FieldError, RichTextField } from "@lemonade/ui";
import { MAX_DESCRIPTION_WORDS } from "@lemonade/domain";
import MessageIcon from "@/images/icons/messageIcon.svg";
import PhoneIcon from "@/images/icons/phoneIcon.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import CloseIcon from "@/images/icons/close.svg";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBusinessSchema, type CreateBusinessInput } from "@/features/business/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { useAppDispatch } from "@/redux/hook";
import { MultiSelect } from "@/components/ui/multi-select";
import { useBusinessCategoriesQuery } from "@/features/shared/queries";
import CountryList from "country-list-with-dial-code-and-flag";
import { SubmitButton } from "@/components/global/SubmitButton";
import MultipleFileUploader from "@/components/global/MultipleFileUploader";
import { useCreateListingMutation } from "@/features/business/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import MainLayout from "@/components/layouts/MainLayout";
import { errorMessage } from "@/lib/api-error";
import BusinessBankModal from "@/components/business/Modals/BusinessBankModal";
import UpgradePlanCard from "@/components/business/UpgradePlanCard";
import { useCanListBusiness } from "@/hooks/useCanListBusiness";
import { useBankAccountQuery } from "@/features/settings/queries";

interface businessCategories {
  value: string;
  label: string;
}

const AddBusinessClient = () => {
  const { push, back } = useNavigation();
  const dispatch = useAppDispatch();
  const createListingMutation = useCreateListingMutation();
  const [inputValue, setInputValue] = useState("");
  const [pendingValues, setPendingValues] = useState<CreateBusinessInput | null>(null);
  const { canList } = useCanListBusiness();
  const { data: bankData } = useBankAccountQuery();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateBusinessInput>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      image: "",
      name: "",
      categories: [],
      description: "",
      city: "",
      country: "",
      services: [],
      service_rate: "",
      gallery: [],
      email: "",
      phone_number: "",
      website_url: "",
    },
    mode: "onTouched",
  });

  const services = useWatch({ control, name: "services" });
  const fieldAdapter = {
    setFieldValue: (field: string, value: unknown) =>
      setValue(field as keyof CreateBusinessInput, value as never, { shouldValidate: true }),
  };

  const addService = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!services.includes(inputValue.trim())) {
        setValue("services", [...services, inputValue.trim()], { shouldValidate: true });
      }
      setInputValue("");
    }
  };

  const removeService = (serviceToRemove: string) => {
    setValue(
      "services",
      services.filter((service) => service !== serviceToRemove),
      { shouldValidate: true },
    );
  };

  const { data } = useBusinessCategoriesQuery();
  const frameworksList = useMemo<businessCategories[]>(() => {
    if (!data?.categories) return [];
    return data.categories.map((category: { name: string }) => ({
      label: category.name,
      value: category.name,
    }));
  }, [data]);

  const createListing = async (values: CreateBusinessInput) => {
    const rate = values.service_rate?.replace(/,/g, "") ?? "";
    try {
      await createListingMutation.mutateAsync({
        ...values,
        service_rate: rate === "" ? null : Number(rate),
      });
      dispatch(
        updateToastifyReducer({
          show: true,
          message: apiMessage("business uploaded"),
          type: "success",
        }),
      );
      push(routes.BUSINESS);
    } catch (err) {
      if (
        applyServerErrors(err, setError, [
          "image",
          "name",
          "categories",
          "description",
          "city",
          "country",
          "services",
          "service_rate",
          "gallery",
          "email",
          "phone_number",
          "website_url",
        ])
      ) {
        return;
      }
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(err, "Error adding business"),
          type: "error",
        }),
      );
    }
  };

  // Payouts need a bank account, so ask for one before the first listing.
  const onSubmit = async (values: CreateBusinessInput) => {
    if (bankData && bankData.bank_account === null) {
      setPendingValues(values);
      return;
    }
    await createListing(values);
  };

  const onBankSaved = () => {
    const values = pendingValues;
    setPendingValues(null);
    if (values) void createListing(values);
  };

  if (!canList) {
    return (
      <MainLayout>
        <section className="bg-white pb-10">
          <div className="flex items-center gap-2 bg-white p-3 px-10">
            <ChevronLeft className="cursor-pointer" onClick={() => back()} />
            <p className="tracking-custom text-body-l font-sans font-semibold">Add business</p>
          </div>
          <UpgradePlanCard />
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <BusinessBankModal
        isOpen={pendingValues !== null}
        toggle={() => setPendingValues(null)}
        onSaved={onBankSaved}
      />
      <section className="laptop:bg-light_grey bg-white pb-10">
        <div className="flex items-center justify-between bg-white p-3 px-10">
          <div className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1">
            <ChevronLeft className="cursor-pointer" onClick={() => back()} />
            <p className="tracking-custom text-body-l font-sans font-semibold">Add business</p>
          </div>
        </div>
        <section className="laptop:mt-4 mt-0 flex flex-col items-center">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="laptop:mt-10 laptop:w-160 mt-0 flex w-full flex-col rounded-xl bg-white p-12">
              <p className="text-light-black text-meta font-sans font-bold">BUSINESS DETAILS</p>
              <SingleFileUploader
                length="single"
                type="business"
                setField={fieldAdapter}
                image=""
                title="Upload business image"
              />
              <FieldError message={errors.image?.message} />
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="business_name"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Business name
                </Label>
                <Input
                  id="business_name"
                  type="text"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  {...register("name")}
                />
                <FieldError message={errors.name?.message} />
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="categories"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Business categories
                </Label>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <MultiSelect
                      options={frameworksList}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select Category"
                      className="form-font bg-light_grey h-12 rounded-xl border-0 shadow-none"
                    />
                  )}
                />
                <FieldError message={errors.categories?.message} />
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="description"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Business description
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextField
                      id="description"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      maxWords={MAX_DESCRIPTION_WORDS}
                    />
                  )}
                />
                <FieldError message={errors.description?.message} />
              </div>
              <p className="text-light-black text-meta mt-12 font-sans font-bold">
                BUSINESS ADDRESS
              </p>
              <div className="mt-6 grid gap-2">
                <Label htmlFor="city" className="text-text-grey text-label font-sans font-normal">
                  City
                </Label>
                <Input
                  id="city"
                  type="text"
                  placeholder=""
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  {...register("city")}
                />
                <FieldError message={errors.city?.message} />
              </div>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="country"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Country
                </Label>
                <select
                  id="country"
                  className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                  {...register("country")}
                >
                  <option value="">Select country</option>
                  {CountryList.getAll().map((country, index) => (
                    <option value={country.name} key={index}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.country?.message} />
              </div>
              <p className="text-light-black text-meta mt-12 font-sans font-bold">
                SERVICE DETAILS
              </p>
              <div className="mt-6 grid gap-2">
                <Label
                  htmlFor="services-input"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Services
                </Label>
                <Input
                  id="services-input"
                  type="text"
                  placeholder=""
                  value={inputValue}
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={addService}
                />
                <FieldError message={errors.services?.message} />
                <p className="text-text-grey text-meta my-1.25 leading-normal">
                  Click <i>enter</i> to add service
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {services.map((service, index) => (
                    <div
                      className="bg-grey-20 flex items-center gap-2 rounded-lg p-2 px-3"
                      key={index}
                    >
                      <p className="font-semi-normal text-text-grey text-body-s">{service}</p>
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
                  htmlFor="service_rate"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Service Rate (Optional)
                </Label>
                <Controller
                  name="service_rate"
                  control={control}
                  render={({ field }) => (
                    <MoneyInput
                      id="service_rate"
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                    />
                  )}
                />
                <FieldError message={errors.service_rate?.message} />
              </div>
              <p className="text-text-grey text-body-s mt-6 font-normal">
                Portfolio gallery <span>(Optional)</span>
              </p>
              <MultipleFileUploader
                length="multiple"
                type="business"
                setField={fieldAdapter}
                images={[]}
                title="Upload multiple images"
              />
              <p className="text-light-black text-meta mt-12 font-sans font-bold">
                CONTACT DETAILS
              </p>
              <div className="grid grid-cols-1">
                <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                  <div>
                    <MessageIcon />
                  </div>
                  <div className="w-full">
                    <input
                      id="email"
                      type="text"
                      className="bg-light_grey text-body-s w-full border-0 pl-1.25 font-sans focus:border-transparent focus:ring-0 focus:outline-none"
                      placeholder="Email address"
                      {...register("email")}
                    />
                  </div>
                </div>
                <FieldError message={errors.email?.message} />
              </div>
              <div className="grid grid-cols-1">
                <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                  <div>
                    <PhoneIcon />
                  </div>
                  <div className="w-full">
                    <input
                      id="phone_number"
                      type="text"
                      className="bg-light_grey text-body-s w-full border-0 pl-1.25 font-sans focus:border-transparent focus:ring-0 focus:outline-none"
                      placeholder="Phone number"
                      {...register("phone_number")}
                    />
                  </div>
                </div>
                <FieldError message={errors.phone_number?.message} />
              </div>
              <div className="grid grid-cols-1">
                <div className="bg-light_grey mt-4 flex items-center gap-3 rounded-xl p-2 px-3">
                  <div>
                    <WebIcon />
                  </div>
                  <div className="w-full">
                    <input
                      id="website_url"
                      type="text"
                      className="bg-light_grey text-body-s w-full border-0 pl-1.25 font-sans focus:border-transparent focus:ring-0 focus:outline-none"
                      placeholder="Website URL"
                      {...register("website_url")}
                    />
                  </div>
                </div>
                <FieldError message={errors.website_url?.message} />
              </div>

              <SubmitButton
                title="List business"
                isValid={isValid}
                loading={isSubmitting}
                classes="mt-8 h-12 p-3.5 px-12 rounded-xl border border-step-color"
              />
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default AddBusinessClient;
