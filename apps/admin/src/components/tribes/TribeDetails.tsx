import React from "react";
import Image from "next/image";
import { DotIcon, XIcon } from "lucide-react";
import { TribeDetail, TribeMemberItem } from "@/features/tribes/api";

interface TribeDetailsProps {
  // Optional — components/users/TribeModal.tsx (an unrelated, still-fixture
  // consumer outside this migration's scope) renders this with no props at
  // all. Keeping these optional avoids breaking that file while this
  // component gets real data from the tribes admin detail page.
  tribe?: TribeDetail;
  members?: TribeMemberItem[];
  onRemoveMember?: (userId: string, memberName: string) => void;
}

const TribeDetails = ({ tribe, members = [], onRemoveMember }: TribeDetailsProps) => {
  return (
    <div className="flex h-fit w-full flex-col gap-6">
      <div className="w-full rounded-lg bg-white p-4">
        <div className="mb-4 flex flex-col items-center gap-2">
          <Image
            src={tribe?.image || "/images/tribe_1.png"}
            alt={tribe?.name ?? "Tribe"}
            width={96}
            height={96}
            className="rounded"
          />
          <p className="text-center text-[16px] font-semiBold">{tribe?.name}</p>
          <p className={"text-[14px] font-medium text-text-grey"}>{tribe?.category}</p>
          <div className={"flex items-center"}>
            <p className={"text-[12px] font-normal text-text-grey"}>
              {tribe?.members_count ?? 0} members
            </p>
            <DotIcon className={"text-text-grey"} />
            <p className={"text-[12px] font-normal text-text-grey"}>
              {tribe?.threads_count ?? 0} threads
            </p>
          </div>
          <div className={"w-[311px]"}>
            <p className="text-center text-[14px] font-normal text-light-black">
              {tribe?.description}
            </p>
          </div>
          <p className="text-center text-[12px] font-normal text-text-grey">
            Created on {tribe?.created_at}
          </p>
        </div>
      </div>

      <div>
        <p className="mb-4 text-[16px] font-medium">Members</p>
        <div className={"flex flex-col gap-[8px] rounded-[12px] bg-light-grey px-[24px] py-[16px]"}>
          {members.length > 0 ? (
            members.map((member) => (
              <div
                key={member.id}
                className={"flex justify-between border-b-[1px] border-b-grey-20 py-[10px] last:border-b-0"}
              >
                <div className={"flex items-center gap-2"}>
                  <Image
                    src={member.user?.profile_image || "/images/tribe_1.png"}
                    alt={member.user?.fullname ?? "member"}
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  <p className={"text-[14px] font-medium"}>
                    {member.user?.fullname ?? "Unknown member"}
                  </p>
                </div>
                {onRemoveMember && member.user_id && (
                  <button
                    type="button"
                    aria-label="Remove member"
                    className="cursor-pointer text-text-grey hover:text-red-1"
                    onClick={() =>
                      onRemoveMember(member.user_id, member.user?.fullname ?? "this member")
                    }
                  >
                    <XIcon className="h-[16px] w-[16px]" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-[14px] font-normal text-text-grey">No members yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TribeDetails;
