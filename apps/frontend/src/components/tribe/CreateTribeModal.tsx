import React, { useRef, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import { FormikButton } from "@/components/global/FormikButton";
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
} from "@lemonade/ui";
import DollarBillIcon from "@/images/icons/dollar-bill.svg";
import InfoIcon from "@/images/icons/infoIcon.svg";
import PadlockIcon from "@/images/icons/padlock.svg";
import * as yup from "yup";
import { useFormik } from "formik";
import { tribesApi } from "@/features/tribes/api";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { useTribeCategoriesQuery } from "@/features/tribes/queries";
import { useCreateTribeMutation } from "@/features/tribes/mutations";
import Switch from "react-switch";
import { useMediaQuery } from "react-responsive";

interface CreateTribeModalProps {
  modalFlag: boolean;
  activateModal: () => void;
}

const CreateTribeModal = ({ modalFlag, activateModal }: CreateTribeModalProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const createTribeMutation = useCreateTribeMutation();
  const [image, setImage] = useState(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [monetizedCheck, setMonetizedChecked] = useState(false);
  const [privateCheck, setPrivateCheck] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

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
    validateOnMount: true,
    onSubmit: async (values) => {
      values.membership_fee = values.membership_fee ? values.membership_fee : 0;
      createTribeMutation.mutate(values, {
        onSuccess: (result) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Tribe created",
              type: "success",
            }),
          );
          activateModal();
          // redirect to the newly created tribe
          router.push(`/tribe/${result.tribe.slug}`);
        },
        onError: (err: any) => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: err?.message || "Something went wrong",
              type: "error",
            }),
          );
        },
      });
    },
  });

  const { data: tribe_cat } = useTribeCategoriesQuery();

  const handleChange = (type: string) => {
    if (type === "monetized") {
      setMonetizedChecked((prev) => !prev);
    } else if (type === "private") {
      setPrivateCheck((prev) => !prev);
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { data } = await tribesApi.upload(formData);
        if (data.success) {
          setImage(data.data.image);
          await formik.setFieldValue("image", data.data.image);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Image uploaded",
              type: "success",
            }),
          );
        } else {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error uploading image",
              type: "error",
            }),
          );
        }
      } catch (err: any) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: err?.response?.data?.message || "error",
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
        <div className="hide-scrollbar laptop:h-auto laptop:max-h-[90vh] laptop:w-[640px] laptop:rounded-lg flex h-screen w-full flex-col justify-between overflow-y-auto rounded-none bg-white p-6 shadow-2xl">
          <form onSubmit={formik.handleSubmit} className="flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloseIcon onClick={activateModal} className="cursor-pointer" />
                <p className="font-semiBold text-[18px]">Create Tribe</p>
              </div>
              <div className="tablet:block hidden">
                <FormikButton
                  title="Create tribe"
                  error={formik.isValid}
                  loading={formik.isSubmitting}
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
                  className="h-[89px] w-[89px] cursor-pointer rounded-3xl border"
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
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            <div className="mt-4 flex flex-col">
              <div className="grid gap-2">
                <Label
                  htmlFor="tribe-name"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Tribe name
                </Label>
                <Input
                  id="tribe-name"
                  type="text"
                  className="form-font bg-light_grey h-12 rounded-xl border-0"
                  value={formik.values.tribe_name}
                  onChange={(e: any) => {
                    formik.setFieldValue("tribe_name", e.target.value);
                  }}
                />
              </div>
              <div className="mt-4 grid gap-2">
                <Label
                  htmlFor="tribe-name"
                  className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                >
                  Category
                </Label>
                <Select
                  value={formik.values.category}
                  onValueChange={(value) => {
                    formik.setFieldValue("category", value);
                  }}
                >
                  <SelectTrigger
                    aria-label="Category"
                    className="bg-light_grey h-12 rounded-xl border-0"
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="form-font">
                    {tribe_cat?.categories?.map((category: any, index: number) => (
                      <SelectItem value={category?.name} key={index}>
                        {category?.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-4 grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="description"
                    className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                  >
                    Description
                  </Label>
                  <p className="text-text-grey text-[12px] font-normal">100 characters</p>
                </div>
                <Textarea
                  id="description"
                  className="form-font bg-light_grey h-[91px] resize-none rounded-xl border-0"
                  placeholder="Description about this tribe"
                  value={formik.values.description}
                  onChange={(e: any) => {
                    formik.setFieldValue("description", e.target.value);
                  }}
                />
              </div>

              <div className="mt-8 flex flex-col">
                <div className="mb-6 flex justify-between">
                  <div className="flex gap-2">
                    <div>
                      <DollarBillIcon />
                    </div>
                    <div>
                      <p className="font-semi-normal text-black-light font-sans text-[16px] leading-[24px]">
                        Monetize tribe
                      </p>
                      <p className="text-text-grey font-sans text-[12px] leading-[14.4px] font-normal">
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
                      className="text-text-grey font-sans text-[14px] leading-[16.8px] font-normal"
                    >
                      Acceptance fee (₦)
                    </Label>
                    <Input
                      id="tribe-name"
                      type="number"
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      value={formik.values.membership_fee}
                      onChange={(e: any) => {
                        formik.setFieldValue("membership_fee", e.target.value);
                      }}
                    />
                    <div className="mt-[5px] mb-6 flex items-center gap-2">
                      <InfoIcon />
                      <p className="text-text-grey text-[12px] font-normal">
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
                      <p className="font-semi-normal text-black-light font-sans text-[16px] leading-[24px]">
                        Private tribe
                      </p>
                      <p className="text-text-grey font-sans text-[12px] leading-[14.4px] font-normal">
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
              <div className="fixed bottom-0 left-0 flex w-full flex-col items-center justify-center pt-4 pr-4 pb-6 pl-4">
                <div className="mt-auto">
                  <FormikButton
                    title="Create tribe"
                    error={formik.isValid}
                    loading={formik.isSubmitting}
                    classes="w-[343px] px-3.5 p-2.5 rounded-xl border-step-color h-12"
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
