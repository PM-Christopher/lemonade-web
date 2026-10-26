"use client";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { Dialog, DialogContentBare, DialogTitle } from "@lemonade/ui";

interface ImageLightboxProps {
  src: string | null;
  onClose: () => void;
  alt?: string;
}

// Full-size view of a picture.
export const ImageLightbox = ({ src, onClose, alt = "Chat image" }: ImageLightboxProps) => (
  <Dialog open={Boolean(src)} onOpenChange={(open) => !open && onClose()}>
    <DialogContentBare className="w-fit max-w-[95vw] gap-0 border-0 bg-transparent p-0 shadow-none">
      <DialogTitle className="sr-only">Image preview</DialogTitle>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image preview"
        className="absolute -top-10 right-0 rounded-full bg-white p-2 text-black shadow-md hover:bg-gray-100"
      >
        <FiX size={18} aria-hidden="true" />
      </button>
      {src && (
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1200}
          className="h-auto max-h-[85vh] w-auto max-w-[95vw] rounded-lg object-contain"
        />
      )}
    </DialogContentBare>
  </Dialog>
);
