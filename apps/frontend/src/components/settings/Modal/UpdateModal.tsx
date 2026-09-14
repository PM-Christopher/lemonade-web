"use client";
import React, { useEffect, useState } from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/redux/hook";
import * as yup from "yup";
import { useFormik } from "formik";
import { checkError } from "@lemonade/domain";
import CountryList from "country-list-with-dial-code-and-flag";
import { FormikButton } from "@/components/global/FormikButton";
import { useUpdateProfileFieldMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type UpdateInterface = {
  toggle: () => void;
  isOpen: boolean;
  type: string;
  user: any;
};

type FormValues = {
  skills?: string[];
  interests?: string[];
  username?: string;
  bio?: string;
  industry?: string;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
};

interface SocialMediaHandles {
  instagram: string;
  linkedin: string;
  facebook: string;
  twitter: string;
}

const UpdateModal: React.FC<UpdateInterface> = ({ toggle, isOpen, type, user }) => {
  const dispatch = useAppDispatch();
  const updateProfileFieldMutation = useUpdateProfileFieldMutation();
  const [socials, setSocials] = useState<SocialMediaHandles>({
    instagram: "",
    linkedin: "",
    facebook: "",
    twitter: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSocials((prev) => ({ ...prev, [name]: value }));
  };

  const profileTypeHeader = () => {
    switch (type) {
      case "username":
        return "username";
      case "bio":
        return "bio";
      case "industry":
        return "profession";
      case "address":
        return "address";
      case "skills-interest":
        return "skills & interest";
      case "socials":
        return "socials";
      default:
        return "username";
    }
  };

  const skills = ["Creativity", "Leadership", "Problem-solving", "Critical thinking", "Work ethic"];
  const interests = [
    "Arts",
    "Entertainment",
    "Science",
    "Sports",
    "Music",
    "Education",
    "Politics",
    "Religion",
    "Books",
    "Software",
    "Game",
    "History",
    "Health care",
    "Marketing",
  ];

  const handleSkillsClick = (item: string) => {
    const currentSkills = formik?.values?.skills;
    // Check if currentSkills is an array and then safely update it
    if (Array.isArray(currentSkills)) {
      const updatedSkills = currentSkills.includes(item)
        ? currentSkills.filter((i) => i !== item) // Remove if already in the array
        : [...currentSkills, item]; // Add if not in the array
      formik.setFieldValue("skills", updatedSkills);
    } else {
      // If currentSkills is not an array (which shouldn't happen if initialValues is set correctly)
      console.error("skills is not an array:", currentSkills);
    }
  };

  const handleInterestClick = (item: string) => {
    const currentInterests = formik?.values?.interests;
    // Check if currentInterests is an array and then safely update it
    if (Array.isArray(currentInterests)) {
      const updatedInterests = currentInterests.includes(item)
        ? currentInterests.filter((i) => i !== item) // Remove if already in the array
        : [...currentInterests, item]; // Add if not in the array
      formik.setFieldValue("interests", updatedInterests);
    } else {
      // If currentInterests is not an array (which shouldn't happen if initialValues is set correctly)
      console.error("interests is not an array:", currentInterests);
    }
  };

  const usernameSchema = yup.object({
    username: yup.string().required("Username is required"),
  });

  const bioSchema = yup.object({
    bio: yup.string().required("Bio is required"),
  });

  const industrySchema = yup.object({
    industry: yup.string().required("Industry is required"),
  });

  const addressSchema = yup.object({
    address: yup.string(),
    city: yup.string(),
    country: yup.string(),
    state: yup.string(),
  });

  const skillsSchema = yup.object({
    skills: yup
      .array()
      .of(yup.string()) // Ensure it's an array of strings
      .min(3, "At least three skills are required") // Add min length validation to prevent empty arrays
      .required("Skills is required"), // Required field
    interests: yup
      .array()
      .of(yup.string()) // Ensure it's an array of strings
      .min(3, "At least three interests are required") // Add min length validation to prevent empty arrays
      .required("Interests is required"), // Required field
  });

  const socialsSchema = yup.object({
    socials: yup.array(),
  });

  const profileTypeSchema = (type: string) => {
    switch (type) {
      case "username":
        return {
          schema: usernameSchema,
          initialValues: { username: "" },
          endpoint: "/user/profile/settings/change-username",
        };
      case "bio":
        return {
          schema: bioSchema,
          initialValues: { bio: "" },
          endpoint: "/user/profile/settings/change-bio",
        };
      case "industry":
        return {
          schema: industrySchema,
          initialValues: { industry: "" },
          endpoint: "/user/profile/settings/change-profession",
        };
      case "addresses":
        return {
          schema: addressSchema,
          initialValues: { address: "", city: "", country: "", state: "" },
          endpoint: "/user/profile/settings/change-address",
        };
      case "skills-interest":
        return {
          schema: skillsSchema,
          initialValues: { skills: [], interests: [] },
          endpoint: "/user/profile/settings/change-skills",
        };
      case "socials":
        return {
          schema: socialsSchema,
          initialValues: { socials: [] },
          endpoint: "/user/profile/settings/change-socials",
        };
      default:
        return {
          schema: usernameSchema,
          initialValues: { username: "" },
          endpoint: "/user/profile/settings/change-username",
        };
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: profileTypeSchema(type).initialValues,
    validationSchema: profileTypeSchema(type).schema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      updateProfileFieldMutation.mutate(
        { data: values, url: profileTypeSchema(type).endpoint },
        {
          onSuccess: () => {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: `${type} updated successfully`,
                type: "success",
              }),
            );
            toggle();
          },
          onError: () => {
            dispatch(
              updateToastifyReducer({
                show: true,
                message: `Something went wrong`,
                type: "error",
              }),
            );
          },
        },
      );
    },
  });

  useEffect(() => {
    // Get updated initialValues and validation schema based on `type`
    const { initialValues, schema } = profileTypeSchema(type);

    // Update Formik state with new schema and clear/reset values only for current type fields
    formik.setFormikState((prev) => ({
      ...prev,
      validationSchema: schema,
    }));

    // Reset form values for the current `type` only
    formik.resetForm({ values: initialValues });
    // formik is recreated on every keystroke and profileTypeSchema is a
    // plain function redeclared every render — adding either here would
    // re-run this reset on every render, discarding the user's own
    // edits. This effect must only fire when the field `type` changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  useEffect(() => {
    if (user) {
      switch (type) {
        case "username":
          formik.setFieldValue("username", user.username);
          break;
        case "bio":
          formik.setFieldValue("bio", user.bio);
          break;
        case "industry":
          formik.setFieldValue("industry", user.industry);
          break;
        case "skills-interest":
          formik.setFieldValue("skills", user.skills);
          formik.setFieldValue("interests", user.interests);
          break;
        case "addresses":
          formik.setFieldValue("address", user.address.address);
          formik.setFieldValue("city", user.address.city);
          formik.setFieldValue("country", user.address.country);
          formik.setFieldValue("state", user.address.state);
          break;
        case "socials":
          formik.setFieldValue("socials", user.socials);
          break;
        default:
          break;
      }
    }
    // formik is recreated on every keystroke — adding it here would
    // re-run this sync on every render, fighting the user's own edits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, type]);

  const getSocialUrl = (platform: string) => {
    const social = user.socials.find((s: any) => s.name === platform);
    return social ? social.value : ""; // Return empty string if not found
  };

  return (
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${isOpen ? "flex" : "hidden"}`}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="h-screen w-screen rounded-none bg-white p-6 shadow-lg laptop:h-full laptop:w-[480px] laptop:rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="cursor-pointer" onClick={toggle}>
                <CloseIcon className="w-[11.25px]" />
              </div>
              <p className="text-[16px] font-semibold">Change {profileTypeHeader()}</p>
            </div>
            <div className="hidden laptop:block">
              <FormikButton
                title="Save changes"
                error={formik.isValid}
                loading={formik.isSubmitting}
                classes="max-w-[135px] p-2 max-h-[39px] rounded-[12px] border-[1px] shadow-custom-bottom"
              />
            </div>
          </div>
          <div className="mt-[24px]">
            <div className="flex flex-col gap-y-[300px]">
              <div className="flex flex-col">
                {type === "username" && (
                  <div className="mt-[24px] grid gap-1">
                    <Label
                      htmlFor="username"
                      className="text-[14px] font-normal leading-[16.8px] text-text-grey"
                    >
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder=""
                      className="h-[48px] rounded-[12px] border-[1.5px] border-step-color bg-light_grey"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                    />
                  </div>
                )}

                {type === "bio" && (
                  <div className="mt-[24px] grid gap-1">
                    <Label
                      htmlFor="bio"
                      className="text-[14px] font-normal leading-[16.8px] text-text-grey"
                    >
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      type="text"
                      placeholder=""
                      className="h-[48px] rounded-[12px] border-[1.5px] border-step-color bg-light_grey"
                      value={formik.values.bio}
                      onChange={formik.handleChange}
                    />
                  </div>
                )}

                {type === "industry" && (
                  <div className="mt-[24px] grid gap-1">
                    <Label
                      htmlFor="industry"
                      className="text-[14px] font-normal leading-[16.8px] text-text-grey"
                    >
                      Profession
                    </Label>
                    <Input
                      id="industry"
                      type="text"
                      placeholder=""
                      className="h-[48px] rounded-[12px] border-[1.5px] border-step-color bg-light_grey"
                      value={formik.values.industry}
                      onChange={formik.handleChange}
                    />
                  </div>
                )}

                {type === "addresses" && (
                  <>
                    <div className="grid gap-4">
                      <Label htmlFor="address" className="font-label">
                        Address
                      </Label>
                      <Input
                        id="address"
                        type="text"
                        className="form-font h-12 rounded-xl border-0 bg-light_grey"
                        value={formik.values.address}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                      {checkError("address", formik) ? (
                        <p className="text-[12px] text-[#FF8D8D]">{formik.errors.address}</p>
                      ) : null}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city" className="font-label">
                        City
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        className="form-font h-12 rounded-xl border-0 bg-light_grey"
                        value={formik.values.city}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                      {checkError("city", formik) ? (
                        <p className="text-[12px] text-[#FF8D8D]">{formik.errors.city}</p>
                      ) : null}
                    </div>

                    <div className="my-2 grid gap-2">
                      <Label htmlFor="email" className="font-label">
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
                      {checkError("country", formik) ? (
                        <p className="text-[12px] text-[#FF8D8D]">{formik.errors.country}</p>
                      ) : null}
                    </div>
                    <div className="my-2 grid gap-2">
                      <Label htmlFor="state" className="font-label">
                        State/Region
                      </Label>
                      <Input
                        id="state"
                        type="text"
                        className="form-font h-12 rounded-xl border-0 bg-light_grey"
                        value={formik.values.state}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                      {checkError("state", formik) ? (
                        <p className="text-[12px] text-[#FF8D8D]">{formik.errors.state}</p>
                      ) : null}
                    </div>
                  </>
                )}

                {type === "skills-interest" && (
                  <div className="mt-[24px] grid gap-1">
                    <div>
                      <p className="font-sans text-[18px] font-semibold">Skills</p>
                    </div>
                    <div className="grid grid-cols-[repeat(3,auto)] gap-3">
                      {skills.map((item, idx) => (
                        <div
                          key={idx}
                          className={`inline-block cursor-pointer whitespace-nowrap rounded-lg p-2 py-[12px] text-center text-[14px] font-normal text-text-grey ${
                            Array.isArray(formik.values.skills) &&
                            formik.values.skills.includes(item)
                              ? "bg-gradient-green text-white"
                              : "bg-light_grey"
                          }`}
                          onClick={() => handleSkillsClick(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    {checkError("skills", formik) ? (
                      <p className="text-[12px] text-[#FF8D8D]">{formik.errors.skills}</p>
                    ) : null}
                    <div className="mt-2">
                      <p className="font-sans text-[18px] font-semibold">Interests</p>
                    </div>
                    <div className="grid grid-cols-[repeat(4,auto)] gap-3">
                      {interests.map((item, idx) => (
                        <div
                          className={`inline-block cursor-pointer whitespace-nowrap rounded-lg p-2 py-[12px] text-center text-[14px] font-normal text-text-grey ${Array.isArray(formik.values.interests) && formik.values.interests.includes(item) ? "bg-gradient-green text-white" : "bg-light_grey"}`}
                          key={idx}
                          onClick={() => handleInterestClick(item)}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                    {checkError("interests", formik) ? (
                      <p className="text-[12px] text-[#FF8D8D]">{formik.errors.interests}</p>
                    ) : null}
                  </div>
                )}

                {type === "socials" && (
                  <div className="mt-[24px] grid gap-1">
                    <div className="flex h-[56px] items-center gap-2 rounded-xl border-0 bg-light_grey p-2 px-[20px]">
                      <div className="">
                        <Image src={"/images/facebook.png"} alt="" width={19.2} height={19.2} />
                      </div>
                      <Input
                        name="facebook"
                        id="facebook"
                        type="text"
                        className="form-font border-0 shadow-none"
                        placeholder="Username"
                        value={socials.facebook || getSocialUrl("facebook")}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex h-[56px] items-center gap-2 rounded-xl border-0 bg-light_grey p-2 px-[20px]">
                      <div className="">
                        <Image src={"/images/linkedin.png"} alt="" width={19.2} height={19.2} />
                      </div>
                      <Input
                        name="linkedin"
                        id="linkedin"
                        type="text"
                        className="form-font border-0 shadow-none"
                        placeholder="Username"
                        value={socials.linkedin || getSocialUrl("linkedin")}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex h-[56px] items-center gap-2 rounded-xl border-0 bg-light_grey p-2 px-[20px]">
                      <div className="">
                        <Image src={"/images/twitter.png"} alt="" width={19.2} height={19.2} />
                      </div>
                      <Input
                        name="twitter"
                        id="twitter"
                        type="text"
                        className="form-font border-0 shadow-none"
                        placeholder="Username"
                        value={socials.twitter || getSocialUrl("twitter")}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="flex h-[56px] items-center gap-2 rounded-xl border-0 bg-light_grey p-2 px-[20px]">
                      <div className="">
                        <Image src={"/images/instagram.png"} alt="" width={19.2} height={19.2} />
                      </div>
                      <Input
                        name="instagram"
                        id="instagram"
                        type="text"
                        className="form-font border-0 shadow-none"
                        placeholder="Username"
                        value={socials.instagram || getSocialUrl("instagram")}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex laptop:hidden">
                <FormikButton
                  title="Save changes"
                  error={formik.isValid}
                  loading={formik.isSubmitting}
                  classes="w-full laptop:max-w-[135px] p-2 h-[48px] laptop:max-h-[39px] rounded-[12px] border-[1px] shadow-custom-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateModal;
