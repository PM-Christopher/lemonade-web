import React from 'react';
import empty_business from "@/image/business_empty.png"
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";

const ListingSection = () => {
    const router =  useRouter()
    return (
        <section className="min-h-screen mt-4 flex flex-col items-center">
            <div className="flex justify-center items-center h-screen">
                <div className="flex flex-col items-center">
                    <Image src={"/images/business_empty.png"} alt="business" width={160} height={148} />
                    <p className="font-semibold text-[20px] mt-[24px]">List business</p>
                    <p className="font-normal text-[14px] w-[327px] text-center">Get started by adding your business, and get discovered by potential clients.</p>
                    <Button className="mt-[24px] bg-gradient-green h-[48px] rounded-[12px] p-[14px] px-[48px] shadow-custom-bottom" onClick={() => router.push("/business/add-business")}>
                        <p className="font-semi-normal text-[16px]">Add business</p>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default ListingSection;