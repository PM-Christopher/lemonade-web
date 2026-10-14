"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@lemonade/ui";
import { SubmitButton } from "@/components/global/SubmitButton";

import { authApi } from "@/features/authentication/api";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillsInterestsSchema, type SkillsInterestsInput } from "@lemonade/validation";
import { FieldError } from "@/components/global/FieldError";
import { authFailure, authStart, loadStop } from "@/features/authentication/authSlice";
import { errorMessage } from "@/lib/api-error";

interface SkillsInterface {
  loading: boolean;
  next_step: () => void;
  prev_step: () => void;
}

const SkillStep: React.FC<SkillsInterface> = ({ next_step }) => {
  const dispatch = useAppDispatch();

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

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SkillsInterestsInput>({
    resolver: zodResolver(skillsInterestsSchema),
    defaultValues: { skills: [], interests: [] },
    mode: "onChange",
  });
  const values = useWatch({ control });
  const selectedSkills = values.skills ?? [];
  const selectedInterests = values.interests ?? [];

  // Clicking an item adds it, clicking again removes it.
  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const handleSkillsClick = (item: string) =>
    setValue("skills", toggleItem(selectedSkills, item), { shouldValidate: true });

  const handleInterestClick = (item: string) =>
    setValue("interests", toggleItem(selectedInterests, item), { shouldValidate: true });

  const onSubmit = async (values: SkillsInterestsInput) => {
    dispatch(authStart());

    try {
      await authApi.skillsSetUp(values);
      next_step();
    } catch (err) {
      dispatch(authFailure());
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(err, "error"),
          type: "error",
        }),
      );
    } finally {
      dispatch(loadStop());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="tablet:w-[480px] w-full rounded-2xl border-none p-6 shadow-none">
        <CardHeader className="grid gap-4 p-0">
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
        <CardContent className="mt-6 grid gap-4 p-0">
          <div>
            <p className="font-sans text-[18px] font-semibold">Skills</p>
          </div>
          <div className="grid grid-cols-[repeat(3,auto)] gap-3">
            {skills.map((item, idx) => (
              <div
                key={idx}
                className={`text-text-grey inline-block cursor-pointer rounded-lg p-2 py-3 text-center text-[14px] font-normal whitespace-nowrap ${
                  selectedSkills.includes(item)
                    ? "bg-gradient-green text-white"
                    : "bg-light_grey"
                }`}
                onClick={() => handleSkillsClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
          <FieldError message={errors.skills?.message} />
          <div className="mt-2">
            <p className="font-sans text-[18px] font-semibold">Interests</p>
          </div>
          <div className="grid grid-cols-[repeat(4,auto)] gap-3">
            {interests.map((item, idx) => (
              <div
                className={`text-text-grey inline-block cursor-pointer rounded-lg p-2 py-3 text-center text-[14px] font-normal whitespace-nowrap ${selectedInterests.includes(item) ? "bg-gradient-green text-white" : "bg-light_grey"}`}
                key={idx}
                onClick={() => handleInterestClick(item)}
              >
                {item}
              </div>
            ))}
          </div>
          <FieldError message={errors.interests?.message} />
        </CardContent>
        <CardContent className="mt-4 flex flex-col space-y-2 p-0">
          <SubmitButton
            loading={isSubmitting}
            title="Next"
            isValid={isValid}
            classes="w-full h-12 rounded-xl"
          />
        </CardContent>
      </Card>
    </form>
  );
};
export default SkillStep;
