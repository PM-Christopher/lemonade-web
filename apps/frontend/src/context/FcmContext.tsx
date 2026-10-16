"use client";
import { useContext, createContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { messaging, onMessage, getToken } from "@/lib/firebase";
import type { MessagePayload } from "firebase/messaging";
import { Toaster } from "react-hot-toast";
import { useAppSelector } from "@/redux/hook";
import { useRegisterDeviceTokenMutation } from "@/features/authentication/mutations";
import { useAuthReady } from "@/hooks/useAuthReady";
import { isAuthPath } from "@/lib/auth-paths";
import { showPushToast } from "@/lib/pushToast";

interface FcmContextProps {
  fcmToken: string | null;
  notification: MessagePayload["notification"] | null;
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

export const getFirebaseToken = () => {
  if (!messaging) return Promise.resolve(null);
  const activeMessaging = messaging;
  return getOrRegisterServiceWorker().then((serviceWorkerRegistration) =>
    getToken(activeMessaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration,
    }),
  );
};

export const onForegroundMessage = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload: MessagePayload) => resolve(payload));
  });

export const FcmProvider = ({ children }: { children: React.ReactNode }) => {
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<MessagePayload["notification"] | null>(null);
  const pathname = usePathname();
  const authReady = useAuthReady();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const { mutate: registerDeviceToken } = useRegisterDeviceTokenMutation();
  // Remember which user + device token we already registered.
  const registeredFor = useRef<string | null>(null);

  // Only register push tokens when signed in on a non-auth page.
  const canRegisterDeviceToken =
    authReady && !isAuthPath(pathname) && isLoggedIn && Boolean(user?.id) && Boolean(fcmToken);

  useEffect(() => {
    if (!canRegisterDeviceToken || !user?.id || !fcmToken) return;

    const registrationKey = `${user.id}:${fcmToken}`;
    if (registeredFor.current === registrationKey) return;
    registeredFor.current = registrationKey;

    registerDeviceToken(
      { device_token: fcmToken, device_type: "web" },
      {
        onError: () => {
          // Clear so the next render can retry.
          registeredFor.current = null;
        },
      },
    );
  }, [canRegisterDeviceToken, fcmToken, user?.id, registerDeviceToken]);

  useEffect(() => {
    if (!messaging) return;
    const activeMessaging = messaging;

    const register = async () => {
      try {
        const token = await getFirebaseToken();
        if (!token) {
          console.warn("No FCM token registered");
          return;
        }
        setFcmToken(token);
      } catch (error) {
        // Push is optional, so a blocked or offline FCM request is a warning, not an app error.
        console.warn("FCM token registration failed", error);
      }
    };

    const unsubscribe = onMessage(activeMessaging, (payload: MessagePayload) => {
      setNotification(payload?.notification);

      // Chat pushes carry the message id, so the realtime toast for it is replaced, not doubled.
      let messageId: string | undefined;
      try {
        messageId = JSON.parse(payload?.data?.chat_message ?? "null")?.id;
      } catch {
        messageId = undefined;
      }

      showPushToast({
        id: messageId,
        title: payload?.notification?.title,
        body: payload?.notification?.body,
        type: payload?.data?.type,
      });
    });

    register();
    return () => unsubscribe();
  }, []);

  return (
    <FcmContext.Provider value={{ fcmToken, notification }}>
      {children}
      <Toaster position="top-right" reverseOrder={true} />
    </FcmContext.Provider>
  );
};

export const useFcm = () => useContext(FcmContext);
