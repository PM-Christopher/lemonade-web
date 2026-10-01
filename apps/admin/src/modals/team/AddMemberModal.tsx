import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Label, Input, Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAddTeamMemberMutation } from "@/features/team/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface BalanceModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const AddMember: React.FC<BalanceModalProps> = ({ isOpen, toggle }) => {
  const [, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const addTeamMember = useAddTeamMemberMutation();
  const prodSchema = yup.object({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    first_name: yup
      .string()

      .required("first name is required"),
    last_name: yup
      .string()

      .required("last name is required"),
    password: yup.string().min(8).required("Password is required"),
    role: yup
      .string()

      .required("role is required"),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "",
    },
    validationSchema: prodSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      setLoading(true);
      addTeamMember.mutate(
        {
          email: values.email,
          name: `${values.first_name} ${values.last_name}`,
          password: values.password,
          role: values.role,
        },
        {
          onSuccess: () => {
            setLoading(false);
            dispatch(
              updateToastifyReducer({
                show: true,
                message: `Success `,
                type: "success",
              }),
            );
          },
          onError: (error) => {
            setLoading(false);
            dispatch(
              updateToastifyReducer({
                show: true,
                message: error?.message || `Something went wrong`,
                type: "error",
              }),
            );
          },
        },
      );
    },
  });
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Add Admin</DialogTitle>
        <div className="w-[360px] rounded-xl bg-white pt-4 pb-1">
          <div className={"px-4 py-1"}>
            <div className="flex items-center justify-between">
              <p className="font-sans text-[18px] leading-[27px] font-semibold">Add Admin</p>
              <div className="cursor-pointer" onClick={toggle}>
                <XIcon />
              </div>
            </div>
          </div>
          <div className={"flex flex-col gap-4 px-4 py-4"}>
            <div className="grid gap-2">
              <Label
                htmlFor="first_name"
                className="text-text-grey font-sans text-[14px] font-normal"
              >
                First name
              </Label>
              <Input
                id="first_name"
                type="text"
                placeholder=""
                className="form-font bg-light-grey h-12 rounded-xl border-0"
                value={formik.values.first_name}
                onChange={formik.handleChange("first_name")}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="last_name"
                className="text-text-grey font-sans text-[14px] font-normal"
              >
                Last name
              </Label>
              <Input
                id="last_name"
                type="text"
                placeholder=""
                className="form-font bg-light-grey h-12 rounded-xl border-0"
                value={formik.values.last_name}
                onChange={formik.handleChange("last_name")}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="text-text-grey font-sans text-[14px] font-normal">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. Janedoe@example.com"
                className="form-font bg-light-grey h-12 rounded-xl border-0"
                value={formik.values.email}
                onChange={formik.handleChange("email")}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="grid gap-2">
              <Label
                htmlFor="password"
                className="text-text-grey font-sans text-[14px] font-normal"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="form-font bg-light-grey h-12 rounded-xl border-0"
                value={formik.values.password}
                onChange={formik.handleChange("password")}
                onBlur={formik.handleBlur}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role" className="text-text-grey font-sans text-[14px] font-normal">
                Role
              </Label>
              <Input
                id="role"
                type="text"
                className="form-font bg-light-grey h-12 rounded-xl border-0"
                value={formik.values.role}
                onChange={formik.handleChange("role")}
                onBlur={formik.handleBlur}
              />
            </div>
          </div>
          <div className={"flex justify-between gap-4 px-4 pb-2.5"}>
            <button
              onClick={toggle}
              className={"border-light-grey-50 w-full rounded-xl border bg-white px-12 py-[11px]"}
            >
              <p className={"text-[16px] font-medium text-black"}>Cancel</p>
            </button>
            <button
              onClick={() => formik.handleSubmit()}
              className={
                "border-step-color bg-gradient-green w-full rounded-xl border px-12 py-[11px]"
              }
            >
              <p className={"text-[16px] font-medium text-white"}>Confirm</p>
            </button>
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
};

export default AddMember;
