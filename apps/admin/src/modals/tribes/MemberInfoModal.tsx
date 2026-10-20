"use client";
import React from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";
import type { TribeThreadAuthor } from "@/features/tribes/api";
import { SocialLink } from "@/components/global/SocialLink";
import { images } from "@/lib/images";

interface MemberInfoModalProps {
  isOpen: boolean;
  toggle: () => void;
  user: TribeThreadAuthor | null;
}

// A member's profile card, opened from a thread.
function MemberInfoModal({ isOpen, toggle, user }: MemberInfoModalProps) {
  const socials = (user?.socials ?? []).filter((link) => link.value);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">User info</DialogTitle>
        <div className="w-100 max-w-[94vw] rounded-xl bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-body-l font-semibold">User info</p>
            <button type="button" aria-label="Close" className="cursor-pointer" onClick={toggle}>
              <XIcon />
            </button>
          </div>
          <div className="mt-5 flex flex-col items-center gap-1 text-center">
            <Image
              unoptimized
              src={user?.profile_image || images.DEFAULT_TRIBE}
              alt={user?.fullname ?? "member"}
              width={64}
              height={64}
              className="h-16 w-16 rounded-2xl border object-cover"
            />
            <p className="text-body-s mt-2 font-semibold">{user?.fullname}</p>
            {user?.industry && <p className="text-text-grey text-meta italic">{user.industry}</p>}
            {user?.bio && <p className="text-body-s mt-2 font-normal">{user.bio}</p>}
            {socials.length > 0 && (
              <>
                <p className="text-body-s mt-4 font-semibold">Social links</p>
                <div className="flex gap-3">
                  {socials.map((link) => (
                    <SocialLink key={link.name} name={link.name} href={link.value} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContentBare>
    </Dialog>
  );
}

export default MemberInfoModal;
