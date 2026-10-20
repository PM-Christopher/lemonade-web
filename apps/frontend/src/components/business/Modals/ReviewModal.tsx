"use client";
import React, { useEffect } from "react";
import { images } from "@/lib/images";
import CloseIcon from "@/images/icons/close.svg";
import { Label, Dialog, DialogContentBare, DialogTitle, FieldError } from "@lemonade/ui";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, type ReviewInput } from "@/features/business/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { errorMessage } from "@/lib/api-error";
import { SubmitButton } from "@/components/global/SubmitButton";
import { useAppDispatch } from "@/redux/hook";
import { updateToastifyReducer } from "@/redux/toastifySlice";

type ReviewInterface = {
  isOpen: boolean;
  toggleMenu: () => void;
  // Sends the review; the modal shows the outcome and closes on success.
  submit: (values: ReviewInput) => Promise<unknown>;
};

const RATING_LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

const ReviewModal: React.FC<ReviewInterface> = ({ isOpen, toggleMenu, submit }) => {
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", description: "" },
    mode: "onChange",
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const rating = useWatch({ control, name: "rating" });

  const onSubmit = async (values: ReviewInput) => {
    try {
      await submit(values);
      dispatch(updateToastifyReducer({ show: true, message: "Review submitted", type: "success" }));
      toggleMenu();
    } catch (error) {
      if (applyServerErrors(error, setError, ["rating", "title", "description"])) return;
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(error, "We couldn't submit your review."),
          type: "error",
        }),
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) toggleMenu();
      }}
    >
      <DialogContentBare className="w-fit max-w-none gap-0 border-0 bg-transparent p-0 shadow-none">
        <DialogTitle className="sr-only">Write a review</DialogTitle>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="laptop:h-auto laptop:w-160 laptop:rounded-lg laptop:p-6 flex h-screen w-screen flex-col bg-white p-5 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Close" onClick={toggleMenu}>
                <CloseIcon />
              </button>
              <p className="tracking-custom text-body-xl font-sans font-semibold">Write a review</p>
            </div>
            <div className="laptop:block hidden">
              <SubmitButton
                title="Submit review"
                isValid={isValid}
                loading={isSubmitting}
                classes="h-10 rounded-xl px-3.5"
              />
            </div>
          </div>
          <div className="mt-10 flex flex-1 flex-col">
            <div className="grid gap-2">
              <Label className="text-text-grey text-label font-sans font-normal">
                Business rating
              </Label>
              <div className="flex gap-2" role="radiogroup" aria-label="Business rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} out of 5`}
                    onClick={() => setValue("rating", value, { shouldValidate: true })}
                    className="cursor-pointer"
                  >
                    <Image
                      src={value <= rating ? images.MEDAL : images.RATING_GREY}
                      alt=""
                      width={29}
                      height={29}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-text-grey text-meta leading-normal">
                  {RATING_LABELS[rating - 1]}
                </p>
              )}
              <FieldError message={errors.rating?.message} />
            </div>
            <div className="mt-6 grid gap-2">
              <Label htmlFor="review-title" className="text-text-grey text-label font-sans">
                Title
              </Label>
              <input
                id="review-title"
                type="text"
                maxLength={100}
                className="form-font bg-light_grey text-body-s h-12 rounded-xl border-0 px-4"
                {...register("title")}
              />
              <FieldError message={errors.title?.message} />
            </div>
            <div className="mt-6 grid gap-2">
              <div className="flex justify-between">
                <Label htmlFor="review-description" className="text-text-grey text-label font-sans">
                  Description
                </Label>
                <p className="text-text-grey text-meta leading-normal font-normal">
                  100 characters
                </p>
              </div>
              <textarea
                id="review-description"
                placeholder="What was your experience like..."
                maxLength={100}
                className="bg-light_grey text-body-s h-22.75 resize-none rounded-xl border-0 p-3 font-normal"
                {...register("description")}
              />
              <FieldError message={errors.description?.message} />
            </div>
            <div className="laptop:hidden mt-auto pt-6">
              <SubmitButton
                title="Submit review"
                isValid={isValid}
                loading={isSubmitting}
                classes="w-full rounded-xl h-12 px-12 py-4"
              />
            </div>
          </div>
        </form>
      </DialogContentBare>
    </Dialog>
  );
};

export default ReviewModal;
