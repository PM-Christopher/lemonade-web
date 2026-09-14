"use client"
import { pusherCon, pusherConfig } from "@/config/pusherConfig";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useEffect, useState } from "react";

export const usePusher = (channelName: string, eventName: string) => {
    const [data, setData] = useState<any>(null);
    const { user } = useAppSelector((state: any) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const isUserChannel = channelName === "user";
        const pusher = isUserChannel ? pusherCon() : pusherConfig();
        // Backend broadcasts on the "private-"-prefixed wire name (see
        // lemonade-backend's routes/channels.php); callers pass the logical name.
        const subscribeName = isUserChannel ? channelName : `private-${channelName}`;
        const channel = pusher.subscribe(subscribeName);

        const eventHandler = (receivedData: any) => {
            setData(receivedData);
            if(channelName === "chat-channel") {
            }
        };

        pusher.connection.bind("state_change", function (states: any) {
            console.log(states, "state change event>>>>>>>");
            eventName === "test-event" &&
            console.log(states, "test state change event>>>>>>>");
        });

        pusher.connection.bind("connected", function (states: any) {
            console.log("state change connected event>>>>>>>");
            eventName === "test-event" &&
            console.log("test state change connected event>>>>>>>");
        });

        channel.bind(eventName, eventHandler);

        return () => {
            channel.unbind(eventName, eventHandler);

            pusher.unsubscribe(subscribeName);
        };
    }, [channelName, eventName]);

    return { data };
}