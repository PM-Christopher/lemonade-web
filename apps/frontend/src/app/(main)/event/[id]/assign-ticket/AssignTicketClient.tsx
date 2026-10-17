"use client";
import { appUrl } from "@/lib/app-url";
import { routes } from "@/lib/routes";
import { useNavigation } from "@/hooks/useNavigation";
import React, { useEffect, useRef, useState } from "react";
import UserIcon from "@/images/icons/users.svg";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Label,
  Input,
  FieldError,
} from "@lemonade/ui";
import MultipleTicketCard from "@/components/events/MultipleTicketCard";
import { usePathname, useSearchParams } from "next/navigation";
import Switch from "react-switch";
import { useSelector } from "react-redux";
import { TicketDetails } from "@/interfaces/EventInterface";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignEventTicketsSchema, type AssignEventTicketsInput } from "@/features/events/schema";
import { applyServerErrors } from "@/lib/form-errors";
import { SubmitButton } from "@/components/global/SubmitButton";
import { useAppDispatch } from "@/redux/hook";
import { freeEventState } from "@/features/events/event.slice";
import { useBuyTicketMutation } from "@/features/events/mutations";
import MainLayout from "@/components/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";
import { errorMessage } from "@/lib/api-error";

// Buyer and ticket-holder details form shown before checkout.
const AssignTicketClient = ({ id }: { id: number }) => {
  const COUNTDOWN_DURATION = 10 * 60;
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION);
  const [isReleasing, setIsReleasing] = useState(false);
  const isExpired = timeLeft <= 0;
  const { push, replace, back } = useNavigation();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { tickets } = useSelector((state: RootState) => state.event);
  const buyTicketMutation = useBuyTicketMutation();
  const loading = buyTicketMutation.isPending;

  const referralFromUrl = searchParams.get("referral");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<AssignEventTicketsInput>({
    resolver: zodResolver(assignEventTicketsSchema),
    defaultValues: {
      fullname: "",
      email: "",
      assign_multiple: false,
      assigned_tickets: tickets.map((ticket: TicketDetails) => ({
        id: `${ticket.id}`,
        quantity: ticket.quantity || 0,
        fullname: "",
        email: "",
      })),
    },
    mode: "onChange",
  });

  const assignMultiple = useWatch({ control, name: "assign_multiple" });

  const onSubmit = async (values: AssignEventTicketsInput) => {
    const allTickets: { id: string; quantity: number }[] = [];
    tickets.map((ticket: TicketDetails) => {
      allTickets.push({
        id: `${ticket.id}`,
        quantity: ticket.quantity,
      });
    });
    const redirect_url = appUrl(routes.EVENT);
    let formValues;
    if (values.assign_multiple) {
      formValues = {
        assigned_tickets: values.assigned_tickets,
        redirect_url,
        assign_multiple: true,
        fullname: values.fullname,
        email: values.email,
        referral: referralFromUrl ?? null,
      };
    } else {
      formValues = {
        tickets: allTickets,
        redirect_url,
        assign_multiple: false,
        fullname: values.fullname,
        email: values.email,
        referral: referralFromUrl ?? null,
      };
    }
    try {
      const result = await buyTicketMutation.mutateAsync({ eventId: id, data: formValues });
      if (result.completed) {
        dispatch(freeEventState({ completed: true }));
        push(routes.EVENT);
      } else if (result.payment_url) {
        dispatch(
          updateToastifyReducer({
            show: true,
            message: "Redirecting to payment page. Please wait...",
            type: "success",
          }),
        );
        window.location.assign(result.payment_url);
      }
    } catch (error) {
      if (applyServerErrors(error, setError, ["fullname", "email", "assigned_tickets"])) return;
      dispatch(
        updateToastifyReducer({
          show: true,
          message: errorMessage(error, "We couldn't complete your ticket purchase."),
          type: "error",
        }),
      );
    }
  };

  const key = `ticketExpiryTime_${id}`;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const savedExpiry = localStorage.getItem(key);

    const expiryTime =
      savedExpiry && !Number.isNaN(parseInt(savedExpiry, 10))
        ? parseInt(savedExpiry, 10)
        : Date.now() + COUNTDOWN_DURATION * 1000;

    localStorage.setItem(key, String(expiryTime));

    const clear = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((expiryTime - Date.now()) / 1000));
      setTimeLeft(remaining);

      // Stay on the page so the buyer sees the expiry; buying again starts a fresh hold.
      if (remaining <= 0) clear();
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => {
      clear();
    };
  }, [key, COUNTDOWN_DURATION]);

  const releaseTickets = () => {
    localStorage.removeItem(key);
    setIsReleasing(false);
    back();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const expandedTickets = tickets.flatMap((ticket: TicketDetails) =>
    Array.from({ length: ticket.quantity }, () => ({
      ...ticket,
      quantity: 1,
    })),
  );

  const eventId = String(id);

  const referralFromState = useSelector(
    (state: RootState) => state.event?.eventReferrals?.[eventId],
  );

  useEffect(() => {
    const referralInUrl = searchParams.get("referral");

    if (referralInUrl) return;

    if (!referralFromState) return;

    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("referral", referralFromState);

    replace(`${pathname}?${nextParams.toString()}`);
  }, [pathname, replace, searchParams, referralFromState]);

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => (isExpired ? releaseTickets() : setIsReleasing(true))}
          >
            <ChevronLeft />
            <p className="tracking-custom text-body-l font-sans font-semibold">Assign ticket</p>
          </button>
        </div>
        <section className="mt-4">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mt-4 flex justify-center">
              <section className="w-160 gap-6 rounded-xl bg-white p-12">
                {isExpired ? (
                  <div role="alert" className="rounded-lg bg-red-50 px-4 py-2">
                    <p className="text-body-s font-sans font-normal text-red-600">
                      Your reservation for this event ticket has expired. Grab a new ticket if you
                      wish to attend.
                    </p>
                  </div>
                ) : (
                  <div className="bg-light-green-10 rounded-lg px-4 py-2">
                    <p className="text-body-s font-sans font-normal">
                      Your tickets has been reserved for{" "}
                      <span className="font-semiBold text-light-tint-2">
                        {formatTime(timeLeft)}
                      </span>{" "}
                      mins. Complete your purchase to secure your spot.
                    </p>
                  </div>
                )}
                <div className="mt-6 grid gap-2">
                  <Label htmlFor="fullname" className="font-label">
                    Full name
                  </Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="e.g. Jano doe"
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                    {...register("fullname")}
                  />
                  <FieldError message={errors.fullname?.message} />
                </div>
                <div className="mt-4 grid gap-2">
                  <Label htmlFor="email" className="font-label">
                    Email address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="e.g. Janodoe@email.com"
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
                <div className="mt-9 flex justify-between">
                  <div className="flex gap-2">
                    <UserIcon />
                    <div>
                      <p className="font-semi-normal tracking-custom text-black-light text-body-l font-sans">
                        Assign multiple people
                      </p>
                      <p className="text-text-grey text-meta font-sans font-normal">
                        Tickets will be sent to their email address
                      </p>
                    </div>
                  </div>
                  <div>
                    <Controller
                      name="assign_multiple"
                      control={control}
                      render={({ field }) => (
                        <Switch
                          onChange={field.onChange}
                          checked={field.value}
                          aria-label="Assign multiple people"
                          checkedIcon={false}
                          uncheckedIcon={false}
                          onColor="#9BE303"
                          offColor="#E5E7EB"
                        />
                      )}
                    />
                  </div>
                </div>
                {assignMultiple &&
                  expandedTickets.map((ticket: TicketDetails, index: number) => (
                    <MultipleTicketCard
                      key={`${ticket.id}-${index}`}
                      index={index}
                      ticket={ticket}
                      control={control}
                      register={register}
                      setValue={setValue}
                      errors={errors}
                    />
                  ))}
                <div className="mt-6 flex justify-between">
                  <SubmitButton
                    title="Pay now"
                    loading={isSubmitting || loading}
                    isValid={isValid && !isExpired}
                    classes="w-full h-12 gap-2 rounded-xl border-b-2 border-step-color"
                  />
                </div>
              </section>
            </div>
          </form>
        </section>
      </section>
      <Dialog open={isReleasing} onOpenChange={setIsReleasing}>
        <DialogContent className="max-w-sm border-0">
          <DialogTitle>Release tickets</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel? The previous reservation made for you will be
            cancelled.
          </DialogDescription>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-xl text-red-600"
              onClick={releaseTickets}
            >
              Release
            </Button>
            <Button
              className="bg-gradient-green h-12 flex-1 rounded-xl"
              onClick={() => setIsReleasing(false)}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AssignTicketClient;
