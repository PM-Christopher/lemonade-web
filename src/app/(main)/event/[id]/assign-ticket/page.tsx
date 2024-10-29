"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import UserIcon from "@/images/icons/users.svg";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import MultipleTicketCard from "@/components/Events/MultipleTicketCard";
import {useRouter} from "next/navigation";
import Switch from "react-switch";
import {useSelector} from "react-redux";
import {TicketDetails} from "@/interfaces/EventInterface";
import * as yup from "yup";
import {useFormik} from "formik";
import {FormikButton} from "@/components/global/FormikButton";
import {useAppDispatch} from "@/redux/hook";
import {buyTicket} from "@/features/events/event.slice";
import MainLayout from "@/components/layouts/MainLayout";

const  AssignTicketPage = ({params}: {params: {id: number}}) => {
    const [checked, setChecked] = useState(false)
    const dispatch = useAppDispatch()
    const handleChange = () => {
        setChecked(!checked)
    }
    const {tickets, total} = useSelector((state: any) => state.event)
    const {authToken} = useSelector((state: any) => state.auth)

    const ticketSchema = yup.object({
        fullname: yup
            .string()
            .required("Fullname is required"),
        email: yup
            .string()
            .email("Please enter a valid email")
            .required("Email is required"),
        assign_multiple: yup
            .boolean()
            .required(),
        assigned_tickets: yup
            .array()
            .when('assign_multiple', {
                is: true,
                then: (schema) => schema.of(yup.object().shape({
                    id: yup.string().required(),
                    quantity: yup.number().required(),
                    fullname: yup.string().required(),
                    email: yup.string().email("Please enter a valid email").required(),
                })).min(1).required()
            }),
    });

    const formik = useFormik({
        initialValues: {
            fullname: "",
            email: "",
            assign_multiple: false,
            assigned_tickets: []
        },
        validationSchema: ticketSchema,
        onSubmit: async (values) => {
            const allTickets: {id: string, quantity: number}[] = []
            tickets.map((ticket: TicketDetails) => {
                allTickets.push({
                    id: `${ticket.id}`,
                    quantity: ticket.quantity
                })
            })
            const redirect_url= "https://webhook.site/5daf1136-dd39-481e-bb1f-69f9cbd6ecf5"
            const formValues = {tickets: allTickets, redirect_url, ...values}
            console.log({formValues})
            dispatch(buyTicket({event_id: params.id, data: formValues, token: authToken})).then((res: any) => {
                window.location.href = res.payload.data.payment_url
            })
        },
    })

    const router = useRouter()
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <TopNav/>
                <div
                    className="bg-white flex justify-between p-[12px] px-10 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                        <ChevronLeft className="cursor-pointer" onClick={() => router.back()}/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Assign ticket</p>
                    </div>
                </div>
                <section className="min-h-screen mt-4">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="flex justify-center mt-[16px]">
                            <section className="bg-white w-[640px] p-[48px] rounded-[12px] gap-[24px]">
                                <div className="bg-light-green-10 py-[8px] px-[16px] rounded-[8px]">
                                    <p className="font-sans font-normal text-[14px] leading-[21px]">Your tickets has
                                        been
                                        reserved for <span
                                            className="text-light-tint-2 font-semiBold">09:45</span> mins.
                                        Complete your purchase to secure your spot.</p>
                                </div>
                                <div className="grid gap-2 mt-[24px]">
                                    <Label htmlFor="fullname" className="font-label">Full name</Label>
                                    <Input
                                        id="fullname"
                                        type="text"
                                        placeholder="e.g. Jano doe"
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                        value={formik.values.fullname}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className="grid gap-2 mt-[16px]">
                                    <Label htmlFor="email" className="font-label">Email address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="e.g. Janodoe@email.com"
                                        className="h-12 rounded-xl bg-light_grey form-font border-0"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                    />
                                </div>
                                <div className="flex justify-between mt-[36px]">
                                    <div className="flex gap-2">
                                        <UserIcon/>
                                        <div>
                                            <p className="font-sans font-semi-normal text-[16px] leading-[24px] tracking-custom text-black-light">Assign
                                                multiple people</p>
                                            <p className="font-sans font-normal text-[12px] text-text-grey leading-[14.4px]">Tickets
                                                will be sent to their email address</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Switch onChange={(change) => {
                                            handleChange()
                                            formik.setFieldValue("assign_multiple", change)
                                        }} checked={checked} checkedIcon={false} uncheckedIcon={false}
                                                onColor="#9BE303"/>
                                    </div>
                                </div>
                                {
                                    checked && tickets.map((ticket: TicketDetails, index: number) => (
                                        <MultipleTicketCard ticket={ticket} key={index}/>
                                    ))
                                }
                                <div className="flex justify-between mt-[24px]">
                                    <FormikButton title="Pay now" loading={formik.isSubmitting} error={formik.isValid}
                                                  classes="w-full h-[48px] py-[14px] px-[48px] gap-[8px] rounded-[12px] border-b-2 border-step-color"/>
                                </div>
                            </section>
                        </div>
                    </form>
                </section>
            </section>
        </MainLayout>
    );
}

export default AssignTicketPage;