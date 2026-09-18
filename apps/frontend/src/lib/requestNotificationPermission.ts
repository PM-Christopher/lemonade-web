import { getToken, messaging, onMessage } from "./firebase";
import type { MessagePayload } from "firebase/messaging";

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
    if (!registration || !messaging) return;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) return;
  } catch (error) {
    console.error("Error requesting notification permission: ", error);
    return;
  }
};

export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload: MessagePayload) => {
      resolve(payload);
    });
  });
};
