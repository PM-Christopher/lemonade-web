import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { DotIcon, XIcon } from "lucide-react";
import { TribeDetail, TribeMemberItem } from "@/features/tribes/api";
import { images } from "@/lib/images";

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
            src={tribe?.image || images.DEFAULT_TRIBE}
            alt={tribe?.name ?? "Tribe"}
            width={96}
            height={96}
            className="rounded"
          />
          <p className="font-semiBold text-body-l text-center">{tribe?.name}</p>
          <p className={"text-text-grey text-body-s font-medium"}>{tribe?.category}</p>
          <div className={"flex items-center"}>
            <p className={"text-text-grey text-meta leading-normal font-normal"}>
              {tribe?.members_count ?? 0} members
            </p>
            <DotIcon className={"text-text-grey"} />
            <p className={"text-text-grey text-meta leading-normal font-normal"}>
              {tribe?.threads_count ?? 0} threads
            </p>
          </div>
          <div className={"w-77.75"}>
            <p className="text-light-black text-body-s text-center font-normal">
              {tribe?.description}
            </p>
          </div>
          <p className="text-text-grey text-meta text-center leading-normal font-normal">
            Created on {tribe?.created_at ? dayjs(tribe.created_at).format("DD MMM, YYYY") : ""}
          </p>
        </div>
      </div>

      {tribe?.monetized && (
        <div className={"flex items-center justify-between"}>
          <div className={"flex flex-col"}>
            <p className={"text-body-l font-medium"}>Monetized Tribe</p>
            <p className={"text-text-grey text-meta font-normal"}>Only paid users are allowed.</p>
          </div>
          <p className={"text-body-s font-medium"}>₦{Number(tribe.access_fee).toLocaleString()}</p>
        </div>
      )}

      <div>
        <p className="text-body-l mb-4 font-medium">Members</p>
        <div className={"bg-light-grey flex flex-col gap-2 rounded-xl px-6 py-4"}>
          {tribe?.creator && (
            <div className={"border-b-grey-20 flex justify-between border-b py-2.5"}>
              <div className={"flex items-center gap-2"}>
                <Image
                  src={tribe.creator.image || images.DEFAULT_TRIBE}
                  alt={tribe.creator.name}
                  width={20}
                  height={20}
                  className="rounded-full"
                />
                <p className={"text-body-s font-medium"}>{tribe.creator.name}</p>
              </div>
              <p className={"text-text-grey text-meta font-normal italic"}>Creator</p>
            </div>
          )}
          {members.length > 0
            ? members.map((member) => (
                <div
                  key={member.id}
                  className={
                    "border-b-grey-20 flex justify-between border-b py-2.5 last:border-b-0"
                  }
                >
                  <div className={"flex items-center gap-2"}>
                    <Image
                      src={member.user?.profile_image || images.DEFAULT_TRIBE}
                      alt={member.user?.fullname ?? "member"}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <p className={"text-body-s font-medium"}>
                      {member.user?.fullname ?? "Unknown member"}
                    </p>
                  </div>
                  {onRemoveMember && member.user_id && (
                    <button
                      type="button"
                      aria-label="Remove member"
                      className="text-text-grey hover:text-red-1 cursor-pointer"
                      onClick={() =>
                        onRemoveMember(member.user_id, member.user?.fullname ?? "this member")
                      }
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))
            : !tribe?.creator && (
                <p className="text-text-grey text-body-s font-normal">No members yet</p>
              )}
        </div>
      </div>
    </div>
  );
};

export default TribeDetails;
