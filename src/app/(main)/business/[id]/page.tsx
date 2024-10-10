"use client"
import React, {useState} from 'react';
import TopNav from "@/components/Navigation/TopNav";
import ChevronLeft from "@/image/icons/chevron-left.svg";
import business_logo from "@/image/business/JobLogo.png";
import Image from "next/image";
import medal from "@/image/icons/medal.png";
import {Button} from "@/components/ui/button";
import PhoneIcon from "@/image/icons/PhoneIcon.svg";
import MessageIcon from "@/image/icons/MessageIcon.svg";
import WebIcon from "@/image/icons/WebIcon.svg";
import portfolio_image_1 from "@/image/business/portfolio_image_1.png"
import portfolio_image_2 from "@/image/business/portfolio_image_2.png"
import portfolio_image_3 from "@/image/business/portfolio_image_3.png"
import portfolio_image_4 from "@/image/business/portfolio_image_4.png"
import RatingsBar from "@/components/global/RatingsBar";
import Reviews from "@/components/global/Reviews";
import ReviewModal from "@/components/Business/Modals/ReviewModal";
import RequestServiceModal from "@/components/Business/Modals/RequestServiceModal";


function BusinessDetailsPage() {
    const [isOpen, setIsOpen] = useState(false)
    const [isRequestOpen, setIsRequestOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const toggleRequestModal = () => {
        setIsRequestOpen(!isRequestOpen)
    }

    return (
        <section className="bg-light_grey pb-10">
            <TopNav/>
            <div
                className="bg-white flex justify-between p-[12px] px-10 border-b-grey-20 border-t-grey-20 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px]">
                    <ChevronLeft/>
                    <p className="font-sans font-semibold text-[16px] tracking-custom">Business details</p>
                </div>
            </div>
            <section className="min-h-screen mt-4 flex flex-col items-center gap-4">
                <div className="w-[640px] bg-white rounded-[12px] p-[16px] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/images/business-bg.png')` }}>
                    <div className="flex flex-col">
                        <div className="flex justify-center">
                            <Image src={business_logo} alt="logo" className="rounded-[16px] border-[1px] border-step-color flex justify-center"/>
                        </div>
                        <div className="flex justify-center flex-col mt-[8px]">
                            <p className="text-center font-semibold text-[16px]">Global technology</p>
                            <p className="text-center font-semi-normal text-[14px] text-text-grey">Lagos, Nigeria</p>
                            <p className="text-center mt-[4px] text-[16px] font-semibold">N2,000/hr</p>
                        </div>
                        <div className="flex justify-center mt-[8px]">
                            <div className="flex items-center gap-1 bg-mid-grey p-2 rounded-xl justify-center w-fit">
                                <div>
                                    <Image src={medal} alt="medal" width={16}/>
                                </div>
                                <div>
                                    <p className="font-sans font-semi-normal text-[14px] leading-[21px] text-primary-black">4.5</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center mt-[16px]">
                            <Button className="bg-gradient-green w-fit p-[14px] px-[24px] shadow-custom-bottom">
                                <p className="font-normal text-white"  onClick={toggleRequestModal}>Request service</p>
                            </Button>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center mt-[24px] gap-8">
                    <div className="flex flex-col items-center gap-[8px]">
                        <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                            <PhoneIcon />
                        </div>
                        <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Call</p>
                    </div>
                    <div className="flex flex-col items-center gap-[8px]">
                        <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                            <MessageIcon />
                        </div>
                        <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Send email</p>
                    </div>
                    <div className="flex flex-col items-center gap-[8px]">
                        <div className="p-[16px] border-[1px] border-grey-20 rounded-[16px] bg-white">
                            <WebIcon />
                        </div>
                        <div>
                            <p className="font-sans font-semi-normal text-[12px] text-text-grey leading-[14.4px]">Visit Website</p>
                        </div>
                    </div>
                </div>

                <div className="w-[640px] rounded-tl-[24px] rounded-tr-[24px] bg-purple-tint-1">
                    <div className="pt-[16px] pr-[16px] pl-[16px]">
                        <p className="font-semi-normal text-[14px]">Lemonade protects in-app transactions only. Use
                            caution outside the app</p>
                    </div>
                    <div className="rounded-tl-[24px] rounded-tr-[24px] bg-white">
                        <div className="pt-[16px] pr-[16px] pb-[24px] pl-[16px]">
                            <p className="font-semibold text-[16px]">About business</p>
                            <p className="font-normal text-[14px] mt-[12px] text-light-black">We don't just design
                                products, we build brands. We're a creative agency that takes your vision from initial
                                concept to market success.
                                By working with us, you benefit from a seamless experience where every step
                                reinforc...</p>
                            <p className="text-light-green font-semi-normal text-[14px]">More</p>
                            <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                            <p className="font-semibold text-[16px]">Business categories</p>
                            <p className="font-normal text-[14px] mt-[12px] text-light-black">Software development,
                                Digital design</p>
                            <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                            <p className="font-semibold text-[16px]">Services</p>
                            <p className="font-normal text-[14px] mt-[12px] text-light-black">
                                UI designs, Mock ups designs, Graphic designs
                            </p>
                            <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                            <p className="font-semibold text-[16px]">Portfolio Gallery</p>
                            <div className="grid grid-cols-3">
                                <Image src={portfolio_image_1} alt="image_1"/>
                                <Image src={portfolio_image_2} alt="image_1"/>
                                <Image src={portfolio_image_3} alt="image_1"/>
                                <Image src={portfolio_image_4} alt="image_1"/>
                            </div>
                            <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                            <p className="font-semibold text-[16px]">Reviews</p>
                            <div className="flex justify-between">
                                <div className="flex flex-col p-[12px] px-[20px] rounded-[12px] bg-light_grey">
                                    <div className="flex justify-center">
                                        <Image src={medal} alt="medal" width={20.57}/>
                                    </div>
                                    <div>
                                        <p className="text-center text-[20px] font-bold">
                                            4.5/<span className="font-semi-normal">5</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-normal text-[12px] text-text-grey">376 ratings</p>
                                    </div>
                                </div>
                                <RatingsBar/>
                            </div>
                            <div className="border-t-[1px] border-t-mid-grey my-[24px]"></div>
                            <Reviews />
                            <Reviews />
                            <Reviews />
                            <div className="mt-[38px]">
                                <p className="text-center font-semi-normal text-[16px] text-light-green">Load more reviews</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <ReviewModal isOpen={isOpen} toggleMenu={toggleMenu} />
            <RequestServiceModal isOpen={isRequestOpen} toggleMenu={toggleRequestModal} />
        </section>
    );
}

export default BusinessDetailsPage;