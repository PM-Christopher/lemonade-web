import { getToken, messaging, onMessage } from "./firebase";

export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission()
        if (permission !== "granted") return

        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        if (!registration) return

        const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration
        })

        if (!token) return
        console.log("FCM Token: ", token)
    } catch (error) {
        console.error("Error requesting notification permission: ",error)
        return
    }
}

export const onMessageListener = () => {
    return new Promise((resolve) => {
        if (!messaging) return
        onMessage(messaging, (payload) => {
            resolve(payload)
        })
    })
}