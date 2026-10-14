"use client";
import { images } from "@/lib/images";
import React, { useEffect } from "react";
import CloseIcon from "@/images/icons/close.svg";
import Image from "next/image";
import { Label, Input, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useAppDispatch } from "@/redux/hook";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CountryList from "country-list-with-dial-code-and-flag";
import { SubmitButton } from "@/components/global/SubmitButton";
import { FieldError } from "@/components/global/FieldError";
import { applyServerErrors } from "@/lib/form-errors";
import { useUpdateProfileFieldMutation } from "@/features/authentication/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import {
  changeAddressSchema,
  changeBioSchema,
  changeProfessionSchema,
  changeSkillsSchema,
  changeSocialsSchema,
  changeUsernameSchema,
} from "@/features/settings/schema";

interface UpdateModalUser {
  username?: string | null;
  bio?: string | null;
  industry?: string | null;
  skills?: string[];
  interests?: string[];
  address?: {
    address?: string | null;
    city?: string | null;
    country?: string | null;
    state?: string | null;
  } | null;
  socials?: Array<{ name: string; value: string }>;
}

type UpdateInterface = {
  toggle: () => void;
  isOpen: boolean;
  type: string;
  user: UpdateModalUser | null;
};

type FormValues = {
  username?: string;
  bio?: string;
  industry?: string;
  address?: string;
  city?: string;
  country?: string;
  state?: string;
  skills?: string[];
  interests?: string[];
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
};

const SKILLS = ["Creativity", "Leadership", "Problem-solving", "Critical thinking", "Work ethic"];
const INTERESTS = [
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

const profileTypeHeader = (type: string) => {
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

const socialUrl = (user: UpdateModalUser | null, platform: string) => {
  const social = user?.socials?.find((s) => s.name === platform);
  return social ? social.value : "";
};

// Picks the Zod schema, defaults, and API path for the field being edited.
const profileTypeConfig = (type: string, user: UpdateModalUser | null) => {
  switch (type) {
    case "username":
      return {
        schema: changeUsernameSchema,
        endpoint: "/user/profile/settings/change-username",
        defaults: { username: user?.username ?? "" } satisfies FormValues,
        fields: ["username"] as const,
      };
    case "bio":
      return {
        schema: changeBioSchema,
        endpoint: "/user/profile/settings/change-bio",
        defaults: { bio: user?.bio ?? "" } satisfies FormValues,
        fields: ["bio"] as const,
      };
    case "industry":
      return {
        schema: changeProfessionSchema,
        endpoint: "/user/profile/settings/change-profession",
        defaults: { industry: user?.industry ?? "" } satisfies FormValues,
        fields: ["industry"] as const,
      };
    case "addresses":
      return {
        schema: changeAddressSchema,
        endpoint: "/user/profile/settings/change-address",
        defaults: {
          address: user?.address?.address ?? "",
          city: user?.address?.city ?? "",
          country: user?.address?.country ?? "",
          state: user?.address?.state ?? "",
        } satisfies FormValues,
        fields: ["address", "city", "country", "state"] as const,
      };
    case "skills-interest":
      return {
        schema: changeSkillsSchema,
        endpoint: "/user/profile/settings/change-skills",
        defaults: {
          skills: user?.skills ?? [],
          interests: user?.interests ?? [],
        } satisfies FormValues,
        fields: ["skills", "interests"] as const,
      };
    case "socials":
      return {
        schema: changeSocialsSchema,
        endpoint: "/user/profile/settings/change-socials",
        defaults: {
          facebook: socialUrl(user, "facebook"),
          linkedin: socialUrl(user, "linkedin"),
          twitter: socialUrl(user, "twitter"),
          instagram: socialUrl(user, "instagram"),
        } satisfies FormValues,
        fields: ["facebook", "linkedin", "twitter", "instagram"] as const,
      };
    default:
      return {
        schema: changeUsernameSchema,
        endpoint: "/user/profile/settings/change-username",
        defaults: { username: user?.username ?? "" } satisfies FormValues,
        fields: ["username"] as const,
      };
  }
};

type UpdateFormProps = {
  toggle: () => void;
  type: string;
  user: UpdateModalUser | null;
};

const UpdateForm: React.FC<UpdateFormProps> = ({ toggle, type, user }) => {
  const dispatch = useAppDispatch();
  const updateProfileFieldMutation = useUpdateProfileFieldMutation();
  const config = profileTypeConfig(type, user);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    // Each type mounts its own schema via key={type}; cast keeps one FormValues shape.
    resolver: zodResolver(config.schema) as Resolver<FormValues>,
    defaultValues: config.defaults,
    mode: "onTouched",
  });

  const watched = useWatch({ control });
  const selectedSkills = watched.skills ?? [];
  const selectedInterests = watched.interests ?? [];

  useEffect(() => {
    const next = profileTypeConfig(type, user).defaults;
    for (const [key, value] of Object.entries(next)) {
      setValue(key as keyof FormValues, value as never, { shouldValidate: true });
    }
  }, [user, type, setValue]);

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const handleSkillsClick = (item: string) =>
    setValue("skills", toggleItem(selectedSkills, item), { shouldValidate: true });

  const handleInterestClick = (item: string) =>
    setValue("interests", toggleItem(selectedInterests, item), { shouldValidate: true });

  const onSubmit = (values: FormValues) => {
    const payload =
      type === "socials"
        ? {
            socials: (["facebook", "linkedin", "twitter", "instagram"] as const)
              .filter((key) => values[key])
              .map((key) => ({ name: key, value: values[key] as string })),
          }
        : values;

    updateProfileFieldMutation.mutate(
      { data: payload, url: config.endpoint },
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
        onError: (error) => {
          if (applyServerErrors(error, setError, config.fields as unknown as (keyof FormValues)[]))
            return;
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
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="laptop:h-full laptop:w-[480px] laptop:rounded-lg h-screen w-screen rounded-none bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="cursor-pointer" onClick={toggle}>
              <CloseIcon className="w-[11.25px]" />
            </div>
            <p className="text-[16px] font-semibold">Change {profileTypeHeader(type)}</p>
          </div>
          <div className="laptop:block hidden">
            <SubmitButton
              title="Save changes"
              isValid={isValid}
              loading={isSubmitting}
              classes="max-w-[135px] p-2 max-h-[39px] rounded-xl border shadow-custom-bottom"
            />
          </div>
        </div>
        <div className="mt-6">
          <div className="flex flex-col gap-y-[300px]">
            <div className="flex flex-col">
              {type === "username" && (
                <div className="mt-6 grid gap-1">
                  <Label
                    htmlFor="username"
                    className="text-text-grey text-[14px] leading-[16.8px] font-normal"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder=""
                    className="border-step-color bg-light_grey h-12 rounded-xl border-[1.5px]"
                    {...register("username")}
                  />
                  <FieldError message={errors.username?.message} />
                </div>
              )}

              {type === "bio" && (
                <div className="mt-6 grid gap-1">
                  <Label
                    htmlFor="bio"
                    className="text-text-grey text-[14px] leading-[16.8px] font-normal"
                  >
                    Bio
                  </Label>
                  <Input
                    id="bio"
                    type="text"
                    placeholder=""
                    className="border-step-color bg-light_grey h-12 rounded-xl border-[1.5px]"
                    {...register("bio")}
                  />
                  <FieldError message={errors.bio?.message} />
                </div>
              )}

              {type === "industry" && (
                <div className="mt-6 grid gap-1">
                  <Label
                    htmlFor="industry"
                    className="text-text-grey text-[14px] leading-[16.8px] font-normal"
                  >
                    Profession
                  </Label>
                  <Input
                    id="industry"
                    type="text"
                    placeholder=""
                    className="border-step-color bg-light_grey h-12 rounded-xl border-[1.5px]"
                    {...register("industry")}
                  />
                  <FieldError message={errors.industry?.message} />
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
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      {...register("address")}
                    />
                    <FieldError message={errors.address?.message} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="city" className="font-label">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      {...register("city")}
                    />
                    <FieldError message={errors.city?.message} />
                  </div>

                  <div className="my-2 grid gap-2">
                    <Label htmlFor="email" className="font-label">
                      Country
                    </Label>
                    <select
                      id="country"
                      className="form-font bg-light_grey h-12 rounded-xl border-0 px-2"
                      {...register("country")}
                    >
                      <option value="">Select country</option>
                      {CountryList.getAll().map((country, index) => (
                        <option value={country.name} key={index}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.country?.message} />
                  </div>
                  <div className="my-2 grid gap-2">
                    <Label htmlFor="state" className="font-label">
                      State/Region
                    </Label>
                    <Input
                      id="state"
                      type="text"
                      className="form-font bg-light_grey h-12 rounded-xl border-0"
                      {...register("state")}
                    />
                    <FieldError message={errors.state?.message} />
                  </div>
                </>
              )}

              {type === "skills-interest" && (
                <div className="mt-6 grid gap-1">
                  <div>
                    <p className="font-sans text-[18px] font-semibold">Skills</p>
                  </div>
                  <div className="grid grid-cols-[repeat(3,auto)] gap-3">
                    {SKILLS.map((item, idx) => (
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
                    {INTERESTS.map((item, idx) => (
                      <div
                        className={`text-text-grey inline-block cursor-pointer rounded-lg p-2 py-3 text-center text-[14px] font-normal whitespace-nowrap ${
                          selectedInterests.includes(item)
                            ? "bg-gradient-green text-white"
                            : "bg-light_grey"
                        }`}
                        key={idx}
                        onClick={() => handleInterestClick(item)}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <FieldError message={errors.interests?.message} />
                </div>
              )}

              {type === "socials" && (
                <div className="mt-6 grid gap-1">
                  {(
                    [
                      { name: "facebook" as const, icon: images.FACEBOOK },
                      { name: "linkedin" as const, icon: images.LINKEDIN },
                      { name: "twitter" as const, icon: images.TWITTER },
                      { name: "instagram" as const, icon: images.INSTAGRAM },
                    ] as const
                  ).map((field) => (
                    <label
                      key={field.name}
                      htmlFor={field.name}
                      className="bg-light_grey focus-within:border-step-color flex h-14 w-full items-center gap-3 rounded-xl border border-transparent px-5"
                    >
                      <Image
                        src={field.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 shrink-0"
                      />
                      <input
                        id={field.name}
                        type="text"
                        className="form-font placeholder:text-text-grey h-full w-full min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:outline-none"
                        placeholder="Username"
                        {...register(field.name)}
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>
            <div className="laptop:hidden flex">
              <SubmitButton
                title="Save changes"
                isValid={isValid}
                loading={isSubmitting}
                classes="w-full laptop:max-w-[135px] p-2 h-12 laptop:max-h-[39px] rounded-xl border shadow-custom-bottom"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const UpdateModal: React.FC<UpdateInterface> = ({ toggle, isOpen, type, user }) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Change {profileTypeHeader(type)}</DialogTitle>
        {/* Remount when the edited field changes so the schema and defaults reset. */}
        <UpdateForm key={type} toggle={toggle} type={type} user={user} />
      </DialogContentBare>
    </Dialog>
  );
};

export default UpdateModal;
