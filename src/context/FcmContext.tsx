"use client"
import { useContext, createContext, useEffect, useState } from "react";
import { messaging, onMessage, getToken } from "@/lib/firebase";
import {toast} from "react-hot-toast";

interface FcmContextProps {
    fcmToken: string | null;
    notification: string | null
}

export const FcmContext = createContext<FcmContextProps>({
    fcmToken: null,
    notification: null,
})

export const FcmProvider = ({ children }: { children: React.ReactNode }) => {
    const [fcmToken, setFcmToken] = useState<string | null>(null)
    const [notification, setNotification] = useState<any | null>(null)

    useEffect(() => {
        const register = async  () => {
            try {
                if (!messaging) return

                const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
                const token = await getToken(messaging, {
                    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                    serviceWorkerRegistration: registration
                })

                if (!token) {
                    console.warn(`No FCM token registered`)
                    return
                }
                setFcmToken(token)
            } catch (error) {
                console.error(error)
            }
        }
        if (messaging) {
            onMessage(messaging, (payload) => {
                setNotification(payload.notification)

                toast.custom((t) => (
                    <div
                        className={`max-w-sm w-full bg-gradient-green shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4 transition-all ${
                            t.visible ? "animate-enter" : "animate-leave"
                        }`}
                    >
                        <div className="flex-1 w-0">
                            <p className={'text-sm font-semibold text-white'}>New notification</p>
                            <p className="mt-2 text-sm font-semibold text-stone-100">{payload?.notification?.title}</p>
                            <p className="mt-[0.5px] text-sm text-stone-100">{payload?.notification?.body}</p>
                        </div>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            className="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            ✕
                        </button>
                    </div>
                ))
            })
        }

        register()
    }, [])

    return (
        <FcmContext.Provider value={{ fcmToken, notification }}>
            {children}
        </FcmContext.Provider>
    )
}

export const useFcm = () => useContext(FcmContext)