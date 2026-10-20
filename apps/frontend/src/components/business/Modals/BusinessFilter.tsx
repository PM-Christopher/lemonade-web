"use client";
import CloseIcon from "@/images/icons/close.svg";
import { Button, Label, Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import LocationIcon from "@/images/icons/location.svg";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NairaIcon from "@/images/icons/nairaIcon.svg";
import { useBusinessCategoriesQuery } from "@/features/shared/queries";
import { businessFilterSchema, type BusinessFilterInput } from "@/features/business/schema";
import { SearchableSelect } from "@/components/global/SearchableSelect";

const ALL_CATEGORIES = "";

type FilterBusinessInterface = {
  toggle: () => void;
  isOpen: boolean;
  values: BusinessFilterInput;
  onApply: (values: BusinessFilterInput) => void;
  onReset: () => void;
};

// Budget fields take digits only (zeros allowed).
const digitsOnly = (value: string) => value.replace(/\D/g, "");

const BusinessFilter = ({ toggle, isOpen, values, onApply, onReset }: FilterBusinessInterface) => {
  const { data } = useBusinessCategoriesQuery();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BusinessFilterInput>({
    resolver: zodResolver(businessFilterSchema),
    defaultValues: values,
  });

  // Show the applied filters each time the modal opens.
  useEffect(() => {
    if (isOpen) reset(values);
  }, [isOpen, values, reset]);

  const categoryOptions = [
    { value: ALL_CATEGORIES, label: "All categories" },
    ...(data?.categories ?? []).map((item: { name: string }) => ({
      value: item.name,
      label: item.name,
    })),
  ];

  const onSubmit = (input: BusinessFilterInput) => {
    onApply(input);
    toggle();
  };

  const handleReset = () => {
    onReset();
    toggle();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Business filter</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="laptop:h-auto laptop:min-h-136 laptop:max-h-[90vh] laptop:w-120 laptop:rounded-lg laptop:p-6 flex h-screen w-screen flex-col overflow-y-auto bg-white p-5 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <CloseIcon />
            </button>
            <p className="tracking-custom text-body-l font-sans font-semibold">Business filter</p>
          </div>

          <div className="mt-6 flex flex-1 flex-col gap-6">
            <div className="grid gap-2">
              <Label
                htmlFor="filter-location"
                className="text-black-light text-label font-sans font-normal uppercase"
              >
                Location
              </Label>
              <div className="bg-light_grey flex h-12 w-full items-center gap-2 rounded-xl p-3">
                <LocationIcon className="shrink-0" />
                <input
                  id="filter-location"
                  type="text"
                  className="text-body-s w-full border-0 bg-transparent px-1 focus:ring-0 focus:outline-none"
                  placeholder="All locations"
                  {...register("location")}
                />
              </div>
              <FieldError message={errors.location?.message} />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="filter-category"
                className="text-black-light text-label font-sans font-normal uppercase"
              >
                Business category
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <SearchableSelect
                    id="filter-category"
                    options={categoryOptions}
                    value={field.value ?? ALL_CATEGORIES}
                    onChange={field.onChange}
                    placeholder="All categories"
                    searchPlaceholder="Search category"
                    emptyText="No category found"
                    ariaLabel="Business category"
                  />
                )}
              />
              <FieldError message={errors.category?.message} />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="filter-service"
                className="text-black-light text-label font-sans font-normal uppercase"
              >
                Service type
              </Label>
              <div className="bg-light_grey flex h-12 w-full items-center rounded-xl p-3">
                <input
                  id="filter-service"
                  type="text"
                  className="text-body-s w-full border-0 bg-transparent px-1 font-sans focus:ring-0 focus:outline-none"
                  placeholder="All services"
                  {...register("service_type")}
                />
              </div>
              <FieldError message={errors.service_type?.message} />
            </div>

            <div className="grid gap-2">
              <Label className="text-black-light text-label font-sans font-normal uppercase">
                Budget range
              </Label>
              <div className="flex items-center justify-between gap-3">
                <div className="bg-light_grey flex h-12 w-full items-center gap-2 rounded-xl p-3">
                  <NairaIcon className="shrink-0" />
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label="Minimum budget"
                    className="text-body-s w-full border-0 bg-transparent focus:ring-0 focus:outline-none"
                    placeholder="Min"
                    {...register("start_range", {
                      onChange: (e) => {
                        e.target.value = digitsOnly(e.target.value);
                      },
                    })}
                  />
                </div>
                <span>-</span>
                <div className="bg-light_grey flex h-12 w-full items-center gap-2 rounded-xl p-3">
                  <NairaIcon className="shrink-0" />
                  <input
                    type="text"
                    inputMode="numeric"
                    aria-label="Maximum budget"
                    className="text-body-s w-full border-0 bg-transparent focus:ring-0 focus:outline-none"
                    placeholder="Max"
                    {...register("end_range", {
                      onChange: (e) => {
                        e.target.value = digitsOnly(e.target.value);
                      },
                    })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-7.5 flex gap-2">
            <button
              type="button"
              className="border-light-grey-50 w-full cursor-pointer rounded-xl border p-2.5 px-3.5"
              onClick={handleReset}
            >
              <p className="font-semi-normal text-black-light text-body-l font-sans">
                Reset filter
              </p>
            </button>
            <Button
              type="submit"
              className="bg-gradient-green h-auto w-full rounded-xl p-2.5 px-3.5 font-sans font-semibold text-white"
            >
              Apply filter
            </Button>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default BusinessFilter;
