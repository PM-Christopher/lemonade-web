"use client";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import SearchIcon from "@/images/icons/search.svg";
import TribeCardList from "@/components/tribe/TribeCardList";
import {useSelector} from "react-redux";
import {useRequest} from "@/hooks/useRequest";
import {TribeInterface} from "@/interfaces/TribeInterface";
import {Spinner} from "evergreen-ui";
import MainLayout from "@/components/layouts/MainLayout";
import {axiosInstance} from "@/lib/axiosInstane";
import {updateToastifyReducer} from "@/redux/toastifySlice";
import {useAppDispatch} from "@/redux/hook";
import * as yup from "yup";
import {useFormik} from "formik";
import {authFailure, loadStop} from "@/features/authentication/authSlice";
import {useMediaQuery} from "react-responsive";
import {searchTribe} from "@/features/tribes/tribe.slice";
import CreateTribeModal from "@/components/tribe/CreateTribeModal";
import {TribeListSkeleton} from "@/components/Skeletons";

export default function TribePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {authToken} = useSelector((state: any) => state.auth);
    const {searchResults} = useSelector((state: any) => state.tribe);
    const [showTooltip, setShowTooltip] = useState(false);

    const [tribeType, setTribeType] = useState("discover");
    const [search, setSearch] = useState("");

    const isMobile = useMediaQuery({query: "(max-width: 640px)"});

    const getHeader = () => {
        return {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        };
    };

    // onChange handler that updates local state and dispatches an action
    const handleTribeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearch(value);
        dispatch(searchTribe({data: {search: value}}));
    };

    const {data, loading} = useRequest(
        `/tribes?type=${tribeType}`,
    );

    const [modalFlag, setModalFlag] = useState(false);

    const activateModal = () => {
        setModalFlag(!modalFlag);
    };

    const changeTribeType = (type: string) => {
        setTribeType(type);
    };

    const createTribeSchema = yup.object({
        tribe_name: yup.string().required("Tribe name is required"),
        category: yup.string().required("Category is required"),
        description: yup.string().required("Description is required"),
        image: yup.string().required("Image is required"),
        private: yup.boolean().required(),
        monetized: yup.boolean().required(),
        membership_fee: yup
            .number()
            .default(0)
            .when("monetized", {
                is: true,
                then: (schema) => schema.required("Membership fee is required"),
            }),
        members: yup.array().when("private", {
            is: true,
            then: (schema) => schema.of(yup.string()),
        }),
    });

    const formik = useFormik({
        initialValues: {
            tribe_name: "",
            category: "",
            description: "",
            image: "",
            private: false,
            monetized: false,
            membership_fee: 0,
            members: [],
        },
        validationSchema: createTribeSchema,
        onSubmit: async (values) => {
            values.membership_fee = values.membership_fee ? values.membership_fee : 0;
            try {
                const {data} = await axiosInstance.post(
                    "/tribes/create-tribe",
                    values,
                    getHeader()
                );
                if (data.status) {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Tribe created",
                            type: "success",
                        })
                    );
                    activateModal();
                    // redirect to the newly created tribe
                    router.push(`/tribe/${data?.data?.tribe?.slug}`);
                } else {
                    dispatch(
                        updateToastifyReducer({
                            show: true,
                            message: "Something went wrong",
                            type: "error",
                        })
                    );
                }
            } catch (err: any) {
                dispatch(authFailure());
                dispatch(
                    updateToastifyReducer({
                        show: true,
                        message: err?.response?.data?.message || "error",
                        type: "error",
                    })
                );
            } finally {
                dispatch(loadStop());
            }
        },
    });

    const showError = (errorMessage: any) => {
        dispatch(
            updateToastifyReducer({
                show: true,
                message: errorMessage || "An error occurred",
                type: "error",
            })
        );
    };

    useEffect(() => {
        if (formik.submitCount > 0 && Object.keys(formik.errors).length > 0) {
            const firstErrorMessage = Object.values(formik.errors)[0];
            showError(firstErrorMessage);
        }
    }, [formik.errors, formik.submitCount]);

    return (
        <MainLayout>
            <div className="bg-white flex flex-col tablet:flex-row justify-between items-center border-y border-gray-200 px-6 py-3 gap-4">
                {/* Tabs */}
                <div className="flex gap-8">
                    {[
                        { key: "discover", label: "Discover" },
                        { key: "tln", label: "TLN Tribes" },
                        { key: "mine", label: "My Tribes" },
                    ].map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => changeTribeType(tab.key)}
                            className={`flex flex-col items-center transition-all duration-200 ${
                                tribeType === tab.key
                                    ? "text-black-light"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            <span className="text-sm font-medium">{tab.label}</span>
                            <div
                                className={`h-[2px] mt-1 w-16 transition-all duration-200 ${
                                    tribeType === tab.key ? "bg-step-color" : "bg-transparent"
                                }`}
                            />
                        </button>
                    ))}
                </div>

                {/* Search & Create Button */}
                <div className="flex items-center gap-3">
                    {/* Mobile Search */}
                    <div className="block tablet:hidden">
                        <div className="flex items-center gap-3 bg-light_grey p-2 rounded-xl w-[260px] h-[44px]">
                            <SearchIcon className="text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search tribe"
                                className="bg-light_grey border-0 text-sm w-full focus:outline-none placeholder-gray-500"
                            />
                        </div>
                    </div>

                    {/* Create Button */}
                    <Button
                        className="auth-button py-2 px-4 rounded-xl border-step-color shadow-custom-bottom flex items-center gap-2"
                        onClick={activateModal}
                    >
      <span className="text-base font-medium">
        {isMobile ? "+" : "+ Create Tribe"}
      </span>
                    </Button>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex flex-col tablet:flex-row justify-center gap-6 mt-4 px-4 tablet:px-10">
                {/* Tribe List Section */}
                <section className="bg-white shadow-div-shadow-2 rounded-xl w-full tablet:w-[700px] p-6 min-h-[200px]">
                    {loading ? (
                        <TribeListSkeleton count={4} />
                    ) : data?.tribes?.length > 0 ? (
                        <div className="overflow-y-auto max-h-[80vh] hide-scrollbar space-y-4">
                            {data.tribes.map((tribe: TribeInterface, index: number) => (
                                <Link href={`/tribe/${tribe.slug}`} key={index}>
                                    <TribeCardList tribe={tribe} />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-gray-500 text-lg font-medium">No tribes found</p>
                        </div>
                    )}
                </section>

                {/* Search Sidebar (Desktop) */}
                <section className="hidden tablet:block bg-white rounded-xl p-6 w-[420px] h-fit">
                    <div className="flex flex-col gap-4">
                        {/* Search Input */}
                        <div className="relative w-full">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 bg-light_grey p-2 rounded-xl">
                                <SearchIcon className="text-gray-500" />
                                <input
                                    id="search"
                                    type="text"
                                    className="bg-light_grey border-0 w-full text-sm focus:outline-none placeholder-gray-500"
                                    placeholder="Search tribe"
                                    value={search}
                                    onChange={handleTribeSearch}
                                    onFocus={() => setShowTooltip(true)}
                                    onBlur={() => setShowTooltip(false)}
                                />
                            </div>

                            {/* Tooltip */}
                            {(!search || search.trim() === "") && showTooltip && (
                                <div className="absolute left-2 bottom-[-28px] bg-gray-800 text-white text-xs rounded-md py-1 px-2 shadow-md animate-fade-in">
                                    Start typing to search...
                                    <div className="absolute left-4 -top-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                                </div>
                            )}
                        </div>


                        {/* Recent Search */}
                        <p className="text-sm font-semibold text-gray-500">Recent Search</p>

                        <div className="flex flex-col gap-2">
                            {searchResults.length > 0 ? (
                                searchResults.map((tribe: TribeInterface, index: number) => (
                                    <Link
                                        href={`/tribe/${tribe.slug}`}
                                        key={index}
                                        className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition"
                                    >
                                        <Image
                                            src={tribe.image}
                                            alt={tribe.tribe_name}
                                            width={48}
                                            height={48}
                                            className="rounded-lg border border-gray-200"
                                        />
                                        <p className="text-sm text-gray-700 font-medium">
                                            {tribe.tribe_name}
                                        </p>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">No recent searches</p>
                            )}
                        </div>
                    </div>
                </section>
            </div>

            <CreateTribeModal modalFlag={modalFlag} activateModal={activateModal}/>
        </MainLayout>
    );
}
