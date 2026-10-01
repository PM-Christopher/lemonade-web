"use client";
import React, { useRef, useState } from "react";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import UploadCamIcon from "@/images/icons/UploadCameraIcon.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import PencilIcon from "@/images/icons/pencilIcon.svg";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { formatString, splitLemonId } from "@/lib/helper";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { sharedApi } from "@/features/shared/api";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useChangeProfileImageMutation } from "@/features/authentication/mutations";
import { setIsRouting } from "@/redux/tempSlice";
import type { RootState } from "@/redux/store";

// Off the initial bundle — only needed once a field's edit button is
// clicked (docs/ARCHITECTURE.md Phase 6, "lazy-load heavy leaf UI").
const UpdateModal = dynamic(() => import("@/components/settings/Modal/UpdateModal"), {
  ssr: false,
});

const ProfileSettingsPage = ({}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [profileType, setProfileType] = useState("");
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const changeProfileImageMutation = useChangeProfileImageMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const [, setAvatar] = useState(null);

  // Handle file input change (when a file is selected)
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        dispatch(setIsRouting(true));
        const { data } = await sharedApi.uploadFile(formData);
        // Found live: the BFF envelope key is `success`, not `status` — this
        // check was always false, so a successful upload always showed the
        // "error" toast below. Not otherwise touching this call (upload
        // stays on axiosInstance; see features/shared/api.ts's NOTE).
        if (data.success) {
          setAvatar(data.data.image);
          // await formik.setFieldValue("profile_image", data.data.image)
          //   dispatch(
          //     updateToastifyReducer({
          //       show: true,
          //       message: "Image uploaded",
          //       type: "success",
          //     })
          //   );

          updateImageFunc(data.data.image);
        } else {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: "Error uploading image",
              type: "error",
            }),
          );
        }
      } catch (err) {
        const legacyError = err as { response?: { data?: { message?: string } } };
        dispatch(
          updateToastifyReducer({
            show: true,
            message: legacyError?.response?.data?.message || "error",
            type: "error",
          }),
        );
      }
    }
  };

  const updateImageFunc = (data: string) => {
    changeProfileImageMutation.mutate(
      { profile_image: data },
      {
        onSuccess: () => {
          dispatch(
            updateToastifyReducer({
              show: true,
              message: `Profile image updated successfully`,
              type: "success",
            }),
          );
        },
        onError: (error: { message?: string }) => {
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
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="laptop:px-16 flex items-center justify-between border-t border-b bg-white p-2 px-4">
          <div
            className="flex cursor-pointer items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Profile settings</p>
          </div>
        </div>

        <section className="mt-[61.5px] flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="relative">
              <Image
                src={user?.profile_image ?? "/images/avatar_4.png"}
                alt="avatar"
                width={84}
                height={84}
                className="border-grey-90 h-[84px] w-[84px] rounded-3xl border"
              />

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <div onClick={handleImageClick} className="hover:cursor-pointer">
                <UploadCamIcon className="absolute -right-3.5 bottom-0 h-8 w-8" />
              </div>
            </div>
            <div className="laptop:w-[640px] mt-[45.5px] flex w-[343px] flex-col gap-2 rounded-xl bg-white p-4">
              <div className="flex justify-between">
                <p className="text-text-grey text-[14px] font-normal">Full name</p>
                <p className="font-semi-normal text-black-light text-[14px]">{user?.fullname}</p>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Email address</p>
                <p className="font-semi-normal text-black-light text-[14px]">{user?.email}</p>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Lemonade tag</p>
                <p className="font-semi-normal text-black-light text-[14px]">
                  Lemon {splitLemonId(user?.lemon_id)} (L
                  {splitLemonId(user?.lemon_id)})
                </p>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Username</p>
                <div className="flex items-center gap-2">
                  <p className="font-semi-normal text-black-light text-[14px]">{user?.username}</p>
                  <PencilIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                      setProfileType("username");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Bio</p>
                <div className="flex items-center gap-2">
                  <p className="font-semi-normal text-black-light max-w-[163px] truncate text-[14px]">
                    {user?.bio}
                  </p>
                  <PencilIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                      setProfileType("bio");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Profession</p>
                <div className="flex items-center gap-2">
                  <p className="font-semi-normal text-black-light text-[14px]">
                    {formatString(user?.industry)}
                  </p>
                  <PencilIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                      setProfileType("industry");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Address</p>
                <div className="flex items-center gap-2">
                  <p className="font-semi-normal text-black-light max-w-[130px] truncate text-[14px]">
                    {user?.address?.address}, {user?.address?.city}, {user?.address?.state}
                  </p>
                  <PencilIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                      setProfileType("addresses");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Skills & interests</p>
                <div className="flex items-center gap-2">
                  <p className="font-semi-normal text-black-light text-[14px]">
                    {user?.skills.length + user?.interests.length}
                  </p>
                  <PencilIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                      setProfileType("skills-interest");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="my-2 flex items-center justify-between">
                <p className="text-text-grey text-[14px] font-normal">Socials</p>
                <div className="flex items-center gap-2">
                  <div className="bg-light_grey flex items-center gap-2 rounded-[18px] p-1">
                    {user?.socials.map((link: { name?: string; value?: string }) => (
                      <a
                        href={link.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={link.name}
                      >
                        {link.name === "facebook" && <FacebookIcon className="h-5 w-5" />}
                        {link.name === "instagram" && <InstagramIcon className="h-5 w-5" />}
                        {link.name === "linkedin" && <LinkedInIcon className="h-5 w-5" />}
                        {link.name === "twitter" && <TwitterIcon className="h-5 w-5" />}
                        {link.name === "website" && <WebIcon className="h-5 w-5" />}
                      </a>
                    ))}
                  </div>
                  <PencilIcon
                    className="h-4 w-4 cursor-pointer"
                    onClick={() => {
                      setProfileType("socials");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <UpdateModal user={user} type={profileType} toggle={toggleModal} isOpen={isOpen} />
      </section>
    </MainLayout>
  );
};

export default ProfileSettingsPage;
