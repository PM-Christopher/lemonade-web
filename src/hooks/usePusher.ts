"use client"
import { pusherCon, pusherConfig } from "@/config/pusherConfig";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { addToMessages } from "@/features/connect/connect.slice";

export const usePusher = (channelName: string, eventName: string) => {
    const [cookies] = useCookies(["token"]);
    const [data, setData] = useState<any>(null);
    const { user } = useAppSelector((state: any) => state.auth);
    const dispatch = useAppDispatch();
    const token = cookies.token;

    useEffect(() => {
        const pusher = channelName === "user" ? pusherCon(token) : pusherConfig(token);
        const channel = pusher.subscribe(channelName);
        console.log({triggered: "This is listening"})

        const eventHandler = (receivedData: any) => {
            setData(receivedData);
            console.log(`Received event: ${eventName}`, receivedData);

            if (channelName === `chat.${user?.id}`) {
                console.log(`Received event: ${eventName}`, receivedData);
                dispatch(addToMessages({ message: receivedData.message, user }));
            }
        };

        pusher.connection.bind("state_change", (states: any) => {
            console.log("Pusher connection state change:", states);
        });

        pusher.connection.bind("connected", () => {
            console.log("Pusher connected");
        });

        channel.bind(eventName, eventHandler);

        return () => {
            channel.unbind(eventName, eventHandler);
            pusher.unsubscribe(channelName);
        };
    }, [channelName, eventName, token]);

    return { data };
};
