"use client"
import {ReactNode, useEffect} from "react";
import SideNav from "@/components/global/SideNav";
import TopNav from "@/components/global/TopNav";
import {useAppDispatch, useAppSelector} from "@/redux/hook";
import {useRouter} from "next/navigation";
import {setIsRouting} from "@/redux/tempSlice";
import {authSuccess} from "@/features/authentication/authSlice";
import {useCurrentAdminQuery} from "@/features/authentication/queries";
import { useMediaQuery } from "react-responsive";
import BottomNav from "../global/BottomNav";

interface DashboardLayoutProps {
    children: ReactNode;
}

// Non-secret placeholder — see features/authentication/mutations.ts for why
// this exists instead of a real token.
const SESSION_MARKER = "session";

const MainLayout = ({ children }: DashboardLayoutProps) => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isMobile = useMediaQuery({ query: "(max-width: 1023px)" });
    const { user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        dispatch(setIsRouting(false));
    }, []);

    // The single source of truth for "who is logged in" — replaces a
    // client-side check of the OLD, JS-readable "token" cookie. Route
    // protection at the edge already happens in middleware.ts against the
    // real httpOnly cookie; this is the belt-and-suspenders client-side
    // check plus the source for `state.auth.user`.
    const { isSuccess, isError, data: currentAdmin } = useCurrentAdminQuery({ enabled: !user });

    useEffect(() => {
        if (isSuccess && currentAdmin) {
            dispatch(authSuccess({ admin: currentAdmin, token: SESSION_MARKER }));
        }
    }, [isSuccess, currentAdmin, dispatch]);

    useEffect(() => {
        if (isError && !user) {
            router.push("/login");
        }
    }, [isError, user, router]);

    return (
        <div className="min-h-screen flex">
            {/* Sidebar (only visible on non-mobile) */}
            {!isMobile && <SideNav />}

            {/* Main Content */}
            <main className={`flex-1 bg-light-grey min-h-screen ${isMobile ? 'flex flex-col' : ''}`}>
                <TopNav />

                {/* Content (ensure it takes available height) */}
                <div className="flex-grow overflow-auto">
                    {children}
                </div>

                {/* Bottom Nav (only visible on mobile and make it scrollable) */}
                {isMobile && (
                    <div className="overflow-x-auto whitespace-nowrap">
                        <BottomNav />
                    </div>
                )}
            </main>
        </div>



//  <div className="bg-light_grey pb-10 min-h-screen h-full overflow-hidden w-full">
//             <TopNav/>
//             {children}
//             {/* {
//                 isMobile && (
//                     <BottomNav />
//                 )
//             } */}
//         </div>
    );
};

export default MainLayout;
