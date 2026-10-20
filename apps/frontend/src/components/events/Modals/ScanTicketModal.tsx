import React, { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Dialog, DialogContentBare, DialogDescription, DialogTitle } from "@lemonade/ui";

type ScanTicketModalProps = {
  isOpen: boolean;
  toggle: () => void;
  onScan: (code: string) => void;
};

// Opens the camera and reports the first QR code it reads.
const ScanTicketModal: React.FC<ScanTicketModalProps> = ({ isOpen, toggle, onScan }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraError, setCameraError] = useState("");
  const isSupported = typeof navigator !== "undefined" && Boolean(navigator.mediaDevices);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!isOpen) return;

    let stream: MediaStream | null = null;
    let frame = 0;
    let stopped = false;
    const canvas = document.createElement("canvas");

    const read = () => {
      const video = videoRef.current;
      if (stopped || !video) return;
      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = context?.getImageData(0, 0, canvas.width, canvas.height);
        const result = image ? jsQR(image.data, image.width, image.height) : null;
        if (result?.data) {
          stopped = true;
          onScanRef.current(result.data);
          return;
        }
      }
      frame = requestAnimationFrame(read);
    };

    if (!navigator.mediaDevices) return;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((media) => {
        if (stopped) {
          media.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = media;
        const video = videoRef.current;
        if (video) {
          video.srcObject = media;
          void video.play();
        }
        frame = requestAnimationFrame(read);
      })
      .catch(() =>
        setCameraError("We couldn't open the camera. Allow camera access and try again."),
      );

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggle();
      }}
    >
      <DialogContentBare className="w-full max-w-sm gap-4 rounded-2xl border-0 bg-white p-5">
        <DialogTitle className="text-body-l font-semibold">Scan ticket</DialogTitle>
        <DialogDescription className="text-text-grey text-body-s">
          Point the camera at the QR code on the guest&apos;s ticket.
        </DialogDescription>
        {!isSupported || cameraError ? (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {cameraError || "Camera scanning isn't supported on this device."}
          </p>
        ) : (
          <video
            ref={videoRef}
            muted
            playsInline
            className="aspect-square w-full rounded-xl bg-black object-cover"
          />
        )}
      </DialogContentBare>
    </Dialog>
  );
};

export default ScanTicketModal;
