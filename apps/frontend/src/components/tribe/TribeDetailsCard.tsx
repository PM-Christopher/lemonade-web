import React from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import ShareIcon from "@/images/icons/share.svg";
import AddUserIcon from "@/images/icons/addUserIcon.svg";
import { Button } from "@/components/ui/button";
import EditIcon from "@/images/icons/edit.svg";
import DeleteIcon from "@/images/icons/delete.svg";
import { TribeInterface, TribeMemberInterface } from "@/interfaces/TribeInterface";
import { formatLongDate } from "@/lib/dateTimeFormatter";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import SkeletonLoader from "@/components/global/SkeletonLoader";
import { getInitials } from "@/lib/helper";
import { TribeDetailsSkeleton } from "@/components/Skeletons";

type TribeDetailsInterface = {
  toggle: () => void;
  toggleJoin: () => void;
  tribe: TribeInterface | null;
  share: (tribe: TribeInterface | null) => void;
  toggleAddMember: () => void;
  threads: any;
  loading: boolean;
};
const TribeDetailsCard: React.FC<TribeDetailsInterface> = ({
  toggle,
  tribe,
  share,
  toggleAddMember,
  toggleJoin,
  threads,
  loading: tribeLoading,
}) => {
  const members = tribe?.member_list ?? [];

  return (
    <>
      {tribeLoading ? (
        <TribeDetailsSkeleton />
      ) : (
        <div className="flex h-fit w-[496px] flex-col gap-2 rounded-[12px] bg-white p-4 py-4">
          <div>
            <p className="font-sans text-[16px] font-semibold leading-[24px]">Tribe details</p>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="h-[96px] w-[96px] overflow-hidden rounded-[24px] border-[2px]">
              <Image
                src={tribe?.image || "/images/placeholder.png"} // fallback
                alt="tribe"
                width={96}
                height={96}
                className="h-full w-full object-fill"
              />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <p className="font-sans text-[16px] font-semibold leading-[24px]">
              {tribe?.tribe_name}
            </p>

            <i className="mt-1 font-sans text-[14px] font-semi-normal leading-[16.8px] text-text-grey">
              {tribe?.category}
            </i>

            <div className="mt-1 flex items-center justify-center gap-1">
              <p className="font-sans text-[12px] font-normal text-text-grey">
                {tribe?.members} members
              </p>

              <DotIcon className="h-[3px] w-[3px]" />

              <p className="font-sans text-[12px] font-normal text-text-grey">
                {threads.length} threads
              </p>
            </div>

            <div className="flex w-[311px] flex-col items-center">
              <>
                <p className="my-4 text-center font-sans text-[14px] font-normal leading-[21px] text-light-black">
                  {tribe?.description}
                </p>
                <p className="my-2 font-sans text-[12px] font-normal text-text-grey">
                  Created by <span className="font-semibold">{tribe?.created_by}</span> on{" "}
                  {formatLongDate(tribe?.created_at)}
                </p>
              </>
            </div>

            <div className="flex gap-[16px]">
              <div
                className="flex cursor-pointer flex-col items-center"
                onClick={() => share(tribe)}
              >
                <div className="flex flex-col items-center rounded-[16px] bg-light_grey p-[24px]">
                  <ShareIcon />
                </div>
                <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-black-light">
                  Share
                </p>
              </div>

              {tribe?.owner && (
                <div
                  className="flex cursor-pointer flex-col items-center"
                  onClick={toggleAddMember}
                >
                  <div className="flex flex-col items-center rounded-[16px] bg-light_grey p-[24px]">
                    <AddUserIcon />
                  </div>
                  <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-black-light">
                    Add member
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="my-2 flex justify-center">
            {tribe?.has_joined || tribe?.owner ? (
              <Button
                className="h-[60px] rounded-[37px] border border-step-color bg-gradient-green p-[14px] px-[24px] shadow-green-inset hover:shadow-green-inset-strong"
                onClick={toggle}
              >
                <div className="flex items-center justify-center gap-1">
                  <EditIcon />
                  <p className="font-sans text-[16px] font-semi-normal leading-[19.2px]">
                    Create thread
                  </p>
                </div>
              </Button>
            ) : (
              <Button
                className="h-[60px] rounded-[37px] border border-step-color bg-gradient-green p-[14px] px-[24px] shadow-green-inset hover:shadow-green-inset-strong"
                onClick={toggleJoin}
              >
                <div className="flex justify-center gap-1">
                  <p className="font-sans text-[16px] font-semi-normal leading-[19.2px]">
                    Join tribe
                  </p>
                </div>
              </Button>
            )}
          </div>
          {tribe?.monetized ? (
            <div className="my-4 flex items-center justify-between">
              <div className="flex flex-col">
                <p className="font-sans text-[16px] font-semi-normal leading-[24px] text-black-light">
                  Monetized Tribe
                </p>
                <p className="font-sans text-[12px] font-normal leading-[14.4px] text-text-grey">
                  Only paid users are allowed.
                </p>
              </div>
              <div>
                <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-light-black">
                  N {formatNumberWithCommas(tribe?.membership_fee)}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="flex flex-col rounded-[12px] bg-light_grey p-3">
            <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-text-grey">
              Members
            </p>
            <div className="mt-4">
              {members?.length > 0 ? (
                tribe?.member_list.map((member: TribeMemberInterface, index: number) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div>
                          {/*<Image src={member?.user?.avatar} alt="avatar" width={20} height={20} className="w-[20px] h-[20px] rounded-[6px]"/>*/}
                          <div className="flex h-[20px] w-[20px] items-center justify-center overflow-hidden rounded-[6px] bg-gray-200 text-[10px] font-semibold text-gray-700">
                            {member?.user?.avatar ? (
                              <Image
                                src={member.user.avatar}
                                alt="avatar"
                                width={20}
                                height={20}
                                className="h-[20px] w-[20px] object-cover"
                              />
                            ) : (
                              getInitials(member?.user?.fullname)
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-sans text-[14px] font-semi-normal leading-[21px] text-black-light">
                            {member?.user?.username}
                          </p>
                        </div>
                      </div>
                      {tribe?.owner && (
                        <div>
                          <DeleteIcon />
                        </div>
                      )}
                    </div>
                    <div className="my-2 border-t-[1px]"></div>
                  </React.Fragment>
                ))
              ) : (
                <p className={"text-[14px] font-normal leading-[21px] text-text-grey"}>
                  No members yet.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TribeDetailsCard;
