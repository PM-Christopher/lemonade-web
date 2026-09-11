"use client"

import { useEffect } from "react";
import {onMessageListener, requestNotificationPermission} from "@/lib/requestNotificationPermission";
import {useSelector} from "react-redux";
import {RootState} from "@/redux/store";

const FirebaseInit = () => {

    const { user, authToken } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        const subscribeUser = async () => {
            await requestNotificationPermission()
        }

        onMessageListener().then((payload) => {
            console.log({payload})
        })
        subscribeUser()
    }, []);
    return null
}

export default FirebaseInit