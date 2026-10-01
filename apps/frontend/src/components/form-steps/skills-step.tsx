"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@lemonade/ui";
import { FormikButton } from "@/components/global/FormikButton";

import { axiosInstance } from "@/lib/axiosInstane";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { checkError } from "@lemonade/domain";
import { useFormik } from "formik";
import { skillsInterestsSchema } from "@lemonade/validation";
import { authFailure, authStart, loadStop } from "@/features/authentication/authSlice";
import { useCookies } from "react-cookie";

interface SkillsInterface {
  loading: boolean;
  next_step: () => void;
  prev_step: () => void;
}

type FormValues = {
  skills: string[];
  interests: string[];
};

interface LegacyAxiosError {
  response?: { data?: { message?: string } };
}

const SkillStep: React.FC<SkillsInterface> = ({ next_step }) => {
  const dispatch = useAppDispatch();
  const [cookie] = useCookies(["token", "newToken"]);

  const getHeader = () => {
    const token = cookie.newToken;
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
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

  //form validation
  const formik = useFormik<FormValues>({
    initialValues: {
      skills: [],
      interests: [],
    },
    validationSchema: skillsInterestsSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      await skillsStep(values);
    },
  });

  const skillsStep = async (values: FormValues) => {
    dispatch(authStart());

    try {
      const { data } = await axiosInstance.post(
        "/user/profile/skills-set-up",
        { ...values },
        getHeader(),
      );
      if (data.success) {
        next_step();
      } else {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Something went wrong",
            type: "error",
          }),
        );
      }
    } catch (err) {
      const legacyError = err as LegacyAxiosError;
      dispatch(authFailure());
      dispatch(
        updateToastifyReducer({
          show: true,
          message: legacyError?.response?.data?.message || "error",
          type: "error",
        }),
      );
    } finally {
      dispatch(loadStop());
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card className="tablet:w-[480px] w-full rounded-2xl border-none shadow-none">
        <CardHeader className="grid gap-4">
          <div className="flex gap-2">
            <div className="bg-step-color h-0.5 w-[15px]" />
            <div className="bg-step-color h-0.5 w-[15px]" />
            <div className="bg-step-color h-0.5 w-[15px]" />
            <div className="bg-border-grey h-0.5 w-[15px]" />
          </div>
          <div>
            <p className="font-sans text-[24px] font-semibold">Skills & Interests</p>
            <p className="text-text-grey font-sans text-[14px] leading-[21px] font-normal">
              Maximize your connections and experience by telling us <br />
              about your skills and interests.
            </p>
          </div>
        </CardHeader>
        <CardContent className="mt-[30px] grid gap-4">
          <div>
            <p className="font-sans text-[18px] font-semibold">Skills</p>
          </div>
          <div className="grid grid-cols-[repeat(3,auto)] gap-3">
            {skills.map((item, idx) => (
              <div
                key={idx}
                className={`text-text-grey inline-block cursor-pointer rounded-lg p-2 py-3 text-center text-[14px] font-normal whitespace-nowrap ${
                  Array.isArray(formik.values.skills) && formik.values.skills.includes(item)
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
                className={`text-text-grey inline-block cursor-pointer rounded-lg p-2 py-3 text-center text-[14px] font-normal whitespace-nowrap ${Array.isArray(formik.values.interests) && formik.values.interests.includes(item) ? "bg-gradient-green text-white" : "bg-light_grey"}`}
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
        </CardContent>
        <CardContent className="flex flex-col space-y-2">
          <FormikButton
            loading={formik.isSubmitting}
            title="Next"
            error={formik.isValid}
            classes="w-full h-12 rounded-xl"
          />
        </CardContent>
      </Card>
    </form>
  );
};
export default SkillStep;
