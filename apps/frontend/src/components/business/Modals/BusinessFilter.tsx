import CloseIcon from "@/images/icons/close.svg";
import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  FieldError,
} from "@lemonade/ui";
import LocationIcon from "@/images/icons/location.svg";
import React from "react";
import { useBusinessCategoriesQuery } from "@/features/shared/queries";
import NairaIcon from "@/images/icons/nairaIcon.svg";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessFilterSchema, type BusinessFilterInput } from "@/features/business/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { SubmitButton } from "@/components/global/SubmitButton";
import { useFilterBusinessMutation } from "@/features/business/mutations";

type FilterBusinessInterface = {
  toggle: () => void;
  isOpen: boolean;
};

const BusinessFilter = ({ toggle, isOpen }: FilterBusinessInterface) => {
  const filterBusinessMutation = useFilterBusinessMutation();
  const { data } = useBusinessCategoriesQuery();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<BusinessFilterInput>({
    resolver: zodResolver(businessFilterSchema),
    defaultValues: {
      category: "",
      location: "",
      start_range: "",
      end_range: "",
      service_type: "",
    },
    mode: "onTouched",
  });

  const handleCategoryChange = (value: string) => {
    setValue("category", value, { shouldValidate: true });
  };

  const onSubmit = (values: BusinessFilterInput) => {
    filterBusinessMutation.mutate(
      {
        category: values.category ?? "",
        location: values.location ?? "",
        start_range: values.start_range ?? "",
        end_range: values.end_range ?? "",
        service_type: values.service_type ?? "",
      },
      {
        onError: (error: Error) => {
          if (
            applyServerErrors(error, setError, [
              "category",
              "location",
              "service_type",
              "start_range",
              "end_range",
            ])
          )
            return;
        },
      },
    );
    toggle();
  };

  const handleResetFilter = () => {
    reset();
    toggle();
  };

  return (
    <div
      className={`bg-opacity-50 fixed inset-0 z-50 items-center justify-center bg-gray-800 ${isOpen ? "flex" : "hidden"}`}
    >
      <div className="hide-scrollbar laptop:h-auto laptop:max-h-[90vh] w-120 overflow-y-auto rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </div>
            <p>Business filter</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mt-6 flex flex-col">
            <div className="mt-6 grid gap-2">
              <Label
                htmlFor="fullname"
                className="text-black-light text-label font-sans font-normal uppercase"
              >
                Location
              </Label>
              <div className="mt-2">
                <div className="bg-light_grey flex h-12 w-full items-center gap-2 rounded-lg p-3">
                  <LocationIcon />
                  <input
                    id="search"
                    type="text"
                    className="bg-light_grey text-body-s w-full rounded-xl border-0 px-1 focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Enter location"
                    {...register("location")}
                  />
                </div>
              </div>
              <FieldError message={errors.location?.message} />
            </div>

            {/*business category*/}
            <div className="mt-6 grid gap-2">
              <Label
                htmlFor="fullname"
                className="text-black-light text-label font-sans font-normal uppercase"
              >
                Business Category
              </Label>
              <div className="mt-2">
                <Select onValueChange={handleCategoryChange}>
                  <SelectTrigger
                    aria-label="Business Category"
                    className="bg-light_grey h-12 w-full rounded-xl border-0 px-4 font-sans focus:border-transparent focus:ring-0 focus:outline-none"
                  >
                    <SelectValue
                      placeholder={
                        <span className="text-text-grey text-meta font-sans font-semibold">
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
              <FieldError message={errors.category?.message} />
            </div>

            {/*service type*/}
            <div className="mt-6 grid gap-2">
              <Label
                htmlFor="fullname"
                className="text-black-light text-label font-sans font-normal uppercase"
              >
                Service Type
              </Label>
              <div className="mt-2">
                <div className="bg-light_grey flex h-12 w-full items-center gap-2 rounded-lg p-3">
                  <input
                    id="search"
                    type="text"
                    className="bg-light_grey text-body-s w-full rounded-xl border-0 px-1 font-sans focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Service Type"
                    {...register("service_type")}
                  />
                </div>
              </div>
              <FieldError message={errors.service_type?.message} />
            </div>
            {/*range*/}
            <div className="mt-6 grid">
              <Label
                htmlFor="fullname"
                className="text-black-light text-label font-sans font-normal uppercase"
              >
                Budget Range
              </Label>
              <div className="mt-2 flex items-center justify-between gap-3">
                <div className={"bg-light_grey flex h-12 w-full items-center gap-2 rounded-lg p-3"}>
                  <NairaIcon />
                  <input
                    type="text"
                    className="w-full border-none bg-transparent text-sm outline-none focus:outline-none"
                    placeholder="1000"
                    {...register("start_range", {
                      onChange: (e) => {
                        // Only digits 1–9 (no 0, no symbols)
                        e.target.value = e.target.value.replace(/[^1-9]/g, "");
                      },
                    })}
                    inputMode="numeric"
                    pattern="[1-9][0-9]*"
                  />
                </div>
                <span>-</span>
                <div className={"bg-light_grey flex h-12 w-full items-center gap-2 rounded-lg p-3"}>
                  <NairaIcon />
                  <input
                    type="text"
                    className="w-full border-none bg-transparent text-sm outline-none focus:outline-none"
                    placeholder="10000"
                    {...register("end_range", {
                      onChange: (e) => {
                        // Only digits 1–9 (no 0, no symbols)
                        e.target.value = e.target.value.replace(/[^1-9]/g, "");
                      },
                    })}
                    inputMode="numeric"
                    pattern="[1-9][0-9]*"
                  />
                </div>
              </div>
              <FieldError message={errors.start_range?.message ?? errors.end_range?.message} />
            </div>

            <div className="mt-7.5 flex gap-1">
              <button
                type="button"
                className="border-light-grey-50 w-full rounded-xl border p-2.5 px-3.5"
                onClick={handleResetFilter}
              >
                <p className="font-semi-normal text-black-light text-body-l font-sans">
                  Reset filter
                </p>
              </button>

              <SubmitButton
                title="Apply filter"
                isValid={isValid}
                loading={isSubmitting}
                classes="auth-button px-3.5 p-2.5 rounded-xl border-step-color shadow-custom-bottom"
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessFilter;
