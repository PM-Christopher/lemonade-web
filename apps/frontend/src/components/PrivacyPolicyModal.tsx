import React from 'react';
import CloseIcon from "@/images/icons/close.svg";

type PrivacyPolicyInterface = {
    toggle: () => void;
    option: boolean;
};

const PrivacyPolicyModal: React.FC<PrivacyPolicyInterface> = ({toggle, option}) => {
    return (
        <div
            className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 items-center justify-center ${
                option ? "flex" : "hidden"
            }`}
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-[800px] h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" onClick={toggle}>
                            <CloseIcon />
                        </div>
                        <p className="font-sans font-semibold text-[18px] leading-[27px] tracking-custom">
                            Privacy policy
                        </p>
                    </div>
                </div>

                <div className="overflow-y-auto max-h-[90vh] px-6 py-4 space-y-6 scrollbar-hide">
                    <p>
                        Welcome to Lemonade. This Privacy Policy applies to Lemonade services (the “Platform”) which include Lemonade apps, websites and related services accessed via any platform or device that links to this Privacy Policy. The Platform is provided and controlled by Lemonade Network Limited with its registered address at …………………………………………… (“LEMONADE”, “we”, “our” or “us”).
                    </p>

                    <p>
                        We are committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, share, and otherwise process the personal information of users, and other individuals in connection to our Platform. If you do not agree with this policy, you should not use the Platform.
                    </p>

                    <h2 className="text-lg font-semibold mt-4">What information we collect</h2>

                    <p>We may collect the following information about you:</p>

                    <h3 className="text-md font-semibold mt-2">Information You Provide</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>
                            <strong>Your profile information:</strong> You give us information when you register on the Platform, including your username, password, date of birth (where applicable), email address and/or telephone number, information you disclose in your user profile, and your photograph or profile video.
                        </li>
                        <li>
                            <strong>User content:</strong> When you use our Services, we collect Personal Information that is included in the input, file uploads, or feedback that you provide to our Services (“User Content”).
                        </li>
                        <li>
                            <strong>Messages:</strong> We collect information you provide when you compose, send, or receive messages through the Platform’s messaging functionalities. This includes messages with merchants or other users, including content, timestamps, and participants.
                        </li>
                        <li>
                            We may access content in your device’s clipboard, with your permission, when you share or paste content into the Platform.
                        </li>
                        <li>
                            <strong>Purchase information:</strong> When you make a purchase, we collect information about the transaction, payment card information, billing, delivery, contact information, and items purchased.
                        </li>
                        <li>
                            <strong>Your phone and social network contacts:</strong> If you sync your contacts, we collect names, numbers, and emails and match against existing users. Social network sharing may also include public profiles.
                        </li>
                        <li>
                            <strong>Proof of identity or age:</strong> For verified accounts, livestreams, or business accounts, we may require proof of age or identity.
                        </li>
                        <li>
                            Information in correspondence you send to us, including support or feedback.
                        </li>
                        <li>
                            Information through surveys, research, promotions, contests, challenges, competitions or events conducted or sponsored by us.
                        </li>
                    </ul>

                    <h3 className="text-md font-semibold mt-2">Automatically Collected Information</h3>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>
                            <strong>Usage Information:</strong> How you engage with the Platform, including content interactions, ads viewed, videos watched, browsing history, likes, saves, followed users, and Tribe activity.
                        </li>
                        <li>
                            <strong>Inferred Information:</strong> Attributes such as interests, gender, and age range to personalize content.
                        </li>
                        <li>
                            <strong>Device Information:</strong> Device name, operating system, identifiers, and browser used.
                        </li>
                        <li>
                            <strong>Location Information:</strong> Approximate location via SIM/IP address; precise location if permitted, including location in User Content.
                        </li>
                        <li>
                            <strong>Image and Audio Information:</strong> Videos, images, and audio in User Content for effects, moderation, demographics, and ad/content recommendations.
                        </li>
                        <li>
                            <strong>Cookies:</strong> We and our service providers use Cookies and web beacons (pixel tags) to collect usage information, improve experience, provide advertising, and measure effectiveness. You can disable Cookies via your device/browser settings.
                        </li>
                    </ul>

                    <h2 className="text-lg font-semibold mt-4">How we use your information</h2>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>Fulfill requests for products, services, support, internal operations, and feedback.</li>
                        <li>Provide shopping features and facilitate purchases, sharing data with merchants and payment providers.</li>
                        <li>Personalize content based on your interactions.</li>
                        <li>Send promotional materials from us or affiliates.</li>
                        <li>Improve and develop the Platform.</li>
                        <li>Measure effectiveness of ads and other content, including targeted advertising.</li>
                        <li>Support social functions and messaging, suggest accounts, and enable sharing and interaction with content.</li>
                        <li>Enable interactive features such as using your content in others’ videos.</li>
                        <li>Use User Content in advertising campaigns and promotions.</li>
                        <li>Understand cross-device usage.</li>
                        <li>Infer age range, gender, and interests.</li>
                        <li>Detect and combat abuse, harmful activity, fraud, spam, and illegal activity.</li>
                        <li>Ensure content presentation is effective for you and your device.</li>
                        <li>Promote safety and security by reviewing User Content and metadata for policy violations.</li>
                        <li>Facilitate research by independent researchers.</li>
                        <li>Verify identity or age.</li>
                        <li>Communicate service changes.</li>
                        <li>Announce contest winners and distribute prizes.</li>
                        <li>Enforce Terms of Service, Community Guidelines, and other policies.</li>
                        <li>Provide location-based services consistent with your permissions.</li>
                        <li>Train and improve technology such as machine learning models.</li>
                        <li>Facilitate sales, promotions, and user support.</li>
                    </ul>

                    <h2 className="text-lg font-semibold mt-4">How we share your information</h2>
                    <ul className="list-disc list-inside ml-4 space-y-2">
                        <li>
                            <strong>Business Account Administrators:</strong> Sharing account info from social network login or third-party services, depending on permissions granted.
                        </li>
                        <li>
                            <strong>Vendors and Service Providers:</strong> Sharing information with providers performing services such as hosting, analytics, IT, and customer service.
                        </li>
                        <li>
                            <strong>Business Transfers:</strong> Sharing data during strategic transactions like mergers, reorganization, bankruptcy, or service transfer.
                        </li>
                        <li>
                            <strong>Legal Requirements:</strong> Sharing information if required by law, to protect rights, prevent fraud, or protect safety and security.
                        </li>
                        <li>
                            <strong>Affiliates:</strong> Sharing Personal Information with entities under common control with Lemonade, used consistent with this Privacy Policy.
                        </li>
                    </ul>

                    <h2 className="text-lg font-semibold mt-4">Your rights and choices</h2>
                    <p>
                        You may have rights under applicable law to access, delete, update, or rectify your data, and to appeal decisions. Requests can be submitted via ………………………………………….. You may access and edit your profile by signing in. You may delete User Content or your entire account via Settings. You may also refuse or disable Cookies via device/browser settings; functionality may be impacted.
                    </p>

                    <h2 className="text-lg font-semibold mt-4">The security of your information</h2>
                    <p>
                        We take reasonable measures to protect your information, including technical and organizational safeguards, but cannot guarantee security of data transmitted via the Platform; transmission is at your own risk.
                    </p>

                    <h2 className="text-lg font-semibold mt-4">How long we keep your information</h2>
                    <p>
                        We retain information as long as necessary for the Platform, legal obligations, business interests, or legal claims. Retention periods vary depending on type and purpose of information.
                    </p>

                    <h2 className="text-lg font-semibold mt-4">Information relating to children</h2>
                    <p>
                        Our Service is not directed to children under 13. If a child under 13 provides Personal Information, contact us at …………………….. for removal. Ages 13–18 require parental consent to use the Services.
                    </p>

                    <h2 className="text-lg font-semibold mt-4">Privacy Policy update</h2>
                    <p>
                        We may update this Privacy Policy from time to time. Changes will be indicated by an updated “Last Updated” date. Continued use of the Platform constitutes acceptance. If you disagree, stop using the Platform.
                    </p>

                    <h2 className="text-lg font-semibold mt-4">Contact</h2>
                    <p>Please contact us @ …………………………………………… if you have any questions or concerns not addressed in this Privacy Policy.</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyModal;