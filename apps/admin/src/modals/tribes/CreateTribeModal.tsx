import { Input, Label, Select, SelectContent, SelectTrigger, SelectValue, Textarea } from "@lemonade/ui";
import { XIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

interface CreateTribeModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const CreateTribeModal = ({ isOpen, toggle }: CreateTribeModalProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${!isOpen ? "hidden" : "flex"}`}
    >
      <form className="flex flex-col">
        <div className="flex h-screen w-full flex-col rounded-lg bg-white p-6 px-[48px] pb-[48px] shadow-lg tablet:h-full tablet:w-[640px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <XIcon onClick={toggle} className="cursor-pointer" />
              <p className="text-[18px] font-semiBold">Create Tribe</p>
            </div>
            <div className="hidden tablet:block">
              {/* <FormikButton title="Create tribe" error={formik.isValid} loading={formik.isSubmitting} classes="px-[14px] p-[10px] rounded-[12px] border-step-color" /> */}
            </div>
          </div>
          <div className="mt-[48px] flex justify-center tablet:mt-[24px]">
            {/* {
                                image ? (
                                    <Image src={image} alt="upload" width={89} height={83} className="border-[1px] cursor-pointer w-[89px] h-[89px] rounded-[24px]" onClick={handleImageClick} />
                                ) : (
                                    <Image src={"/images/upload.png"} alt="upload" width={89} height={83} className="cursor-pointer" onClick={handleImageClick} />
                                )
                            } */}
            <Image
              src={"/images/upload.png"}
              alt="upload"
              width={89}
              height={83}
              className="cursor-pointer"
            />
            <input
              type="file"
              // ref={fileInputRef}
              style={{ display: "none" }}
              // onChange={handleFileChange}
            />
          </div>
          <div className="mt-[16px] flex flex-col">
            <div className="grid gap-2">
              <Label
                htmlFor="tribe-name"
                className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
              >
                Tribe name
              </Label>
              <Input
                id="tribe-name"
                type="text"
                className="bg-light_grey form-font h-[48px] rounded-xl border-0"
                // value={formik.values.tribe_name}
                // onChange={(e: any) => {
                //     formik.setFieldValue("tribe_name", e.target.value)
                // }}
              />
            </div>
            <div className="mt-4 grid gap-2">
              <Label
                htmlFor="tribe-name"
                className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
              >
                Category
              </Label>
              <Select
              // value={formik.values.category}
              // onValueChange={(value) => {
              //     formik.setFieldValue("category", value)
              // }}
              >
                <SelectTrigger aria-label="Category" className="bg-light_grey h-[48px] rounded-xl border-0">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="form-font">
                  {/* {
                                            tribe_cat?.categories?.map((category: any, index: number) => (
                                                <SelectItem value={category?.name}
                                                            key={index}>{category?.name}</SelectItem>
                                            ))
                                        } */}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 grid gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="description"
                  className="font-sans text-[14px] font-normal leading-[16.8px] text-text-grey"
                >
                  Description
                </Label>
                <p className="text-[12px] font-normal text-text-grey">100 characters</p>
              </div>
              <Textarea
                id="description"
                className="bg-light_grey form-font h-[91px] resize-none rounded-xl border-0"
                placeholder="A short bio about yourself..."
                // value={formik.values.description}
                // onChange={(e: any) => {
                //     formik.setFieldValue("description", e.target.value)
                // }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTribeModal;
