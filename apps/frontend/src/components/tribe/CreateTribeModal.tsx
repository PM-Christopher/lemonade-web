import { images } from "@/lib/images";
import { MoneyInput } from "@/components/global/MoneyInput";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useRef, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { SubmitButton } from "@/components/global/SubmitButton";
import Image from "next/image";
import {
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Dialog,
  DialogContentBare,
  DialogTitle,
  FieldError,
} from "@lemonade/ui";
import DollarBillIcon from "@/images/icons/dollar-bill.svg";
import InfoIcon from "@/images/icons/infoIcon.svg";
import PadlockIcon from "@/images/icons/padlock.svg";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTribeSchema, type CreateTribeInput } from "@/features/tribes/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { tribesApi } from "@/features/tribes/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { isImageFile } from "@/lib/files";
import { apiMessage } from "@/lib/api-message";
import { useAppDispatch } from "@/redux/hook";

import { useTribeCategoriesQuery } from "@/features/tribes/queries";
import { useCreateTribeMutation } from "@/features/tribes/mutations";
import Switch from "react-switch";
import { useMediaQuery } from "react-responsive";
import { errorMessage } from "@/lib/api-error";

interface CreateTribeModalProps {
  modalFlag: boolean;
  activateModal: () => void;
}

const CreateTribeModal = ({ modalFlag, activateModal }: CreateTribeModalProps) => {
  const dispatch = useAppDispatch();
  const { push } = useNavigation();
  const createTribeMutation = useCreateTribeMutation();
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<CreateTribeInput>({
    resolver: zodResolver(createTribeSchema),
    defaultValues: {
      tribe_name: "",
      category: "",
      description: "",
      image: "",
      private: false,
      monetized: false,
      membership_fee: "",
      members: [],
    },
    mode: "onTouched",
  });

  const monetized = useWatch({ control, name: "monetized" });

  const onSubmit = async (values: CreateTribeInput) => {
    const fee = values.membership_fee?.replace(/,/g, "") ?? "";
    try {
      const result = await createTribeMutation.mutateAsync({
        ...values,
        membership_fee: values.monetized && fee ? Number(fee) : 0,
      });
      dispatch(
        updateToastifyReducer({
          show: true,
          message: apiMessage("Tribe created"),
          type: "success",
        }),
      );
      activateModal();
      push(routes.TRIBE_DETAIL(result.tribe.slug));
    } catch (err) {
      if (
        applyServerErrors(err, setError, [
          "tribe_name",
          "category",
          "description",
          "image",
          "membership_fee",
        ])
      ) {
        return;
      }
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(err, "Something went wrong"),
          type: "error",
        }),
      );
    }
  };

  const { data: tribe_cat } = useTribeCategoriesQuery();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isImageFile(file)) {
      event.target.value = "";
      dispatch(
        updateToastifyReducer({
          show: true,
          message: "Please choose an image file",
          type: "error",
        }),
      );
      return;
    }
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const result = await tribesApi.upload(formData);
        setImage(result.image);
        setValue("image", result.image, { shouldValidate: true });
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Image uploaded",
            type: "success",
          }),
        );
      } catch (err) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: errorMessage(err, "error"),
            type: "error",
          }),
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
    <Dialog
      open={modalFlag}
      onOpenChange={(open) => {
        if (!open) activateModal();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Create Tribe</DialogTitle>
        <div className="hide-scrollbar laptop:h-auto laptop:max-h-[90vh] laptop:w-160 laptop:rounded-lg flex h-screen w-full flex-col justify-between overflow-y-auto rounded-none bg-white p-6 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloseIcon onClick={activateModal} className="cursor-pointer" />
                <p className="font-semiBold text-body-xl">Create Tribe</p>
              </div>
              <div className="tablet:block hidden">
                <SubmitButton
                  title="Create tribe"
                  isValid={isValid}
                  loading={isSubmitting}
                  classes="px-3.5 p-2.5 rounded-xl border-step-color"
                />
              </div>
            </div>
            <div className="tablet:mt-6 mt-12 flex justify-center">
              {image ? (
                <Image
                  src={image}
                  alt="upload"
                  width={89}
                  height={83}
                  className="h-22.25 w-22.25 cursor-pointer rounded-3xl border"
                  onClick={handleImageClick}
                />
              ) : (
                <Image
                  src={images.UPLOAD}
                  alt="upload"
                  width={89}
                  height={83}
                  className="cursor-pointer"
                  onClick={handleImageClick}
                />
              )}

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <FieldError message={errors.image?.message} />
            <div className="mt-4 flex flex-col">
              <div className="grid gap-2">
                <Label
                  htmlFor="tribe-name"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Tribe name
                </Label>
                <Input
                  id="tribe-name"
                  type="text"
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  {...register("tribe_name")}
                />
                <FieldError message={errors.tribe_name?.message} />
              </div>
              <div className="mt-4 grid gap-2">
                <Label
                  htmlFor="tribe-category"
                  className="text-text-grey text-label font-sans font-normal"
                >
                  Category
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        aria-label="Category"
                        className="bg-light_grey h-12 rounded-xl border-0"
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="form-font">
                        {tribe_cat?.categories?.map((category, index: number) => (
                          <SelectItem value={category?.name} key={index}>
                            {category?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError message={errors.category?.message} />
              </div>
              <div className="mt-4 grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="description"
                    className="text-text-grey text-label font-sans font-normal"
                  >
                    Description
                  </Label>
                  <p className="text-text-grey text-meta leading-normal font-normal">
                    100 characters
                  </p>
                </div>
                <Textarea
                  id="description"
                  className="form-font bg-light_grey h-22.75 resize-none rounded-xl border-0"
                  placeholder="Description about this tribe"
                  {...register("description")}
                />
                <FieldError message={errors.description?.message} />
              </div>

              <div className="mt-8 flex flex-col">
                <div className="mb-6 flex justify-between">
                  <div className="flex gap-2">
                    <div>
                      <DollarBillIcon />
                    </div>
                    <div>
                      <p className="font-semi-normal text-black-light text-body-l font-sans">
                        Monetize tribe
                      </p>
                      <p className="text-text-grey text-meta font-sans font-normal">
                        User will pay to be part of your tribe
                      </p>
                    </div>
                  </div>
                  <div>
                    <Controller
                      name="monetized"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          onChange={field.onChange}
                          checked={field.value}
                          checkedIcon={false}
                          uncheckedIcon={false}
                          onColor="#9BE303"
                        />
                      )}
                    />
                  </div>
                </div>
                {monetized && (
                  <div className="grid gap-2">
                    <Label
                      htmlFor="membership-fee"
                      className="text-text-grey text-label font-sans font-normal"
                    >
                      Acceptance fee (₦)
                    </Label>
                    <Controller
                      name="membership_fee"
                      control={control}
                      render={({ field }) => (
                        <MoneyInput
                          id="membership-fee"
                          className="form-font bg-light_grey h-12 rounded-xl border-0"
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                        />
                      )}
                    />
                    <FieldError message={errors.membership_fee?.message} />
                    <div className="mt-1.25 mb-6 flex items-center gap-2">
                      <InfoIcon />
                      <p className="text-text-grey text-meta leading-normal font-normal">
                        {" "}
                        10% of membership fees go to the Lemonade Network
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <div>
                      <PadlockIcon />
                    </div>
                    <div>
                      <p className="font-semi-normal text-black-light text-body-l font-sans">
                        Private tribe
                      </p>
                      <p className="text-text-grey text-meta font-sans font-normal">
                        Tribe will only be available to invited members
                      </p>
                    </div>
                  </div>
                  <div>
                    <Controller
                      name="private"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          onChange={field.onChange}
                          checked={field.value}
                          checkedIcon={false}
                          uncheckedIcon={false}
                          onColor="#9BE303"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
            {isMobile && (
              <div className="fixed bottom-0 left-0 flex w-full flex-col items-center justify-center pt-4 pr-4 pb-6 pl-4">
                <div className="mt-auto">
                  <SubmitButton
                    title="Create tribe"
                    isValid={isValid}
                    loading={isSubmitting}
                    classes="w-85.75 px-3.5 p-2.5 rounded-xl border-step-color h-12"
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default CreateTribeModal;
