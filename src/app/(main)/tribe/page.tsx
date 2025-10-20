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

export default function TribePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {authToken} = useSelector((state: any) => state.auth);
    const {searchResults} = useSelector((state: any) => state.tribe);

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
            <div
                className="bg-white flex flex-col tablet:flex-row justify-between gap-[10px] p-2 px-10 border-t-[1px] border-b-[1px] items-center">
                <div className="flex gap-10">
                    <div className="flex flex-col justify-center items-center cursor-pointer">
                        <p
                            className={`"font-sans font-semi-normal ${
                                tribeType === "discover" ? "text-black-light" : "text-text-grey"
                            } text-[14px] leading-[21px]"`}
                            onClick={() => changeTribeType("discover")}
                        >
                            Discover
                        </p>
                        {tribeType === "discover" && (
                            <div className="border h-[0.5px] border-step-color w-20"></div>
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-center cursor-pointer">
                        <p
                            className={`"font-sans font-semi-normal ${
                                tribeType === "tln" ? "text-black-light" : "text-text-grey"
                            } text-[14px] leading-[21px]"`}
                            onClick={() => changeTribeType("tln")}
                        >
                            TLN Tribes
                        </p>
                        {tribeType === "tln" && (
                            <div className="border h-[0.5px] border-step-color w-20"></div>
                        )}
                    </div>
                    <div className="flex flex-col justify-center items-center cursor-pointer">
                        <p
                            className={`"font-sans font-semi-normal ${
                                tribeType === "mine" ? "text-black-light" : "text-text-grey"
                            } text-[14px] leading-[21px]"`}
                            onClick={() => changeTribeType("mine")}
                        >
                            My Tribes
                        </p>
                        {tribeType === "mine" && (
                            <div className="border h-[0.5px] border-step-color w-20"></div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-white block tablet:hidden">
                        <div className="flex items-center gap-3 bg-light_grey p-2 rounded-[12px] w-[291px] h-[48px]">
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
                    <Button
                        className="auth-button py-[20px] rounded-[12px] border-step-color shadow-custom-bottom"
                        onClick={activateModal}
                    >
                        {isMobile ? (
                            <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">
                                +
                            </p>
                        ) : (
                            <p className="font-sans font-semi-normal text-[16px] leading-[19.2px]">
                                + Create Tribe
                            </p>
                        )}
                    </Button>
                </div>
            </div>
            <div className="">
                <div className="flex justify-around">
                    <section
                        id="tribes"
                        className="p-10 py-4 w-[704px] h-[1000px] shadow-div-shadow-2"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <Spinner/>
                            </div>
                        ) : data?.tribes.length > 0 ? (
                            <div className="overflow-y-auto max-h-screen hide-scrollbar">
                                {data?.tribes.map((tribe: TribeInterface, index: number) => (
                                    <Link href={`/tribe/${tribe.slug}`}>
                                        <TribeCardList tribe={tribe} key={index}/>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center">
                                <p className="font-semibold text-[24px] text-text-grey">
                                    No tribes found
                                </p>
                            </div>
                        )}
                    </section>
                    <section
                        id="search-tribes"
                        className="p-10 py-4 w-[480px] h-[325px] bg-white rounded-[12px] hidden tablet:block"
                    >
                        <div className="bg-white flex flex-col gap-4">
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
                                        value={search}
                                        onChange={handleTribeSearch}
                                    />
                                </div>
                            </div>
                            <div>
                                <p className="font-semiBold text-[14px] text-text-grey">
                                    Recent search
                                </p>
                            </div>
                            <div className="flex flex-col gap-2">
                                {searchResults.length > 0 &&
                                    searchResults.map((tribe: TribeInterface, index: number) => (
                                        <Link
                                            href={`/tribe/${tribe.slug}`}
                                            key={index}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex gap-2 items-center">
                                                <Image
                                                    src={tribe?.image}
                                                    alt={tribe?.tribe_name}
                                                    width={50}
                                                    height={50}
                                                    className="border-[2px] border-text-grey rounded-[12px]"
                                                />
                                                <p className="font-medium text-text-grey text-[14px]">
                                                    {tribe?.tribe_name}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <CreateTribeModal modalFlag={modalFlag} activateModal={activateModal}/>
        </MainLayout>
    );
}
