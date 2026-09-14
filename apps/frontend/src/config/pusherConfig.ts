import Pusher from "pusher-js";

// Was: token built into a manual Authorization header, sent cross-origin
// straight to Laravel — dead since the httpOnly cutover (no token is ever
// readable here to build that header from) and a violation of "browser JS
// never holds a token" even before that. authEndpoint is now this app's own
// same-origin Route Handler, which attaches the real token server-side from
// the httpOnly session cookie. See app/api/broadcasting/auth/route.ts.
const app_key: any = process.env.NEXT_PUBLIC_PUSHER_KEY;
Pusher.logToConsole = false;
export const pusherConfig = () => {
  return new Pusher(app_key, {
    cluster: "eu",
    authEndpoint: "/api/broadcasting/auth",
  });
};

export const pusherCon = () => {
  return new Pusher(app_key, {
    cluster: "eu",
  });
};
