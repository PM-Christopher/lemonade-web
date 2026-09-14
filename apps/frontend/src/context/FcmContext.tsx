"use client";
import { useContext, createContext, useEffect, useState } from "react";
import { messaging, onMessage, getToken } from "@/lib/firebase";
import type { MessagePayload } from "firebase/messaging";
import { toast, Toaster } from "react-hot-toast";

interface FcmContextProps {
  fcmToken: string | null;
  notification: string | null;
}

export const FcmContext = createContext<FcmContextProps>({
  fcmToken: null,
  notification: null,
});

export const getOrRegisterServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    const serviceWorker = await window.navigator.serviceWorker.getRegistration(
      "/firebase-push-notification-scope",
    );
    if (serviceWorker) return serviceWorker;
    return window.navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/firebase-push-notification-scope",
    });
  }
  throw new Error("Service Worker is not supported in this browser");
};

export const getFirebaseToken = () =>
  getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
    getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration,
    }),
  );

export const onForegroundMessage = () =>
  new Promise((resolve) => onMessage(messaging, (payload: MessagePayload) => resolve(payload)));

export const FcmProvider = ({ children }: { children: React.ReactNode }) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<any | null>(null);
  const [showToaster, setShowToaster] = useState(false);

  useEffect(() => {
    const register = async () => {
      try {
        if (!messaging) return;

        const token = await getFirebaseToken();
        if (!token) {
          console.warn("No FCM token registered");
          return;
        }
        setFcmToken(token);
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
      setNotification(payload?.notification);
      setShowToaster(true);

      toast.custom(
        (t) => (
          <div
            className={`pointer-events-auto flex w-full max-w-sm rounded-xl bg-gradient-green p-4 shadow-lg ring-1 ring-black ring-opacity-5 transition-all ${
              t.visible ? "animate-enter" : "animate-leave"
            }`}
          >
            <div className="w-0 flex-1">
              <p className={"text-sm font-semibold text-white"}>New notification</p>
              <p className="mt-2 text-sm font-semibold text-stone-100">
                {payload?.notification?.title}
              </p>
              <p className="mt-[0.5px] text-sm text-stone-100">{payload?.notification?.body}</p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              ✕
            </button>
          </div>
        ),
        {
          duration: 4000,
        },
      );
      // Automatically hide toaster after 4 seconds
      setTimeout(() => {
        setShowToaster(false);
      }, 2000);
    });

    register();
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return (
    <FcmContext.Provider value={{ fcmToken, notification }}>
      {children}
      {showToaster && <Toaster position="top-right" reverseOrder={true} />}
    </FcmContext.Provider>
  );
};

export const useFcm = () => useContext(FcmContext);
