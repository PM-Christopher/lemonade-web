'use client'
import Link from "next/link"
import React, {useEffect, useState} from "react"
import { useRouter } from "next/navigation"
import TopNav from "@/components/Navigation/TopNav";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import SearchIcon from "@/images/icons/search.svg"
import {Input} from "@/components/ui/input";
import TribeCardList from "@/components/Tribe/TribeCardList";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import DollarBillIcon from "@/images/icons/dollar-bill.svg"
import PadlockIcon from "@/images/icons/padlock.svg"
import CloseIcon from "@/images/icons/close.svg";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {TribeInterface} from "@/interfaces/TribeInterface";
import {Spinner} from "evergreen-ui";
import MainLayout from "@/components/layouts/MainLayout";


export default function TribePage() {
    const router  = useRouter()
    const {authToken} = useSelector((state: any) => state.auth)
    const [tribeType, setTribeType] = useState("tln")

    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    }

    const { data, loading } = useRequest(`/tribes?type=${tribeType}`, "GET", {}, true, getHeader())

    const [modalFlag, setModalFlag] = useState(false)

    const activateModal = () => {
        setModalFlag(!modalFlag)
    }

    const changeTribeType = (type: string) => {
        setTribeType(type)
    }

    console.log({data, loading})

    return (
        <MainLayout>
            <div className="bg-light_grey pb-10">
                <TopNav/>
                <div className="bg-white flex justify-between p-2 px-10 border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-10">
                        <div className="flex flex-col justify-center items-center cursor-pointer">
                            <p className={`"font-sans font-semi-normal ${tribeType === "tln" ? "text-black-light" : "text-text-grey"} text-[14px] leading-[21px]"`}
                               onClick={() => changeTribeType("tln")}>TLN
                                Tribes</p>
                            {
                                tribeType === "tln" && (
                                    <div className="border h-[0.5px] border-step-color w-20"></div>
                                )
                            }
                        </div>
                        <div className="flex flex-col justify-center items-center cursor-pointer">
                            <p className={`"font-sans font-semi-normal ${tribeType === "discover" ? "text-black-light" : "text-text-grey"} text-[14px] leading-[21px]"`}
                               onClick={() => changeTribeType("discover")}>Discover</p>
                            {
                                tribeType === "discover" && (
                                    <div className="border h-[0.5px] border-step-color w-20"></div>
                                )
                            }
                        </div>
                        <div className="flex flex-col justify-center items-center cursor-pointer">
                            <p className={`"font-sans font-semi-normal ${tribeType === "mine" ? "text-black-light" : "text-text-grey"} text-[14px] leading-[21px]"`}
                               onClick={() => changeTribeType("mine")}>My
                                Tribes</p>
                            {
                                tribeType === "mine" && (
                                    <div className="border h-[0.5px] border-step-color w-20"></div>
                                )
                            }
                        </div>
                    </div>
                    <div>
                        <Button
                            className="auth-button py-[20px] rounded-[12px] border-step-color shadow-custom-bottom"
                            onClick={activateModal}
                        >
                            <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">+ Create Tribe</p>
                        </Button>
                    </div>
                </div>
                <div className="min-h-screen">
                    <div className="flex justify-around">
                        <section id="tribes" className="p-10 py-4 w-[704px] h-[1000px] shadow-div-shadow-2">

                            {
                                loading ? (
                                    <div className="flex justify-center items-center">
                                        <Spinner/>
                                    </div>
                                ) : data?.tribes.length > 0 ? (
                                    data?.tribes.map((tribe: TribeInterface, index: number) => (
                                        <Link href={`/tribe/${tribe.id}`}>
                                            <TribeCardList tribe={tribe} key={index}/>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="flex justify-center items-center">
                                        <p className="font-semibold text-[24px] text-text-grey">No tribes found</p>
                                    </div>
                                )
                            }
                        </section>
                        <section id="search-tribes" className="p-10 py-4 w-[480px] h-[325px] bg-white rounded-[12px]">
                            <div className="bg-white">
                                <div className="flex items-center gap-3 bg-light_grey p-2 rounded-[12px]">
                                    <div>
                                        <SearchIcon/>
                                    </div>
                                    <div>
                                        <input
                                            id="search"
                                            type="text"
                                            className="rounded-xl text-[14px] bg-light_grey border-0 w-[300px] focus:outline-none focus:ring-0 focus:border-transparent"
                                            placeholder="Search tribe"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div
                    className={`fixed inset-0 bg-gray-800 bg-opacity-50 items-center justify-center z-50 ${!modalFlag ? "hidden" : "flex"}`}>
                    <div className="bg-white rounded-lg shadow-lg w-[640px] p-6">
                        <div className="flex justify-between items-center">
                            <div onClick={activateModal} className="cursor-pointer">
                                <CloseIcon/>
                            </div>
                            <div>
                                <Button className="auth-button px-[14px] p-[10px] rounded-[12px] border-step-color">
                                    <p className="font-sans font-semi-normal text-[12px]">Create Tribe</p>
                                </Button>
                            </div>
                        </div>
                        <div className="flex justify-center mt-[24px]">
                            <Image src={"/images/upload.png"} alt="upload" width={89} height={83}/>
                        </div>
                        <div>
                            <div className="grid gap-2">
                                <Label htmlFor="tribe-name"
                                       className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey">Tribe
                                    name</Label>
                                <Input
                                    id="tribe-name"
                                    type="text"
                                    className="h-[48px] rounded-xl bg-light_grey form-font border-0"
                                />
                            </div>
                            <div className="grid gap-2 mt-4">
                                <Label htmlFor="tribe-name"
                                       className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey">Category</Label>
                                <Select>
                                    <SelectTrigger className="bg-light_grey rounded-xl border-0 h-[48px]">
                                        <SelectValue placeholder="Select category"/>
                                    </SelectTrigger>
                                    <SelectContent className="form-font">
                                        <SelectItem value="light">Light</SelectItem>
                                        <SelectItem value="dark">Dark</SelectItem>
                                        <SelectItem value="system">System</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2 mt-4">
                                <Label htmlFor="description"
                                       className="text-[14px] font-sans font-normal leading-[16.8px] text-text-grey">Description</Label>
                                <Textarea
                                    id="description"
                                    className="rounded-xl bg-light_grey form-font border-0 h-[91px] resize-none"
                                    placeholder="A short bio about yourself..."
                                />
                            </div>
                        </div>
                        <div className="flex flex-col mt-8">
                            <div className="flex justify-between mb-10">
                                <div className="flex gap-2">
                                    <div>
                                        <DollarBillIcon/>
                                    </div>
                                    <div>
                                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-black-light">Monetize
                                            tribe</p>
                                        <p className="font-sans font-normal text-text-grey text-[12px] leading-[14.4px]">User
                                            will pay to be part of your tribe</p>
                                    </div>
                                </div>
                                <div>
                                    <p>Checkbox</p>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className="flex gap-2">
                                    <div>
                                        <PadlockIcon/>
                                    </div>
                                    <div>
                                        <p className="font-sans font-semi-normal text-[16px] leading-[24px] text-black-light">Private
                                            tribe</p>
                                        <p className="font-sans font-normal text-text-grey text-[12px] leading-[14.4px]">Tribe
                                            will only be available to invited members</p>
                                    </div>
                                </div>
                                <div>
                                    <p>Checkbox</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}