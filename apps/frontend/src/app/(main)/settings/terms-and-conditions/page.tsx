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
                    className="bg-white flex justify-between p-[8px] px-[16px] laptop:px-[64px] border-t-[1px] border-b-[1px] items-center">
                    <div className="flex gap-2 p-[4px] pl-[4px] pr-[16px] items-center rounded-[12px] cursor-pointer"
                         onClick={() => router.back()}>
                        <ChevronLeft/>
                        <p className="font-sans font-semibold text-[16px] tracking-custom">Terms & Conditions</p>
                    </div>
                </div>
                <section className="mt-4 flex flex-col items-center">
                    <div className="w-full laptop:w-[640px] rounded-[12px] p-[16px] flex flex-col gap-4">
                        <div className="overflow-y-auto max-h-[90vh] py-4 space-y-6 scrollbar-hide">
                            <p>Welcome LEMONS!</p>

                            <p>
                                Welcome to LEMONADE (the “Platform”), which is provided by the Lemonade Network Limited and for the purposes of these Terms, “we” and “us” mean Lemonade Platform.
                            </p>

                            <p>
                                For the purposes of these Terms, “you” and “your” means you as the User of the Services. You are currently reviewing the Terms of Service (the “Terms”), which establish the terms governing our relationship as the service provider and you as the user of the Services. By accessing and utilizing the Platform and associated services, applications, products, and content (collectively referred to as the “Services” which will be outlined below), you agree to abide by these Terms.
                            </p>

                            <p>These Terms of Use therefore constitute an agreement between you and us. Please take your time to read and understand them carefully.</p>

                            <h2 className="text-lg font-semibold mt-4">ACCEPTING THE TERMS</h2>

                            <p>
                                By accessing or using our Services, you confirm that you can form a binding contract with Lemonade, that you accept these Terms and that you agree to comply with them. Your access to and use of our Services is also subject to our Privacy Policy and Community Guidelines, the terms of which can be found directly on the Platform, or where the Platform is made available for download, on your mobile device’s applicable app store, and are incorporated herein by reference. By using the Services, you consent to the terms of the Privacy Policy.
                            </p>

                            <p>
                                If you are accessing or using the Services on behalf of a business or entity, then (a) “you” and “your” include you and that business or entity, (b) you represent and warrant that you are an authorized representative of the business or entity with the authority to bind the entity to these Terms, and that you agree to these Terms on the entity’s behalf, and (c) your business or entity is legally and financially responsible for your access or use of the Services as well as for the access or use of your account by others affiliated with your entity, including any employees, agents or contractors.
                            </p>

                            <p>You can accept the Terms by accessing or using our Services. You understand and agree that we will treat your access or use of the Services as acceptance of the Terms from that point onwards.</p>

                            <h2 className="text-lg font-semibold mt-4">OUR SERVICES</h2>

                            <p>
                                We agree to provide you with the Lemonade Service. The Service includes all of the features, applications, services and software that we provide to advance Lemonade&apos;s mission: To bring you closer to the people and things that you love. The Service is made up of the following aspects:
                            </p>

                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>
                                    Offering personalised opportunities to create, connect, communicate, discover and share. People are different. So, we offer you different types of accounts and features to help you create, share, grow your presence and communicate with people on and off Lemonade. We also want to strengthen your relationships through shared experiences that you actually care about. So we build systems that try to understand who and what you and others care about, and use that information to help you create, find, join and share in experiences that matter to you. Part of that is highlighting content, features, offers and accounts that you might be interested in, and offering ways for you to experience Lemonade, based on things that you and others do on and off Lemonade.
                                </li>
                                <li>
                                    Fostering a positive, inclusive and safe environment. We develop and use tools and offer resources to our community members that help to make their experiences positive and inclusive, including when we think that they might need help. We also have teams and systems that work to combat abuse and breaches of our Terms and policies, as well as harmful and deceptive behaviour. We use all the information that we have – including your information – to try to keep our platform secure. We may also share information about misuse or harmful content with law enforcement. Learn more in the Privacy Policy.
                                </li>
                                <li>
                                    Connecting you with brands, products and services in ways that you care about and those of various communities you’re part of. We use data from Lemonade, to show you ads, offers and other sponsored content that we believe will be meaningful to you and we try to make that content as relevant as all of your other experiences on Lemonade, reflecting the diverse communities and shared interests you care about.
                                </li>
                                <li>
                                    Research and innovation. We use the information we have to study our Service and collaborate with others on research to make our Service better and contribute to the well-being of our community.
                                </li>
                            </ul>

                            <h2 className="text-lg font-semibold mt-4">YOUR ACCOUNT WITH US</h2>

                            <p>
                                To access or use some of our Services, you must create an account with us. When you create this account, you must provide accurate and up-to-date information. It is important that you maintain and promptly update your details and any other information you provide to us, to keep such information current and complete.
                            </p>

                            <p>
                                It is important that you keep your account password confidential and that you do not disclose it to any third party. If you know or suspect that any third party knows your password or has accessed your account, you must notify us immediately at: __________________________________
                            </p>

                            <p>You agree that you are solely responsible (to us and to others) for the activity that occurs under your account.</p>

                            <p>
                                We reserve the right to disable your user account at any time, including if you have failed to comply with any of the provisions of these Terms, or if activities occur on your account which, in our sole discretion, would or might cause damage to or impair the Services or infringe or violate any third-party rights, or violate any applicable laws or regulations.
                            </p>

                            <p>
                                If you no longer want to use our Services again, and would like your account deleted, contact us at: ________________________________________. We will provide you with further assistance and guide you through the process. Once you choose to delete your account, you will not be able to reactivate your account or retrieve any of the content or information you have added.
                            </p>

                            <h2 className="text-lg font-semibold mt-4">PRIVACY POLICY</h2>

                            <p>
                                Providing our Service requires collecting and using your information. The Privacy Policy explains how we collect, use and share information across Lemonade. It also explains the many ways in which you can control your information. You must agree to the Privacy Policy to use Lemonade.
                            </p>

                            <h2 className="text-lg font-semibold mt-4">USER’S ACCESS TO AND USE OF OUR SERVICES</h2>

                            <p>Who can use Lemonade. We want our Service to be as open and inclusive as possible, but we also want it to be safe, secure and in accordance with the law. So, we need you to commit to a few restrictions in order to be part of the Lemonade community.</p>

                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>You must be fully able and legally competent to agree to these Terms;</li>
                                <li>We must not have previously disabled your account for violation of law or any of our policies;</li>
                                <li>
                                    How you can&apos;t use Lemonade. Providing a safe and open Service for a broad community requires that we all do our part.
                                </li>
                                <li>You can&apos;t impersonate others or provide inaccurate information. You don&apos;t have to disclose your identity on Lemonade, but you must provide us with accurate and up-to-date information (including registration information), which may include providing personal data. Also, you may not impersonate someone or something you aren&apos;t, and you can&apos;t create an account for someone else unless you have their express permission.</li>
                                <li>You can&apos;t do anything unlawful, misleading or fraudulent or for an illegal or unauthorised purpose.</li>
                                <li>You can&apos;t violate (or help or encourage others to violate) these Terms or our policies, including in particular the Lemonade Community Guidelines.</li>
                                <li>You can&apos;t do anything to interfere with or impair the intended operation of the Service. This includes misusing any reporting, dispute or appeals channel, such as by making fraudulent or groundless reports or appeals.</li>
                                <li>You can&apos;t attempt to create accounts or access or collect information in unauthorised ways. This includes creating accounts or collecting information in an automated way without our express permission.</li>
                                <li>You can&apos;t sell, license or purchase any account or data obtained from us or our Service. This includes attempts to buy, sell or transfer any aspect of your account (including your username); solicit, collect or use login credentials or badges of other users; or request or collect Lemonade usernames, passwords or misappropriate access tokens.</li>
                                <li>You can’t intimidate or harass another, or promote sexually explicit material, violence or discrimination based on race, sex, religion, nationality, disability, sexual orientation or age</li>
                            </ul>

                            <h2 className="text-lg font-semibold mt-4">PERMISSIONS YOU GIVE TO US</h2>

                            <p>
                                As part of our agreement, you also give us the permissions that we need to provide the Service.
                            </p>

                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>
                                    We do not claim ownership of your content, but you grant us a license to use it. Nothing is changing about your rights in your content. We do not claim ownership of your content that you post on or through the Service and you are free to share your content with anyone else, wherever you choose. However, we need certain legal permissions from you (known as a &quot;license&quot;) to provide the Service. When you share, post or upload content that is covered by intellectual property rights (such as photos or videos) on or in connection with our Service, you hereby grant to us a non-exclusive, royalty-free, transferable, sublicensable, worldwide license to host, use, distribute, modify, run, copy, publicly perform or display, translate and create derivative works of your content (consistent with your privacy and application settings). This license will end when your content is deleted from our systems. You can delete content individually or all at once by deleting your account. To learn more about how we use information, and how to control or delete your content, review the Privacy Policy.
                                </li>
                                <li>
                                    In addition to the above, your access to and use of the Services must, at all times, be compliant with our Community Guidelines.
                                </li>
                                <li>
                                    We reserve the right, at any time and without prior notice, to remove or disable access to content at our discretion for any reason or no reason. Some of the reasons we may remove or disable access to content may include finding the content objectionable, in violation of these Terms or our Community Guidelines, or otherwise harmful to the Services or our users.
                                </li>
                            </ul>

                            <h2 className="text-lg font-semibold mt-4">INTELLECTUAL PROPERTY RIGHTS</h2>

                            <p>
                                We respect intellectual property rights and ask you to do the same. As a condition of your access to and use of the Services, you agree not to use the Services to infringe on any intellectual property rights. We reserve the right, with or without notice, at any time and in our sole discretion to block access to and/or terminate the accounts of any user who infringes or is alleged to infringe any copyrights or other intellectual property rights.
                            </p>

                            <h2 className="text-lg font-semibold mt-4">INDEMNITY</h2>

                            <p>
                                You agree to indemnify and hold harmless LEMONADE, its parents, and affiliates, and each of their respective officers, directors, employees, agents and advisors from any and all claims, liabilities, costs, and expenses, including, but not limited to, attorneys’ fees and expenses, arising out of a breach by you or any user of your account of these Terms or arising out of a breach of your obligations, representation and warranties under these Terms.
                            </p>

                            <h2 className="text-lg font-semibold mt-4">LIMITATION OF LIABILITY</h2>

                            <p>
                                Nothing in these terms shall exclude or limit our liability for losses which may not be lawfully excluded or limited by applicable law. This includes liability for death or personal injury caused by our negligence or the negligence of our employees, agents or subcontractors and for fraud or fraudulent misrepresentation.
                            </p>

                            <p>
                                Subject to the paragraph above, we shall not be liable to you for:
                            </p>

                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>(i) any loss of profit (whether incurred directly or indirectly);</li>
                                <li>(ii) any loss of goodwill;</li>
                                <li>(iii) any loss of opportunity;</li>
                                <li>(iv) any loss of data suffered by you; or</li>
                                <li>(v) any indirect or consequential losses which may be incurred by you.</li>
                            </ul>

                            <p>
                                Any loss or damage which may be incurred by you as a result of:
                            </p>

                            <ul className="list-disc list-inside ml-4 space-y-2">
                                <li>Any reliance placed by you on the completeness, accuracy or existence of any advertising, or as a result of any relationship or transaction between you and any advertiser or sponsor whose advertising appears on the service;</li>
                                <li>Any changes which we may make to the services, or for any permanent or temporary cessation in the provision of the services (or any features within the services);</li>
                                <li>The deletion of, corruption of, or failure to store, any content and other communications data maintained or transmitted by or through your use of the services;</li>
                                <li>Your failure to provide us with accurate account information;</li>
                                <li>Or your failure to keep your password or account details secure and confidential.</li>
                            </ul>

                            <p>
                                Our responsibility for anything that happens on the Service (also called &quot;liability&quot;) is limited as much as the law will allow. If there is an issue with our Service, we can&apos;t know what all the possible impacts might be. You agree that we won&apos;t be responsible (&quot;liable&quot;) for any lost profits, revenues, information or data, or consequential, special, indirect, exemplary, punitive or incidental damages arising out of or related to these Terms, even if we know that they are possible. This includes when we delete your content, information or account.
                            </p>

                            <p>
                                To the fullest extent permitted by law, any dispute you have with any third party arising out of your use of the services, including, by way of example and not limitation, any carrier, copyright owner or other user, is directly between you and such third party, and you irrevocably release us and our affiliates from any and all claims, demands and damages (actual and consequential) of every kind and nature, known and unknown, arising out of or in any way connected with such disputes.
                            </p>

                            <h2 className="text-lg font-semibold mt-4">UPDATING THESE TERMS</h2>

                            <p>
                                We reserve the right to modify our Service and policies, and we may need to update these Terms to accurately reflect those changes. Unless required by law, we will notify you (for instance, through a notice on our Platform) before making changes to these Terms. It is important for you to review the Terms regularly for such updates. We will update the &apos;Last Updated&apos; date at the top of the Terms to indicate the effective date of the changes. By continuing to use the Service after the changes take effect, you agree to be bound by the updated Terms. If you do not agree to the new Terms, you must discontinue accessing or using the Services.
                            </p>
                        </div>
                    </div>
                </section>
            </section>
        </MainLayout>
    );
}

export default TermsAndConditionsPage;