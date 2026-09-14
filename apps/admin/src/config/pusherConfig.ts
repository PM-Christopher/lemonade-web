import Pusher from "pusher-js";

// Was: custom /pusher/auth/{user,channel} endpoints — never registered on
// the backend (only the framework's default /broadcasting/auth exists) —
// with a manual Authorization header built from a token nothing ever set.
// authEndpoint is now this app's own same-origin Route Handler, which
// attaches the real token server-side from the httpOnly session cookie. See
// app/api/broadcasting/auth/route.ts. Unused today (see that file's
// comment) but fixed for consistency with the frontend app's equivalent.
const app_key: any = process.env.NEXT_PUBLIC_PUSHER_KEY;
export const pusherConfig = () => {
    return new Pusher(app_key, {
        cluster: "eu",
        channelAuthorization: {
            transport: "ajax",
            endpoint: "/api/broadcasting/auth",
        },
    });
};

export const pusherCon = () => {
    return new Pusher(app_key, {
        cluster: "eu",
    });
};
