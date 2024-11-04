"use client"
import React from 'react';
import TopNav from "@/components/navigation/TopNav";
import ChevronLeft from "@/images/icons/chevron-left.svg";
import MainLayout from "@/components/layouts/MainLayout";
import {useRouter} from "next/navigation";

const TermsAndConditionsPage = ({}) => {
    const router = useRouter()
    return (
        <MainLayout>
            <section className="bg-light_grey pb-10">
                <div
                    className="bg-white flex justify-between p-[8px] px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.back()}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Terms & Conditions</p>
                    </div>
                </div>
                <section className="mt-4 flex flex-col items-center">
                    <div className="w-[640px] rounded-[12px] p-[16px] flex flex-col gap-4">
                        <p className="font-semibold text-[20px]">Introduction</p>
                        <p className="font-normal text-[14px] tracking-custom leading-[21px]">
                            Lorem ipsum dolor sit amet consectetur. Scelerisque porta quis ornare odio facilisis nisi
                            etiam enim. Sed nec feugiat elit feugiat ut elementum molestie arcu ullamcorper. Nunc
                            dignissim sed quisque duis. Arcu nulla odio quisque dolor. Augue tortor consequat in nisi
                            nibh. Euismod risus sed arcu vitae vulputate elementum pulvinar consectetur in. Interdum
                            elementum non ac eros eget bibendum viverra tempor. Pellentesque sed varius bibendum
                            eleifend mattis nulla euismod. Ante malesuada est pretium senectus risus consequat placerat.
                            Ac at mi platea non viverra duis egestas massa nibh. Duis senectus mauris at cursus
                            habitasse massa.
                            Natoque maecenas mauris orci in. Vitae massa aenean purus sollicitudin dictum vitae velit
                            accumsan. Quis pharetra etiam elementum ut odio amet. Mauris in egestas eget lobortis
                            vestibulum massa duis. Libero integer felis arcu fermentum diam. Nulla lorem nibh dolor arcu
                            posuere justo lacus egestas. Bibendum luctus in sit mi turpis. Dolor condimentum sagittis
                            non eleifend bibendum mattis. Rhoncus donec nunc quis lectus massa augue venenatis. Rhoncus
                            fames tortor nullam sit enim in mauris eget. Sagittis scelerisque aenean arcu sed odio
                            adipiscing nisl adipiscing tellus. Arcu ultrices diam fringilla vivamus placerat dignissim
                            scelerisque eu.
                            Ipsum tempus id egestas fringilla mauris est integer. Lectus at id sapien lacus id nec
                            molestie. Fermentum tellus ipsum velit tempor etiam sed dictum risus. Pretium pharetra
                            vulputate tortor massa tellus turpis tristique et vulputate. At augue sollicitudin dictum
                            nisl dui orci vulputate nisi mauris. Urna in lectus eget egestas amet etiam rhoncus. Id
                            libero ornare faucibus pharetra tristique tincidunt odio.
                            Pulvinar mattis libero blandit pretium potenti fringilla donec et. Nulla amet interdum
                            mauris posuere. Quis pellentesque vulputate et neque lobortis erat gravida libero. Vitae
                            accumsan dui aliquam praesent fringilla ut. Imperdiet pharetra porta vulputate amet sodales
                            eu. Praesent ut lorem aliquam tincidunt sed sit mauris risus suspendisse. Lacus augue arcu
                            amet a mauris natoque eu. Tempus sem sit sit nisl faucibus lorem elementum. Lectus purus
                            suspendisse purus convallis tincidunt. Volutpat euismod id vel vestibulum elementum massa
                            nunc. Morbi euismod sed mauris porttitor morbi orci mauris quam tincidunt. Senectus nulla
                            pellentesque ullamcorper quis placerat magnis. Id felis vitae gravida cursus suscipit.
                            Commodo arcu viverra integer sed eu nunc. Sapien risus ultricies felis aliquam non. Amet
                            lectus nibh tristique ut sodales cursus parturient. Tortor vivamus in nibh semper
                            ullamcorper magna. Faucibus ornare sapien quis malesuada feugiat nunc fermentum non
                            ultrices. Auctor semper iaculis risus lacinia. Ac odio purus et felis ac magna malesuada.
                            Pharetra pretium fusce tempus tincidunt auctor praesent ultricies massa. Nulla arcu
                            ridiculus tortor suscipit eu elit dictum. Est rhoncus tellus massa enim ultrices. Sapien
                            aliquet diam eget lectus id integer nunc amet commodo. Congue metus nunc nibh amet tincidunt
                            posuere nullam velit morbi. Mattis arcu justo neque nulla felis netus. Erat sed platea at
                            elementum eget. Vitae maecenas ullamcorper dictum feugiat non auctor convallis nam.
                        </p>
                    </div>
                </section>
            </section>
        </MainLayout>
    );
}

export default TermsAndConditionsPage;