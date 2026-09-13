"use client";
import React, {useState} from "react";
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {PlusIcon} from "lucide-react";
import BankAccountModal from "@/components/events/Modals/BankAccountModal";
import CloseIcon from "@/images/icons/close.svg";
import * as yup from "yup";
import {useFormik, FieldArray} from "formik";
import {addEvent, createEvent, createTickets, resetEventState} from "@/features/events/event.slice";
import {FormikButton} from "@/components/global/FormikButton";
import {useAppDispatch} from "@/redux/hook";
import MainLayout from "@/components/layouts/MainLayout";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import {RootState} from "@/redux/store";
import {getIn} from "yup";

type Ticket = {
    ticket_type: string;  // was: "free" | "paid"
    name: string;
    price: string|number;
    transfer_commission: boolean;
    stock_type: string;   // was: "unlimited" | "limited"
    ticket_stock: number | string;
    purchase_limit: number;
    description: string;
};

const AddTicketPage = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [toggleModal, setToggleModal] = useState(false);
    const activateModal = () => {
        setToggleModal(!toggleModal);
    };
    const {event} = useSelector((state: RootState) => state.event);

    const ticketSchema = yup.object().shape({
        ticket_type: yup.string().required("Ticket type is required"),

        name: yup.string().required("Ticket name is required"),

        price: yup
            .string()
            .when(
                "ticket_type",
                (values: any[], schema: yup.StringSchema<string | undefined>) => {
                    // Yup's typings say `values` is any[], so we read from index 0
                    const ticket_type = Array.isArray(values) ? values[0] : values;

                    // Only validate price when ticket is paid
                    if (ticket_type === "paid") {
                        return schema
                            .required("Ticket price is required")
                            .test(
                                "valid-price",
                                "Ticket price must be greater than 0",
                                (value) => {
                                    if (!value) return false; // required already, but keeps TS happy
                                    const cleaned = value.replace(/,/g, "");
                                    const num = Number(cleaned);
                                    return !Number.isNaN(num) && num > 0;
                                }
                            );
                    }

                    // For "free" or unset ticket_type → no validation
                    return schema.notRequired();
                }
            ),

        transfer_commission: yup.boolean().optional(),

        stock_type: yup.string().required("Stock type is required"),

        ticket_stock: yup
            .number()
            .transform((value, originalValue) => {
                if (originalValue === "" || originalValue === null || originalValue === undefined) {
                    return undefined;
                }
                const cleaned = String(originalValue).replace(/,/g, "");
                const num = Number(cleaned);
                return Number.isNaN(num) ? undefined : num;
            })
            .when("stock_type", (stock_type: any, schema: yup.NumberSchema<number | undefined>) => {
                if (stock_type === "limited") {
                    // REQUIRED and must be > 0
                    return schema
                        .required("Ticket stock is required")
                        .moreThan(0, "Ticket stock must be greater than 0");
                }
                // Unlimited → not required
                return schema.notRequired();
            }),

        purchase_limit: yup
            .number()
            .transform((value, originalValue) => {
                if (originalValue === "" || originalValue === null || originalValue === undefined) {
                    return undefined;
                }
                const cleaned = String(originalValue).replace(/,/g, "");
                const num = Number(cleaned);
                return Number.isNaN(num) ? undefined : num;
            })
            .nullable()
            .notRequired()
            .test(
                "min-1",
                "Purchase limit must be greater than 0",
                (value) => value == null || value > 0
            ),

        description: yup.string().required("Ticket description is required"),
    });

    const addTicketSchema = yup.object().shape({
        tickets: yup
            .array()
            .of(ticketSchema)
            .min(1, "At least one ticket is required")
            .required("Tickets is required"),
    });

    const formik = useFormik({
        initialValues: {
            tickets: [
                {
                    ticket_type: "",
                    name: "",
                    price: "",
                    transfer_commission: false,
                    stock_type: "",
                    ticket_stock: 0,
                    purchase_limit: 0,
                    description: "",
                },
            ],
        },
        validationSchema: addTicketSchema,
        onSubmit: async (values) => {
            const normalizedTickets = values.tickets.map((ticket) => ({
                ...ticket,
                price:
                    ticket.ticket_type === "paid"
                        ? Number(ticket.price || 0)
                        : 0,
            }));

            const ticketTypes = hasPaidTicket(normalizedTickets)

            if (ticketTypes) {
                const data = {
                    event,
                    tickets: normalizedTickets,
                };

                const { payload } = await dispatch(createEvent({data}))

                if (payload.status) {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Event created successfully",
                            type: "success",
                        })
                    );
                    dispatch(resetEventState());
                    router.push("/event");
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Error creating event",
                            type: "error",
                        })
                    );
                }

            } else {
                const data = {
                    tickets: normalizedTickets,
                }
                dispatch(createTickets(data));
                setToggleModal(!toggleModal);
            }
        },
    });

    const getTicketFieldError = (index: number, field: keyof Ticket) => {
        const ticketsErrors = formik.errors.tickets;
        const ticketsTouched = formik.touched.tickets;

        if (!Array.isArray(ticketsErrors)) return null;

        const fieldError = (ticketsErrors[index] as any)?.[field];
        const fieldTouched = Array.isArray(ticketsTouched)
            ? (ticketsTouched[index] as any)?.[field]
            : false;

        // Show error if:
        // - field was touched OR form was submitted at least once
        if ((fieldTouched || formik.submitCount > 0) && fieldError) {
            return (
                <p className="text-red-600 text-sm mt-1">
                    {String(fieldError)}
                </p>
            );
        }

        return null;
    };

    const addTicket = () => {
        formik.setValues({
            tickets: [
                ...formik.values.tickets,
                {
                    ticket_type: "",
                    name: "",
                    price: "",
                    transfer_commission: false,
                    stock_type: "",
                    ticket_stock: 0,
                    purchase_limit: 0,
                    description: "",
                },
            ],
        });
    };

    const removeTicket = (index: number) => {
        const updatedTickets = formik.values.tickets.filter((_, i) => i !== index);
        formik.setValues({tickets: updatedTickets});
    };

    const saveAsDraft = () => {
        const data = {
            event: {...event, status: "draft"},
            tickets: formik.values.tickets
        };
        dispatch(createEvent({data})).then((res) => {
            if (res.payload.status) {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Event saved as draft",
                        type: "success",
                    })
                );
                dispatch(resetEventState());
                router.push("/event");
            } else {
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: "Error creating event",
                        type: "error",
                    })
                );
            }
        });
    }

    function hasPaidTicket(tickets: Ticket[]): boolean {
        return tickets.some(ticket => ticket.ticket_type === "paid");
    }

    return (
        <MainLayout>
            <section className="bg-white laptop:bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                    <div
                        className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">
                            Add ticket
                        </p>
                    </div>
                </div>
                <section className="mt-0 laptop:mt-4 flex flex-col items-center">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="bg-white mt-10 w-full laptop:w-[640px] p-[48px] rounded-[12px] flex flex-col">
                            {formik.values.tickets.map((ticket, index) => (
                                <div className="mb-[24px]" key={index}>
                                    {index > 0 && (
                                        <div
                                            className="mb-[16px] flex justify-between items-center bg-grey-20 rounded-[8px] px-[16px] p-[8px]">
                                            <p className="font-normal text-[14px]">
                                                Ticket {index + 1}
                                            </p>
                                            <CloseIcon
                                                className="w-[10px] h-[10px] cursor-pointer"
                                                onClick={() => removeTicket(index)}
                                            />
                                        </div>
                                    )}
                                    <p className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey">
                                        Ticket type
                                    </p>
                                    <div className="flex gap-2 mt-[16px]">
                                        <div
                                            className={`flex gap-2 cursor-pointer rounded-[12px] p-[12px] px-[24px] items-center ${
                                                ticket.ticket_type === "free"
                                                    ? "bg-gradient-green-2 shadow-event-custom"
                                                    : "bg-light_grey text-text-grey"
                                            }`}
                                            onClick={() =>
                                                formik.setFieldValue(
                                                    `tickets[${index}].ticket_type`,
                                                    "free"
                                                )
                                            }
                                        >
                                            <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom">
                                                Free
                                            </p>
                                        </div>
                                        <div
                                            className={`flex gap-2 cursor-pointer rounded-[12px] p-[12px] px-[24px] items-center ${
                                                ticket.ticket_type === "paid"
                                                    ? "bg-gradient-green-2 shadow-event-custom"
                                                    : "bg-light_grey text-text-grey"
                                            }`}
                                            onClick={() =>
                                                formik.setFieldValue(
                                                    `tickets[${index}].ticket_type`,
                                                    "paid"
                                                )
                                            }
                                        >
                                            <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom">
                                                Paid
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid gap-2 mt-[24px]">
                                        <Label
                                            htmlFor={`ticket-name-${index}`}
                                            className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                                        >
                                            Ticket name
                                        </Label>
                                        <Input
                                            id={`ticket-name-${index}`}
                                            type="text"
                                            placeholder=""
                                            className="h-12 rounded-xl bg-light_grey form-font border-0"
                                            value={formik.values.tickets[index].name}
                                            onChange={formik.handleChange}
                                            name={`tickets[${index}].name`}
                                        />
                                        {getTicketFieldError(index, "name")}
                                    </div>

                                    {ticket.ticket_type === "paid" && (
                                        <>
                                            <div className="grid gap-2 mt-[24px]">
                                                <Label
                                                    htmlFor={`ticket-price-${index}`}
                                                    className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                                                >
                                                    Ticket price
                                                </Label>
                                                <Input
                                                    id={`ticket-price-${index}`}
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder=""
                                                    className="h-12 rounded-xl bg-light_grey form-font border-0"
                                                    value={formik.values.tickets[index].price || ""}
                                                    onChange={(e) => {
                                                        const numericValue = e.target.value.replace(/[^0-9.]/g, "");
                                                        formik.setFieldValue(`tickets[${index}].price`, numericValue);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (["e", "E", "+", "-"].includes(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onBlur={formik.handleBlur}               // 👈 important
                                                    name={`tickets[${index}].price`}
                                                />
                                            </div>
                                            {getTicketFieldError(index, "price")}
                                            <div className="flex items-center gap-2 mt-[24px]">
                                                <input
                                                    type="checkbox"
                                                    className="border-[1px] border-text-grey w-[20px]"
                                                    checked={
                                                        formik.values.tickets[index].transfer_commission
                                                    }
                                                    onChange={formik.handleChange}
                                                    name={`tickets[${index}].transfer_commission`}
                                                />
                                                <p className="font-sans font-normal text-[14px] leading-[21px] tracking-custom text-text-grey">
                                                    Transfer commission to guest
                                                </p>
                                            </div>
                                            {getTicketFieldError(index, "transfer_commission")}
                                        </>
                                    )}

                                    <div className="grid gap-2 mt-[24px] w-full">
                                        <Label
                                            htmlFor={`ticket-stock-${index}`}
                                            className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                                        >
                                            Ticket stock
                                        </Label>
                                        <div className="flex justify-between gap-3 w-full">
                                            <select
                                                value={formik.values.tickets[index].stock_type}
                                                onChange={formik.handleChange}
                                                className="h-12 rounded-xl bg-light_grey form-font border-0 p-2 w-full"
                                                name={`tickets[${index}].stock_type`}
                                            >
                                                <option value="">Select stock</option>
                                                <option value="limited">Limited stock</option>
                                                <option value="unlimited">Unlimited stock</option>
                                            </select>
                                            {
                                                formik.values.tickets[index].stock_type !== "unlimited" && (
                                                    <Input
                                                        type="text"
                                                        placeholder=""
                                                        className="h-12 rounded-xl bg-light_grey form-font border-0 w-full"
                                                        value={formik.values.tickets[index].ticket_stock}
                                                        onChange={formik.handleChange}
                                                        name={`tickets[${index}].ticket_stock`}
                                                        readOnly={
                                                            formik.values.tickets[index].stock_type ===
                                                            "unlimited"
                                                        }
                                                    />
                                                )
                                            }
                                        </div>
                                        {getTicketFieldError(index, "stock_type")}
                                        {getTicketFieldError(index, "ticket_stock")}
                                    </div>

                                    <div className="grid gap-2 mt-[24px]">
                                        <Label
                                            htmlFor={`ticket-limit-${index}`}
                                            className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                                        >
                                            Purchase limit
                                        </Label>
                                        <Input
                                            id={`ticket-limit-${index}`}
                                            name={`tickets[${index}].purchase_limit`}
                                            type="number"
                                            placeholder=""
                                            className="h-12 rounded-xl bg-light_grey form-font border-0 w-full"
                                            value={formik.values.tickets[index].purchase_limit}
                                            onChange={formik.handleChange}
                                            min={0}
                                        />
                                        {getTicketFieldError(index, "purchase_limit")}
                                    </div>

                                    <div className="grid gap-2 mt-[24px]">
                                        <Label
                                            htmlFor={`ticket-description-${index}`}
                                            className="font-sans font-normal text-[14px] leading-[16.8px] text-text-grey"
                                        >
                                            Ticket description
                                        </Label>
                                        <textarea
                                            value={formik.values.tickets[index].description}
                                            onChange={formik.handleChange}
                                            className="h-[131px] rounded-xl bg-light_grey form-font border-0 resize-none p-4"
                                            name={`tickets[${index}].description`}
                                        />
                                        {getTicketFieldError(index, "description")}
                                    </div>
                                </div>
                            ))}

                            <Button
                                className="rounded-[12px] h-[48px] p-[14px] px-[48px] bg-light-green-10 mt-[24px] border-0 shadow-none"
                                onClick={addTicket}
                                type="button"
                            >
                                <div className="flex gap-1 items-center">
                                    <PlusIcon className="text-light-green"/>
                                    <p className="font-sans font-semi-normal text-[16px] leading-[19.2px] text-light-green">
                                        Add another ticket
                                    </p>
                                </div>
                            </Button>

                            <div className="flex justify-between gap-3">
                                <Button
                                    className="rounded-[12px] h-[48px] p-[14px] px-[48px] bg-light-grey-50 mt-[24px] border-[1px] border-light-grey-50 shadow-none w-full"
                                    type="button"
                                    onClick={saveAsDraft}
                                >
                                    <div className="flex gap-1 items-center">
                                        <p className="font-sans font-semi-normal text-[16px] leading-[19.2px] text-text-grey">
                                            Save as draft
                                        </p>
                                    </div>
                                </Button>
                                <FormikButton
                                    title="Publish"
                                    loading={formik.isSubmitting}
                                    error={formik.isValid}
                                    classes="rounded-[12px] h-[48px] p-[14px] px-[48px] mt-[24px] border-0 shadow-none w-full"
                                />
                            </div>
                        </div>
                    </form>
                    <BankAccountModal toggle={activateModal} option={toggleModal}/>
                </section>
            </section>
        </MainLayout>
    );
};

export default AddTicketPage;
