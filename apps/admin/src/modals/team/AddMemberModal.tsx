import React, { useState } from "react";
import { CopyIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label, Input, Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAssignableRolesQuery } from "@/features/roles";
import { useAddTeamMemberMutation } from "@/features/team/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { apiMessage } from "@/lib/api-message";
import { addTeamMemberSchema, type AddTeamMemberInput } from "@/features/team/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { generateStrongPassword } from "@/utils/generatePassword";

interface BalanceModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const AddMember: React.FC<BalanceModalProps> = ({ isOpen, toggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const addTeamMember = useAddTeamMemberMutation();
  const { data: rolesData } = useAssignableRolesQuery({ enabled: isOpen });
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<AddTeamMemberInput>({
    resolver: zodResolver(addTeamMemberSchema),
    defaultValues: { first_name: "", last_name: "", email: "", password: "", role: "" },
    mode: "onTouched",
  });

  // Fills the field with a strong password and shows it so it can be copied and shared.
  const fillGeneratedPassword = () => {
    setValue("password", generateStrongPassword(), { shouldValidate: true, shouldDirty: true });
    setShowPassword(true);
    setCopied(false);
  };

  const copyPassword = async () => {
    const password = getValues("password");
    if (!password) return;
    await navigator.clipboard?.writeText(password);
    setCopied(true);
  };

  const onSubmit = (values: AddTeamMemberInput) => {
    addTeamMember.mutate(
      {
        email: values.email,
        name: `${values.first_name} ${values.last_name}`,
        password: values.password,
        role: values.role,
      },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({ show: true, message: apiMessage("Success"), type: "success" }),
          );
          reset();
          setShowPassword(false);
          setCopied(false);
          toggle();
        },
        onError: (error) => {
          if (applyServerErrors(error, setError, ["email", "password", "role"])) return;
          dispatch(
            updateToastifyReducer({
              show: true,
              message: error?.message || "Something went wrong",
              type: "error",
            }),
          );
        },
      },
    );
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Add Admin</DialogTitle>
        <div className="w-90 rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="text-body-xl font-sans font-semibold">Add Admin</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <div className="grid gap-2">
              <Label
                htmlFor="first_name"
                className="text-text-grey text-body-s font-sans font-normal"
              >
                First name
              </Label>
              <Input
                id="first_name"
                type="text"
                placeholder=""
                className="form-font bg-light-grey h-12 rounded-xl border-0"
                {...register("first_name")}
              />
              <FieldError message={errors.first_name?.message} />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="last_name"
                className="text-text-grey text-body-s font-sans font-normal"
              >
                Last name
              </Label>
              <Input
                id="last_name"
                type="text"
                placeholder=""
                className="form-font bg-light-grey h-12 rounded-xl border-0"
                {...register("last_name")}
              />
              <FieldError message={errors.last_name?.message} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-text-grey text-body-s font-sans font-normal">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. Janedoe@example.com"
                className="form-font bg-light-grey h-12 rounded-xl border-0"
                {...register("email")}
              />
              <FieldError message={errors.email?.message} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-text-grey text-body-s font-sans font-normal"
                >
                  Password
                </Label>
                <button
                  type="button"
                  className="text-light-green-70 text-meta cursor-pointer font-medium"
                  // Keeps focus where it is, so a validation message can't shift the button mid-click.
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={fillGeneratedPassword}
                >
                  Generate strong password
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="form-font bg-light-grey h-12 rounded-xl border-0 pr-20"
                  {...register("password")}
                />
                <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={copied ? "Password copied" : "Copy password"}
                    className="text-grey-40 cursor-pointer"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => void copyPassword()}
                  >
                    <CopyIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-grey-40 cursor-pointer"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => setShowPassword((current) => !current)}
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-4 w-4" />
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {copied && <p className="text-light-green-70 text-meta">Copied to clipboard</p>}
              <FieldError message={errors.password?.message} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role" className="text-text-grey text-body-s font-sans font-normal">
                Role
              </Label>
              <select
                id="role"
                className="form-font bg-light-grey h-12 rounded-xl border-0 px-3"
                {...register("role")}
              >
                <option value="">Choose a role</option>
                {(rolesData?.roles ?? []).map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.label}
                  </option>
                ))}
              </select>
              <FieldError message={errors.role?.message} />
            </div>
          </div>
          <div className={"flex justify-between gap-4 px-4 pb-2.5"}>
            <button
              onClick={toggle}
              className={"border-light-grey-50 w-full rounded-xl border bg-white px-12 py-2.75"}
            >
              <p className={"text-body-l font-medium text-black"}>Cancel</p>
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className={
                "border-step-color bg-gradient-green w-full rounded-xl border px-12 py-2.75"
              }
            >
              <p className={"text-body-l font-medium text-white"}>Confirm</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default AddMember;
