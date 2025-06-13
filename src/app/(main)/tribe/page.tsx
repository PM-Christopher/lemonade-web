"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/navigation/TopNav";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import SearchIcon from "@/images/icons/search.svg";
import { Input } from "@/components/ui/input";
import TribeCardList from "@/components/tribe/TribeCardList";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import DollarBillIcon from "@/images/icons/dollar-bill.svg";
import PadlockIcon from "@/images/icons/padlock.svg";
import CloseIcon from "@/images/icons/close.svg";
import { useSelector } from "react-redux";
import { useRequest } from "@/hooks/useRequest";
import { TribeInterface } from "@/interfaces/TribeInterface";
import { Spinner } from "evergreen-ui";
import MainLayout from "@/components/layouts/MainLayout";
import { axiosInstance } from "@/lib/axiosInstane";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useAppDispatch } from "@/redux/hook";
import * as yup from "yup";
import { useFormik } from "formik";
import Switch from "react-switch";
import InfoIcon from "@/images/icons/infoIcon.svg";
import { FormikButton } from "@/components/global/FormikButton";
import { authFailure, loadStop } from "@/features/authentication/authSlice";
import { useMediaQuery } from "react-responsive";
import { searchTribe } from "@/features/tribes/tribe.slice";

export default function TribePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { authToken } = useSelector((state: any) => state.auth);
  const { searchResults } = useSelector((state: any) => state.tribe);

  const [tribeType, setTribeType] = useState("tln");
  const [image, setImage] = useState(null);
  const [monetizedCheck, setMonetizedChecked] = useState(false);
  const [privateCheck, setPrivateCheck] = useState(false);
  const [search, setSearch] = useState("");

  const isMobile = useMediaQuery({ query: "(max-width: 640px)" });

  const getHeader = () => {
    return {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };
  };

  // onChange handler that updates local state and dispatches an action
  const handleTribeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(searchTribe({ data: { search: value } }));
  };

  const handleChange = (type: string) => {
    if (type === "monetized") {
      setMonetizedChecked((prev) => !prev);
    } else if (type === "private") {
      setPrivateCheck((prev) => !prev);
    }
  };

  const { data, loading } = useRequest(
    `/tribes?type=${tribeType}`,
    "GET",
    {},
    true,
    getHeader()
  );
  const { data: tribe_cat } = useRequest(
    `/tribes-categories`,
    "GET",
    {},
    true,
    getHeader()
  );

  const [modalFlag, setModalFlag] = useState(false);

  const activateModal = () => {
    setModalFlag(!modalFlag);
  };

  const changeTribeType = (type: string) => {
    setTribeType(type);
  };

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
    onSubmit: async (values) => {
      console.log("titi");
      values.membership_fee = values.membership_fee ? values.membership_fee : 0;
      try {
        const { data } = await axiosInstance.post(
          "/tribes/create-tribe",
          values,
          getHeader()
        );
        console.log({ data });
        if (data.status) {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Tribe created",
              type: "success",
            })
          );
          activateModal();
          // redirect to the newly created tribe
          router.push(`/tribe/${data?.data?.tribe?.id}`);
        } else {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Something went wrong",
              type: "error",
            })
          );
        }
      } catch (err: any) {
        dispatch(authFailure());
        dispatch(
          updateToastifyReducer({
            show: true,
            message: err?.response?.data?.message || "error",
            type: "error",
          })
        );
      } finally {
        dispatch(loadStop());
      }
    },
  });

  //   console.log("erro", formik.errors)

  const showError = (errorMessage: any) => {
    dispatch(
      updateToastifyReducer({
        show: true,
        message: errorMessage || "An error occurred",
        type: "error",
      })
    );
  };

  useEffect(() => {
    if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
      const firstErrorMessage = Object.values(formik.errors)[0];
      showError(firstErrorMessage);
    }
  }, [formik.errors, formik.submitCount]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const { data } = await axiosInstance.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log({ data });
        if (data.status) {
          setImage(data.data.image);
          await formik.setFieldValue("image", data.data.image);
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Image uploaded",
              type: "success",
            })
          );
        } else {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error uploading image",
              type: "error",
            })
          );
        }
      } catch (err: any) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: err?.response?.data?.message || "error",
            type: "error",
          })
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
    <MainLayout>
      <div className="bg-white flex flex-col tablet:flex-row justify-between gap-[10px] p-2 px-10 border-t-[1px] border-b-[1px] items-center">
        <div className="flex gap-10">
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <p
              className={`"font-sans font-semi-normal ${
                tribeType === "tln" ? "text-black-light" : "text-text-grey"
              } text-[14px] leading-[21px]"`}
              onClick={() => changeTribeType("tln")}
            >
              TLN Tribes
            </p>
            {tribeType === "tln" && (
              <div className="border h-[0.5px] border-step-color w-20"></div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <p
              className={`"font-sans font-semi-normal ${
                tribeType === "discover" ? "text-black-light" : "text-text-grey"
              } text-[14px] leading-[21px]"`}
              onClick={() => changeTribeType("discover")}
            >
              Discover
            </p>
            {tribeType === "discover" && (
              <div className="border h-[0.5px] border-step-color w-20"></div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center cursor-pointer">
            <p
              className={`"font-sans font-semi-normal ${
                tribeType === "mine" ? "text-black-light" : "text-text-grey"
              } text-[14px] leading-[21px]"`}
              onClick={() => changeTribeType("mine")}
            >
              My Tribes
            </p>
            {tribeType === "mine" && (
              <div className="border h-[0.5px] border-step-color w-20"></div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-white block tablet:hidden">
            <div className="flex items-center gap-3 bg-light_grey p-2 rounded-[12px] w-[291px] h-[48px]">
              <div>
                <SearchIcon />
              </div>
              <div>
                <input
                  id="search"
                  type="text"
                  className="rounded-xl text-[14px] bg-light_grey border-0 w-[300px] focus:outline-none focus:ring-0 focus:border-transparent"
                  placeholder="Search tribe"
                />
              </div>
            </div>
          </div>
          <Button
            className="auth-button py-[20px] rounded-[12px] border-step-color shadow-custom-bottom"
            onClick={activateModal}
          >
            {isMobile ? (
              <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">
                +
              </p>
            ) : (
              <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">
                + Create Tribe
              </p>
            )}
          </Button>
        </div>
      </div>
      <div className="">
        <div className="flex justify-around">
          <section
            id="tribes"
            className="p-10 py-4 w-[704px] h-[1000px] shadow-div-shadow-2"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Spinner />
              </div>
            ) : data?.tribes.length > 0 ? (
              <div className="overflow-y-auto max-h-screen hide-scrollbar">
                {data?.tribes.map((tribe: TribeInterface, index: number) => (
                  <Link href={`/tribe/${tribe.slug}`}>
                    <TribeCardList tribe={tribe} key={index} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center">
                <p className="font-semibold text-[24px] text-text-grey">
                  No tribes found
                </p>
              </div>
            )}
          </section>
          <section
            id="search-tribes"
            className="p-10 py-4 w-[480px] h-[325px] bg-white rounded-[12px] hidden tablet:block"
          >
            <div className="bg-white flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-light_grey p-2 rounded-[12px]">
                <div>
                  <SearchIcon />
                </div>
                <div>
                  <input
                    id="search"
                    type="text"
                    className="rounded-xl text-[14px] bg-light_grey border-0 w-[300px] focus:outline-none focus:ring-0 focus:border-transparent"
                    placeholder="Search tribe"
                    value={search}
                    onChange={handleTribeSearch}
                  />
                </div>
              </div>
              <div>
                <p className="font-semiBold text-[14px] text-text-grey">
                  Recent search
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {searchResults.length > 0 &&
                  searchResults.map((tribe: TribeInterface, index: number) => (
                    <Link
                      href={`/tribe/${tribe.id}`}
                      key={index}
                      className="cursor-pointer"
                    >
                      <div className="flex gap-2 items-center">
                        <Image
                          src={tribe?.image}
                          alt={tribe?.tribe_name}
                          width={50}
                          height={50}
                          className="border-[2px] border-text-grey rounded-[12px]"
                        />
                        <p className="font-medium text-text-grey text-[14px]">
                          {tribe?.tribe_name}
                        </p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${
          !modalFlag ? "hidden" : "flex"
        }`}
      >
        <form onSubmit={formik.handleSubmit} className="flex flex-col">
          <div className="bg-white rounded-lg shadow-lg w-full tablet:w-[640px] p-6 px-[48px] pb-[48px] flex flex-col h-screen tablet:h-full">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-[8px]">
                <CloseIcon onClick={activateModal} className="cursor-pointer" />
                <p className="font-semiBold text-[18px]">Create Tribe</p>
              </div>
              <div className="hidden tablet:block">
                <FormikButton
                  title="Create tribe"
                  error={formik.isValid}
                  loading={formik.isSubmitting}
                  classes="px-[14px] p-[10px] rounded-[12px] border-step-color"
                />
              </div>
            </div>
            <div className="flex justify-center mt-[48px] tablet:mt-[24px]">
              {image ? (
                <Image
                  src={image}
                  alt="upload"
                  width={89}
                  height={83}
                  className="border-[1px] cursor-pointer w-[89px] h-[89px] rounded-[24px]"
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
            <div className="mt-[16px] flex flex-col">
              <div className="grid gap-2">
                <Label
                  htmlFor="tribe-name"
                  className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey"
                >
                  Tribe name
                </Label>
                <Input
                  id="tribe-name"
                  type="text"
                  className="h-[48px] rounded-xl bg-light_grey form-font border-0"
                  value={formik.values.tribe_name}
                  onChange={(e: any) => {
                    formik.setFieldValue("tribe_name", e.target.value);
                  }}
                />
              </div>
              <div className="grid gap-2 mt-4">
                <Label
                  htmlFor="tribe-name"
                  className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey"
                >
                  Category
                </Label>
                <Select
                  value={formik.values.category}
                  onValueChange={(value) => {
                    formik.setFieldValue("category", value);
                  }}
                >
                  <SelectTrigger className="bg-light_grey rounded-xl border-0 h-[48px]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="form-font">
                    {tribe_cat?.categories?.map(
                      (category: any, index: number) => (
                        <SelectItem value={category?.name} key={index}>
                          {category?.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2 mt-4">
                <div className="flex justify-between items-center">
                  <Label
                    htmlFor="description"
                    className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey"
                  >
                    Description
                  </Label>
                  <p className="font-normal text-text-grey text-[12px]">
                    100 characters
                  </p>
                </div>
                <Textarea
                  id="description"
                  className="rounded-xl bg-light_grey form-font border-0 h-[91px] resize-none"
                  placeholder="Description about this tribe"
                  value={formik.values.description}
                  onChange={(e: any) => {
                    formik.setFieldValue("description", e.target.value);
                  }}
                />
              </div>

              <div className="flex flex-col mt-8">
                <div className="flex justify-between mb-[24px]">
                  <div className="flex gap-2">
                    <div>
                      <DollarBillIcon />
                    </div>
                    <div>
                      <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-black-light">
                        Monetize tribe
                      </p>
                      <p className="font-sans font-normal text-text-grey text-[12px] leading-[14.4px]">
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
                      className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey"
                    >
                      Acceptance fee (₦)
                    </Label>
                    <Input
                      id="tribe-name"
                      type="number"
                      className="h-[48px] rounded-xl bg-light_grey form-font border-0"
                      value={formik.values.membership_fee}
                      onChange={(e: any) => {
                        formik.setFieldValue("membership_fee", e.target.value);
                      }}
                    />
                    <div className="flex gap-2 items-center mt-[5px] mb-[24px]">
                      <InfoIcon />
                      <p className="text-text-grey font-normal text-[12px]">
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
                      <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-black-light">
                        Private tribe
                      </p>
                      <p className="font-sans font-normal text-text-grey text-[12px] leading-[14.4px]">
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
              <div className="flex flex-col fixed bottom-0 left-0 w-full pt-[16px] pr-[16px] pb-[24px] pl-[16px] justify-center items-center">
                <div className="mt-auto">
                  <FormikButton
                    title="Create tribe"
                    error={formik.isValid}
                    loading={formik.isSubmitting}
                    classes="w-[343px] px-[14px] p-[10px] rounded-[12px] border-step-color h-[48px]"
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
