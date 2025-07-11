import Pusher from "pusher-js";
import {baseUrl} from "./url";

const app_key: any = process.env.NEXT_PUBLIC_PUSHER_KEY;
const url: any = process.env.NEXT_PUBLIC_BASE_URL;
Pusher.logToConsole = false;
export const pusherConfig = (token: any) => {
    return new Pusher(app_key, {
        cluster: "eu",
        // Laravel uses this endpoint to authorize private channels
        authEndpoint: `${url}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    });
};

export const pusherCon = (token: any) => {
    return new Pusher(app_key, {
        cluster: "eu",
    });
};
