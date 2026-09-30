import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let messaging: ReturnType<typeof getMessaging> | undefined;

// getMessaging() throws synchronously if firebaseConfig.projectId (or the
// other required fields) are missing — guarded the same way as the
// frontend app's equivalent (apps/frontend/src/lib/firebase.ts), which hit
// this for real: an unconfigured Firebase crashed the whole app instead of
// degrading, since FcmProvider wraps the root layout.
if (typeof window !== "undefined" && "navigator" in window && firebaseConfig.projectId) {
  try {
    const app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);
  } catch (error) {
    console.error("Firebase messaging failed to initialize:", error);
  }
}

export { messaging, getToken, onMessage };
