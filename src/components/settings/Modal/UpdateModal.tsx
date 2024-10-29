"use client"
import React, {useEffect, useState} from 'react';
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useAppDispatch} from "@/redux/hook";
import * as yup from "yup";
import {useFormik} from "formik";
import {checkError} from "@/lib/checkError";
import CountryList from "country-list-with-dial-code-and-flag";
import {FormikButton} from "@/components/global/FormikButton";
import {updateUserData} from "@/features/authentication/authSlice";
import {useSelector} from "react-redux";
import {updateToastifyReducer} from "@/redux/toastifySlice";

type UpdateInterface = {
    toggle: () => void,
    isOpen: boolean,
    type: string,
    user: any
}

type FormValues = {
    skills?: string[],
    interests?: string[]
    username?: string
    bio?: string
    industry?: string
    address?: string
    city?: string
    country?: string
    state?: string
}

interface SocialMediaHandles {
    instagram: string;
    linkedin: string;
    facebook: string;
    twitter: string;
}

const UpdateModal: React.FC<UpdateInterface> = ({toggle, isOpen, type, user}) => {
    const dispatch = useAppDispatch()
    const {authToken} = useSelector((state: any) => state.auth)
    const [socials, setSocials] = useState<SocialMediaHandles>({
        instagram: '',
        linkedin: '',
        facebook: '',
        twitter: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSocials((prev) => ({ ...prev, [name]: value }));
    };

    const profileTypeHeader = () => {
        switch (type) {
            case "username":
                return "username"
            case "bio":
                return "bio"
            case "industry":
                return "profession"
            case "address":
                return "address"
            case "skills-interest":
                return "skills & interest"
            case "socials":
                return "socials"
            default:
                return "username"
        }
    }

    const skills = [
        "Creativity", "Leadership", "Problem-solving", "Critical thinking", "Work ethic"
    ]
    const interests = [
        "Arts", "Entertainment", "Science", "Sports", "Music", "Education", "Politics", "Religion", "Books", "Software", "Game", "History", "Health care", "Marketing"
    ]

    const handleSkillsClick = (item: string) => {
        const currentSkills = formik?.values?.skills;
        // Check if currentSkills is an array and then safely update it
        if (Array.isArray(currentSkills)) {
            const updatedSkills = currentSkills.includes(item)
                ? currentSkills.filter((i) => i !== item) // Remove if already in the array
                : [...currentSkills, item]; // Add if not in the array
            formik.setFieldValue('skills', updatedSkills);
        } else {
            // If currentSkills is not an array (which shouldn't happen if initialValues is set correctly)
            console.error('skills is not an array:', currentSkills);
        }
    };

    const handleInterestClick = (item: string) => {
        const currentInterests = formik?.values?.interests;
        // Check if currentInterests is an array and then safely update it
        if (Array.isArray(currentInterests)) {
            const updatedInterests = currentInterests.includes(item)
                ? currentInterests.filter((i) => i !== item) // Remove if already in the array
                : [...currentInterests, item]; // Add if not in the array
            formik.setFieldValue('interests', updatedInterests);
        } else {
            // If currentInterests is not an array (which shouldn't happen if initialValues is set correctly)
            console.error('interests is not an array:', currentInterests);
        }
    }

    const usernameSchema = yup.object({
        username: yup
            .string()
            .required("Username is required")
    });

    const bioSchema = yup.object({
        bio: yup
            .string()
            .required("Bio is required")
    });

    const industrySchema = yup.object({
        industry: yup
            .string()
            .required("Industry is required")
    });

    const addressSchema = yup.object({
        address: yup
            .string(),
        city: yup
            .string(),
        country: yup
            .string(),
        state: yup
            .string()
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
        socials: yup
            .array()
    });

    const profileTypeSchema = (type: string) => {
        switch (type) {
            case "username":
                return {
                    schema: usernameSchema,
                    initialValues: { username: "" },
                    endpoint: "/profile/settings/change-username"
                };
            case "bio":
                return {
                    schema: bioSchema,
                    initialValues: { bio: "" },
                    endpoint: "/profile/settings/change-bio"
                };
            case "industry":
                return {
                    schema: industrySchema,
                    initialValues: { industry: "" },
                    endpoint: "/profile/settings/change-profession"
                };
            case "addresses":
                return {
                    schema: addressSchema,
                    initialValues: { address: "", city: "", country: "", state: "" },
                    endpoint: "/profile/settings/change-address"
                };
            case "skills-interest":
                return {
                    schema: skillsSchema,
                    initialValues: { skills: [], interests: [] },
                    endpoint: "/profile/settings/change-skills"
                };
            case "socials":
                return {
                    schema: socialsSchema,
                    initialValues: { socials: [] },
                    endpoint: "/profile/settings/change-socials"
                };
            default:
                return {
                    schema: usernameSchema,
                    initialValues: { username: "" },
                    endpoint: "/profile/settings/change-username"
                };
        }
    };

    const formik = useFormik<FormValues>({
        initialValues: profileTypeSchema(type).initialValues,
        validationSchema: profileTypeSchema(type).schema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            dispatch(updateUserData({token: authToken, data: values, url: profileTypeSchema(type).endpoint})).then((res) => {
                if (res.payload.status) {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: `${type} updated successfully`,
                            type: "success",
                        })
                    );
                    toggle()
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: `Something went wrong`,
                            type: "error",
                        })
                    );
                }
            })
        },
    })

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
    }, [user, type]);

    const getSocialUrl = (platform: string) => {
        const social = user.socials.find((s: any) => s.name === platform);
        return social ? social.value : ''; // Return empty string if not found
    };

    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${isOpen ? "flex" : "hidden"}`}>
            <form onSubmit={formik.handleSubmit}>
                <div className="bg-white rounded-lg shadow-lg w-[480px] p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="cursor-pointer" onClick={toggle}>
                                <CloseIcon className="w-[11.25px]"/>
                            </div>
                            <p className="font-semibold text-[16px]">Change {profileTypeHeader()}</p>
                        </div>
                        <FormikButton title="Save changes" error={formik.isValid} loading={formik.isSubmitting} classes="max-w-[135px] p-2 max-h-[39px] rounded-[12px] border-[1px] shadow-custom-bottom" />
                    </div>
                    <div className="mt-[24px]">
                        <div className="flex flex-col">
                            {
                                type === "username" && (
                                    <div className="grid gap-1 mt-[24px]">
                                        <Label htmlFor="username"
                                               className="font-normal text-[14px] leading-[16.8px] text-text-grey">Username</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder=""
                                            className="h-[48px] rounded-[12px] bg-light_grey border-[1.5px] border-step-color"
                                            value={formik.values.username}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                )
                            }

                            {
                                type === "bio" && (
                                    <div className="grid gap-1 mt-[24px]">
                                        <Label htmlFor="bio"
                                               className="font-normal text-[14px] leading-[16.8px] text-text-grey">Bio</Label>
                                        <Input
                                            id="bio"
                                            type="text"
                                            placeholder=""
                                            className="h-[48px] rounded-[12px] bg-light_grey border-[1.5px] border-step-color"
                                            value={formik.values.bio}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                )
                            }

                            {
                                type === "industry" && (
                                    <div className="grid gap-1 mt-[24px]">
                                        <Label htmlFor="industry"
                                               className="font-normal text-[14px] leading-[16.8px] text-text-grey">Profession</Label>
                                        <Input
                                            id="industry"
                                            type="text"
                                            placeholder=""
                                            className="h-[48px] rounded-[12px] bg-light_grey border-[1.5px] border-step-color"
                                            value={formik.values.industry}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                )
                            }

                            {
                                type === "addresses" && (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="address" className="font-label">Address</Label>
                                            <Input
                                                id="address"
                                                type="text"
                                                className="h-12 rounded-xl bg-light_grey form-font border-0"
                                                value={formik.values.address}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                            {checkError("address", formik) ? (
                                                <p className="text-[#FF8D8D] text-[12px]">
                                                    {formik.errors.address}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="city" className="font-label">City</Label>
                                            <Input
                                                id="city"
                                                type="text"
                                                className="h-12 rounded-xl bg-light_grey form-font border-0"
                                                value={formik.values.city}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                            {checkError("city", formik) ? (
                                                <p className="text-[#FF8D8D] text-[12px]">
                                                    {formik.errors.city}
                                                </p>
                                            ) : null}
                                        </div>

                                        <div className="grid gap-2 my-2">
                                            <Label htmlFor="email" className="font-label">Country</Label>
                                            <select id="country"
                                                    className="h-12 rounded-xl bg-light_grey form-font border-0 px-2"
                                                    value={formik.values.country}
                                                    onChange={(e) => {
                                                        formik.setFieldValue("country", e.target.value)
                                                    }}>
                                                <option value="">Select country</option>
                                                {
                                                    CountryList.getAll().map((country, index) => (
                                                        <option value={country.name} key={index}>{country.name}</option>
                                                    ))
                                                }
                                            </select>
                                            {checkError("country", formik) ? (
                                                <p className="text-[#FF8D8D] text-[12px]">
                                                    {formik.errors.country}
                                                </p>
                                            ) : null}
                                        </div>
                                        <div className="grid gap-2 my-2">
                                            <Label htmlFor="state" className="font-label">State/Region</Label>
                                            <Input
                                                id="state"
                                                type="text"
                                                className="h-12 rounded-xl bg-light_grey form-font border-0"
                                                value={formik.values.state}
                                                onBlur={formik.handleBlur}
                                                onChange={formik.handleChange}
                                            />
                                            {checkError("state", formik) ? (
                                                <p className="text-[#FF8D8D] text-[12px]">
                                                    {formik.errors.state}
                                                </p>
                                            ) : null}
                                        </div>
                                    </>
                                )
                            }

                            {
                                type === "skills-interest" && (
                                    <div className="grid gap-1 mt-[24px]">
                                        <div>
                                            <p className="font-semibold text-[18px] font-sans">Skills</p>
                                        </div>
                                        <div className="grid grid-cols-[repeat(3,auto)] gap-3">
                                            {skills.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`text-[14px] font-normal inline-block p-2 py-[12px] rounded-lg whitespace-nowrap cursor-pointer text-center text-text-grey ${
                                                        Array.isArray(formik.values.skills) && formik.values.skills.includes(item) ? 'bg-gradient-green text-white' : 'bg-light_grey'
                                                    }`}
                                                    onClick={() => handleSkillsClick(item)}
                                                >
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                        {checkError("skills", formik) ? (
                                            <p className="text-[#FF8D8D] text-[12px]">
                                                {formik.errors.skills}
                                            </p>
                                        ) : null}
                                        <div className="mt-2">
                                            <p className="font-semibold text-[18px] font-sans">Interests</p>
                                        </div>
                                        <div className="grid grid-cols-[repeat(4,auto)] gap-3">
                                            {
                                                interests.map((item, idx) => (
                                                    <div
                                                        className={`text-[14px] font-normal inline-block p-2 py-[12px] rounded-lg whitespace-nowrap cursor-pointer text-center text-text-grey ${Array.isArray(formik.values.interests) && formik.values.interests.includes(item) ? 'bg-gradient-green text-white' : 'bg-light_grey'}`}
                                                        key={idx}
                                                        onClick={() => handleInterestClick(item)}
                                                    >{item}</div>
                                                ))
                                            }
                                        </div>
                                        {checkError("interests", formik) ? (
                                            <p className="text-[#FF8D8D] text-[12px]">
                                                {formik.errors.interests}
                                            </p>
                                        ) : null}
                                    </div>
                                )
                            }

                            {
                                type === "socials" && (
                                    <div className="grid gap-1 mt-[24px]">
                                        <div
                                            className="flex bg-light_grey p-2 px-[20px] border-0 items-center gap-2 rounded-xl h-[56px]">
                                            <div className="">
                                                <Image src={"/images/facebook.png"} alt="" width={19.2} height={19.2}/>
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
                                        <div
                                            className="flex bg-light_grey p-2 px-[20px] border-0 items-center gap-2 rounded-xl h-[56px]">
                                            <div className="">
                                                <Image src={"/images/linkedin.png"} alt="" width={19.2} height={19.2}/>
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
                                        <div
                                            className="flex bg-light_grey p-2 px-[20px] border-0 items-center gap-2 rounded-xl h-[56px]">
                                            <div className="">
                                                <Image src={"/images/twitter.png"} alt="" width={19.2} height={19.2}/>
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
                                        <div
                                            className="flex bg-light_grey p-2 px-[20px] border-0 items-center gap-2 rounded-xl h-[56px]">
                                            <div className="">
                                                <Image src={"/images/instagram.png"} alt="" width={19.2} height={19.2}/>
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
                                )
                            }


                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default UpdateModal;