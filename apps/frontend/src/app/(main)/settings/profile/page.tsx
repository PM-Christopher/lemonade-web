"use client";
import React, { useRef, useState } from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import Image from "next/image";
import UploadCamIcon from "@/images/icons/UploadCameraIcon.svg";
import FacebookIcon from "@/images/icons/facebook-color.svg";
import InstagramIcon from "@/images/icons/instagram-color.svg";
import LinkedInIcon from "@/images/icons/linkedin-color.svg";
import TwitterIcon from "@/images/icons/twitter-color.svg";
import WebIcon from "@/images/icons/webIcon.svg";
import PencilIcon from "@/images/icons/pencilIcon.svg";
import UpdateModal from "@/components/settings/Modal/UpdateModal";
import { useSelector } from "react-redux";
import { formatString, splitLemonId } from "@/lib/helper";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layouts/MainLayout";
import { sharedApi } from "@/features/shared/api";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { useChangeProfileImageMutation } from "@/features/authentication/mutations";
import { setIsRouting } from "@/redux/tempSlice";

const ProfileSettingsPage = ({}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [profileType, setProfileType] = useState("");
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const changeProfileImageMutation = useChangeProfileImageMutation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const [avatar, setAvatar] = useState(null);

  // Handle file input change (when a file is selected)
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
            })
          );
        }
      } catch (err: any) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: err?.response?.data?.message || "error",
            type: "error",
          })
        );
      }
    }
  };

  const updateImageFunc = (data: any) => {
    changeProfileImageMutation.mutate({ profile_image: data }, {
      onSuccess: () => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: `Profile image updated successfully`,
            type: "success",
          })
        );
      },
      onError: (error: any) => {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: error?.message || `Something went wrong`,
            type: "error",
          })
        );
      },
    });
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
          <div
            className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
            onClick={() => router.back()}
          >
            <ChevronLeft />
            <p className="font-sans font-semibold text-[16px] tracking-custom">
              Profile settings
            </p>
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
                className="rounded-[24px] border-[1px] border-grey-90 w-[84px] h-[84px]"
              />

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              <div onClick={handleImageClick} className="hover:cursor-pointer">
                <UploadCamIcon className="absolute bottom-0 right-[-14px] w-8 h-8" />
              </div>
            </div>
            <div className="w-[343px] laptop:w-[640px] rounded-[12px] mt-[45.5px] p-[16px] flex flex-col bg-white gap-[8px]">
              <div className="flex justify-between">
                <p className="font-normal text-[14px]  text-text-grey">
                  Full name
                </p>
                <p className="font-semi-normal text-[14px]  text-black-light">
                  {user?.fullname}
                </p>
              </div>
              <div className="flex justify-between items-center my-[8px]">
                <p className="font-normal text-[14px]  text-text-grey">
                  Email address
                </p>
                <p className="font-semi-normal text-[14px]  text-black-light">
                  {user?.email}
                </p>
              </div>
              <div className="flex justify-between items-center my-[8px]">
                <p className="font-normal text-[14px]  text-text-grey">
                  Lemonade tag
                </p>
                <p className="font-semi-normal text-[14px]  text-black-light">
                  Lemon {splitLemonId(user?.lemon_id)} (L
                  {splitLemonId(user?.lemon_id)})
                </p>
              </div>
              <div className="flex justify-between items-center my-[8px]">
                <p className="font-normal text-[14px]  text-text-grey">
                  Username
                </p>
                <div className="flex gap-2 items-center">
                  <p className="font-semi-normal text-[14px]  text-black-light">
                    {user?.username}
                  </p>
                  <PencilIcon
                    className="w-[16px] h-[16px] cursor-pointer"
                    onClick={() => {
                      setProfileType("username");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center my-[8px]">
                <p className="font-normal text-[14px]  text-text-grey">Bio</p>
                <div className="flex gap-2 items-center">
                  <p className="font-semi-normal text-[14px] max-w-[163px] truncate text-black-light">
                    {user?.bio}
                  </p>
                  <PencilIcon
                    className="w-[16px] h-[16px] cursor-pointer"
                    onClick={() => {
                      setProfileType("bio");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center my-[8px]">
                <p className="font-normal text-[14px]  text-text-grey">
                  Profession
                </p>
                <div className="flex gap-2 items-center">
                  <p className="font-semi-normal text-[14px] text-black-light">
                    {formatString(user?.industry)}
                  </p>
                  <PencilIcon
                    className="w-[16px] h-[16px] cursor-pointer"
                    onClick={() => {
                      setProfileType("industry");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center my-[8px]">
                <p className="font-normal text-[14px]  text-text-grey">
                  Address
                </p>
                <div className="flex gap-2 items-center">
                  <p className="font-semi-normal text-[14px] max-w-[130px] truncate text-black-light">
                    {user?.address?.address}, {user?.address?.city},{" "}
                    {user?.address?.state}
                  </p>
                  <PencilIcon
                    className="w-[16px] h-[16px] cursor-pointer"
                    onClick={() => {
                      setProfileType("addresses");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center my-[8px]">
                <p className="font-normal text-[14px]  text-text-grey">
                  Skills & interests
                </p>
                <div className="flex gap-2 items-center">
                  <p className="font-semi-normal text-[14px] text-black-light">
                    {user?.skills.length + user?.interests.length}
                  </p>
                  <PencilIcon
                    className="w-[16px] h-[16px] cursor-pointer"
                    onClick={() => {
                      setProfileType("skills-interest");
                      toggleModal();
                    }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center my-[8px]">
                <p className="font-normal text-[14px]  text-text-grey">
                  Socials
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-[8px] bg-light_grey p-[4px] rounded-[18px]">
                    {user?.socials.map((link: any) => (
                      <a
                        href={link.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        key={link.name}
                      >
                        {link.name === "facebook" && (
                          <FacebookIcon className="w-[20px] h-[20px]" />
                        )}
                        {link.name === "instagram" && (
                          <InstagramIcon className="w-[20px] h-[20px]" />
                        )}
                        {link.name === "linkedin" && (
                          <LinkedInIcon className="w-[20px] h-[20px]" />
                        )}
                        {link.name === "twitter" && (
                          <TwitterIcon className="w-[20px] h-[20px]" />
                        )}
                        {link.name === "website" && (
                          <WebIcon className="w-[20px] h-[20px]" />
                        )}
                      </a>
                    ))}
                  </div>
                  <PencilIcon
                    className="w-[16px] h-[16px] cursor-pointer"
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
        <UpdateModal
          user={user}
          type={profileType}
          toggle={toggleModal}
          isOpen={isOpen}
        />
      </section>
    </MainLayout>
  );
};

export default ProfileSettingsPage;
