import React, { useState } from "react";
import { XIcon } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Label, Input } from "@lemonade/ui";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { useAddTeamMemberMutation } from "@/features/team/mutations";
import { updateToastifyReducer } from "@/redux/toastifySlice";

interface BalanceModalProps {
  isOpen: boolean;
  toggle: () => void;
}

const AddMember: React.FC<BalanceModalProps> = ({ isOpen, toggle }) => {
  const [isLoading, setLoading] = useState(false);
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
    <div
      className={`fixed inset-0 z-50 items-center justify-center bg-gray-800 bg-opacity-50 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      <div className="w-[360px] rounded-[12px] bg-white pb-[4px] pt-[16px]">
        <div className={"px-[16px] py-[4px]"}>
          <div className="flex items-center justify-between">
            <p className="font-sans text-[18px] font-semibold leading-[27px]">Add Admin</p>
            <div className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </div>
          </div>
        </div>
        <div className={"flex flex-col gap-[16px] px-[16px] py-[16px]"}>
          <div className="grid gap-2">
            <Label
              htmlFor="first_name"
              className="font-sans text-[14px] font-normal text-text-grey"
            >
              First name
            </Label>
            <Input
              id="first_name"
              type="text"
              placeholder=""
              className="form-font h-12 rounded-xl border-0 bg-light-grey"
              value={formik.values.first_name}
              onChange={formik.handleChange("first_name")}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="last_name" className="font-sans text-[14px] font-normal text-text-grey">
              Last name
            </Label>
            <Input
              id="last_name"
              type="text"
              placeholder=""
              className="form-font h-12 rounded-xl border-0 bg-light-grey"
              value={formik.values.last_name}
              onChange={formik.handleChange("last_name")}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email" className="font-sans text-[14px] font-normal text-text-grey">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. Janedoe@example.com"
              className="form-font h-12 rounded-xl border-0 bg-light-grey"
              value={formik.values.email}
              onChange={formik.handleChange("email")}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password" className="font-sans text-[14px] font-normal text-text-grey">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="form-font h-12 rounded-xl border-0 bg-light-grey"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              onBlur={formik.handleBlur}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role" className="font-sans text-[14px] font-normal text-text-grey">
              Role
            </Label>
            <Input
              id="role"
              type="text"
              className="form-font h-12 rounded-xl border-0 bg-light-grey"
              value={formik.values.role}
              onChange={formik.handleChange("role")}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>
        <div className={"flex justify-between gap-[16px] px-[16px] pb-[10px]"}>
          <button
            onClick={toggle}
            className={
              "w-full rounded-[12px] border-[1px] border-light-grey-50 bg-white px-[48px] py-[11px]"
            }
          >
            <p className={"text-[16px] font-medium text-black"}>Cancel</p>
          </button>
          <button
            onClick={() => formik.handleSubmit()}
            className={
              "w-full rounded-[12px] border-[1px] border-step-color bg-gradient-green px-[48px] py-[11px]"
            }
          >
            <p className={"text-[16px] font-medium text-white"}>Confirm</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
