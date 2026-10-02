"use client";
import React, { useEffect, useRef, useState, use } from "react";
import UserIcon from "@/images/icons/users.svg";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import { Label, Input } from "@lemonade/ui";
import MultipleTicketCard from "@/components/events/MultipleTicketCard";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Switch from "react-switch";
import { useSelector } from "react-redux";
import { TicketDetails } from "@/interfaces/EventInterface";
import * as yup from "yup";
import { useFormik } from "formik";
import { FormikButton } from "@/components/global/FormikButton";
import { useAppDispatch } from "@/redux/hook";
import { freeEventState } from "@/features/events/event.slice";
import { useBuyTicketMutation } from "@/features/events/mutations";
import MainLayout from "@/components/layouts/MainLayout";
import { RootState } from "@/redux/store";
import { updateToastifyReducer } from "@/redux/toastifySlice";

const AssignTicketPage = (props: { params: Promise<{ id: number }> }) => {
  const params = use(props.params);
  const [checked, setChecked] = useState(false);
  const COUNTDOWN_DURATION = 10 * 60;
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_DURATION); // 10 minutes in seconds
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const handleChange = () => {
    setChecked(!checked);
  };
  const { tickets } = useSelector((state: RootState) => state.event);
  const buyTicketMutation = useBuyTicketMutation();
  const loading = buyTicketMutation.isPending;

  const ticketSchema = yup.object({
    fullname: yup.string().required("Fullname is required"),
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    assign_multiple: yup.boolean().required(),
    assigned_tickets: yup.array().when("assign_multiple", {
      is: true,
      then: (schema) =>
        schema
          .of(
            yup.object().shape({
              id: yup.string().required(),
              quantity: yup.number().required(),
              fullname: yup.string().required(),
              email: yup.string().email("Please enter a valid email").required(),
            }),
          )
          .min(1)
          .required(),
    }),
  });

  const referralFromUrl = searchParams.get("referral");
  const assignTicketHref = referralFromUrl
    ? `/event/${params.id}/buy-ticket?referral=${encodeURIComponent(referralFromUrl)}`
    : `/event/${params.id}/buy-ticket`;

  const formik = useFormik({
    initialValues: {
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
    validationSchema: ticketSchema,
    validateOnMount: true,
    onSubmit: async (values) => {
      const allTickets: { id: string; quantity: number }[] = [];
      tickets.map((ticket: TicketDetails) => {
        allTickets.push({
          id: `${ticket.id}`,
          quantity: ticket.quantity,
        });
      });
      const redirect_url = `${process.env.NEXT_PUBLIC_APP_URL}/event`;
      // const formValues = { tickets: allTickets, redirect_url, ...values };
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
      buyTicketMutation.mutate(
        { eventId: params.id, data: formValues },
        {
          onSuccess: (result) => {
            if (result.completed) {
              const data = {
                completed: true,
              };
              dispatch(freeEventState(data));
              router.push("/event");
            } else if (result.payment_url) {
              dispatch(
                updateToastifyReducer({
                  show: true,
                  message: "Redirecting to payment page. Please wait...",
                  type: "success",
                }),
              );
              window.location.href = result.payment_url;
            }
          },
        },
      );
    },
  });

  const key = `ticketExpiryTime_${params.id}`;

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

      if (remaining <= 0) {
        clear();
        localStorage.removeItem(key);
        router.push(assignTicketHref);
      }
    };

    updateTimer();
    intervalRef.current = setInterval(updateTimer, 1000);

    return () => {
      clear();
    };
  }, [router, params.id, key, COUNTDOWN_DURATION, assignTicketHref]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const expandedTickets = tickets.flatMap((ticket: TicketDetails) =>
    Array.from({ length: ticket.quantity }, () => ({
      ...ticket,
      quantity: 1, // optional: reset quantity to 1 since each is now a unit
    })),
  );

  const eventId = String(params.id);

  const referralFromState = useSelector(
    (state: RootState) => state.event?.eventReferrals?.[eventId],
  );

  useEffect(() => {
    const referralInUrl = searchParams.get("referral");

    // If URL already has it, do nothing
    if (referralInUrl) return;

    // If state doesn't have it, do nothing
    if (!referralFromState) return;

    // Preserve any existing query params, then set referral
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("referral", referralFromState);

    router.replace(`${pathname}?${nextParams.toString()}`);
  }, [pathname, router, searchParams, referralFromState]);

  return (
    <MainLayout>
      <section className="bg-light_grey pb-10">
        <div className="flex items-center justify-between border-t border-b bg-white p-3 px-10">
          <div
            className="flex items-center gap-2 rounded-xl p-1 pr-4 pl-1"
            onClick={() => router.back()}
          >
            <ChevronLeft className="cursor-pointer" />
            <p className="tracking-custom font-sans text-[16px] font-semibold">Assign ticket</p>
          </div>
        </div>
        <section className="mt-4">
          <form onSubmit={formik.handleSubmit}>
            <div className="mt-4 flex justify-center">
              <section className="w-[640px] gap-6 rounded-xl bg-white p-12">
                <div className="bg-light-green-10 rounded-[8px] px-4 py-2">
                  <p className="font-sans text-[14px] leading-[21px] font-normal">
                    Your tickets has been reserved for{" "}
                    <span className="font-semiBold text-light-tint-2">{formatTime(timeLeft)}</span>{" "}
                    mins. Complete your purchase to secure your spot.
                  </p>
                </div>
                <div className="mt-6 grid gap-2">
                  <Label htmlFor="fullname" className="font-label">
                    Full name
                  </Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="e.g. Jano doe"
                    className="form-font bg-light_grey h-12 rounded-xl border-0"
                    value={formik.values.fullname}
                    onChange={formik.handleChange}
                  />
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
                    value={formik.values.email}
                    onChange={formik.handleChange}
                  />
                </div>
                <div className="mt-9 flex justify-between">
                  <div className="flex gap-2">
                    <UserIcon />
                    <div>
                      <p className="font-semi-normal tracking-custom text-black-light font-sans text-[16px] leading-[24px]">
                        Assign multiple people
                      </p>
                      <p className="text-text-grey font-sans text-[12px] leading-[14.4px] font-normal">
                        Tickets will be sent to their email address
                      </p>
                    </div>
                  </div>
                  <div>
                    <Switch
                      onChange={(change) => {
                        handleChange();
                        formik.setFieldValue("assign_multiple", change);
                      }}
                      checked={checked}
                      checkedIcon={false}
                      uncheckedIcon={false}
                      onColor="#9BE303"
                    />
                  </div>
                </div>
                {checked &&
                  expandedTickets.map((ticket: TicketDetails, index: number) => (
                    <MultipleTicketCard
                      key={ticket.id}
                      index={index}
                      ticket={ticket}
                      formik={formik}
                    />
                  ))}
                <div className="mt-6 flex justify-between">
                  <FormikButton
                    title="Pay now"
                    loading={formik.isSubmitting || loading}
                    error={formik.isValid}
                    classes="w-full h-12 gap-2 rounded-xl border-b-2 border-step-color"
                  />
                </div>
              </section>
            </div>
          </form>
        </section>
      </section>
    </MainLayout>
  );
};

export default AssignTicketPage;
