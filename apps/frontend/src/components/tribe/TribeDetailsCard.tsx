import React from "react";
import Image from "next/image";
import DotIcon from "@/images/icons/dot.svg";
import ShareIcon from "@/images/icons/share.svg";
import AddUserIcon from "@/images/icons/addUserIcon.svg";
import { Button } from "@lemonade/ui";
import EditIcon from "@/images/icons/edit.svg";
import DeleteIcon from "@/images/icons/delete.svg";
import { TribeInterface, TribeMemberInterface } from "@/interfaces/TribeInterface";
import type { Thread } from "@/interfaces/TribeInterface";
import { formatLongDate } from "@/lib/dateTimeFormatter";
import { formatNumberWithCommas } from "@/lib/formatNumber";
import { getInitials } from "@/lib/helper";
import { TribeDetailsSkeleton } from "@/components/Skeletons";

type TribeDetailsInterface = {
  toggle: () => void;
  toggleJoin: () => void;
  tribe: TribeInterface | null;
  share: (tribe: TribeInterface | null) => void;
  toggleAddMember: () => void;
  threads: Thread[];
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
        <div className="flex h-fit w-[496px] flex-col gap-2 rounded-xl bg-white p-4 py-4">
          <div>
            <p className="font-sans text-[16px] leading-[24px] font-semibold">Tribe details</p>
          </div>
          <div className="mt-10 flex justify-center">
            <div className="h-24 w-24 overflow-hidden rounded-3xl border-2">
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
            <p className="font-sans text-[16px] leading-[24px] font-semibold">
              {tribe?.tribe_name}
            </p>

            <i className="font-semi-normal text-text-grey mt-1 font-sans text-[14px] leading-[16.8px]">
              {tribe?.category}
            </i>

            <div className="mt-1 flex items-center justify-center gap-1">
              <p className="text-text-grey font-sans text-[12px] font-normal">
                {tribe?.members} members
              </p>

              <DotIcon className="h-[3px] w-[3px]" />

              <p className="text-text-grey font-sans text-[12px] font-normal">
                {threads.length} threads
              </p>
            </div>

            <div className="flex w-[311px] flex-col items-center">
              <>
                <p className="text-light-black my-4 text-center font-sans text-[14px] leading-[21px] font-normal">
                  {tribe?.description}
                </p>
                <p className="text-text-grey my-2 font-sans text-[12px] font-normal">
                  Created by <span className="font-semibold">{tribe?.created_by}</span> on{" "}
                  {formatLongDate(tribe?.created_at)}
                </p>
              </>
            </div>

            <div className="flex gap-4">
              <div
                className="flex cursor-pointer flex-col items-center"
                onClick={() => share(tribe)}
              >
                <div className="bg-light_grey flex flex-col items-center rounded-2xl p-6">
                  <ShareIcon />
                </div>
                <p className="font-semi-normal text-black-light font-sans text-[14px] leading-[21px]">
                  Share
                </p>
              </div>

              {tribe?.owner && (
                <div
                  className="flex cursor-pointer flex-col items-center"
                  onClick={toggleAddMember}
                >
                  <div className="bg-light_grey flex flex-col items-center rounded-2xl p-6">
                    <AddUserIcon />
                  </div>
                  <p className="font-semi-normal text-black-light font-sans text-[14px] leading-[21px]">
                    Add member
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="my-2 flex justify-center">
            {tribe?.has_joined || tribe?.owner ? (
              <Button
                className="border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong h-[60px] rounded-[37px] border p-3.5 px-6"
                onClick={toggle}
              >
                <div className="flex items-center justify-center gap-1">
                  <EditIcon />
                  <p className="font-semi-normal font-sans text-[16px] leading-[19.2px]">
                    Create thread
                  </p>
                </div>
              </Button>
            ) : (
              <Button
                className="border-step-color bg-gradient-green shadow-green-inset hover:shadow-green-inset-strong h-[60px] rounded-[37px] border p-3.5 px-6"
                onClick={toggleJoin}
              >
                <div className="flex justify-center gap-1">
                  <p className="font-semi-normal font-sans text-[16px] leading-[19.2px]">
                    Join tribe
                  </p>
                </div>
              </Button>
            )}
          </div>
          {tribe?.monetized ? (
            <div className="my-4 flex items-center justify-between">
              <div className="flex flex-col">
                <p className="font-semi-normal text-black-light font-sans text-[16px] leading-[24px]">
                  Monetized Tribe
                </p>
                <p className="text-text-grey font-sans text-[12px] leading-[14.4px] font-normal">
                  Only paid users are allowed.
                </p>
              </div>
              <div>
                <p className="font-semi-normal text-light-black font-sans text-[14px] leading-[21px]">
                  N {formatNumberWithCommas(tribe?.membership_fee)}
                </p>
              </div>
            </div>
          ) : (
            <></>
          )}
          <div className="bg-light_grey flex flex-col rounded-xl p-3">
            <p className="font-semi-normal text-text-grey font-sans text-[14px] leading-[21px]">
              Members
            </p>
            <div className="mt-4">
              {members?.length > 0 ? (
                tribe?.member_list.map((member: TribeMemberInterface, index: number) => (
                  <React.Fragment key={index}>
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <div>
                          {/*<Image src={member?.user?.avatar} alt="avatar" width={20} height={20} className="w-5 h-5 rounded-[6px]"/>*/}
                          <div className="flex h-5 w-5 items-center justify-center overflow-hidden rounded-[6px] bg-gray-200 text-[10px] font-semibold text-gray-700">
                            {member?.user?.avatar ? (
                              <Image
                                src={member.user.avatar}
                                alt="avatar"
                                width={20}
                                height={20}
                                className="h-5 w-5 object-cover"
                              />
                            ) : (
                              getInitials(member?.user?.fullname)
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-semi-normal text-black-light font-sans text-[14px] leading-[21px]">
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
                    <div className="my-2 border-t"></div>
                  </React.Fragment>
                ))
              ) : (
                <p className={"text-text-grey text-[14px] leading-[21px] font-normal"}>
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
