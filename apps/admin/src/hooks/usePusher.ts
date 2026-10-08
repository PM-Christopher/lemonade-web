"use client";
import { pusherCon, pusherConfig } from "@/config/pusherConfig";
import { useEffect, useState } from "react";

export const usePusher = (channelName: string, eventName: string) => {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    const isUserChannel = channelName === "user";
    const pusher = isUserChannel ? pusherCon() : pusherConfig();
    // Private channels use the backend's `private-` prefix.
    const subscribeName = isUserChannel ? channelName : `private-${channelName}`;
    const channel = pusher.subscribe(subscribeName);

    const eventHandler = (receivedData: unknown) => {
      setData(receivedData);
      if (channelName === "chat-channel") {
      }
    };

    channel.bind(eventName, eventHandler);

    return () => {
      channel.unbind(eventName, eventHandler);

      pusher.unsubscribe(subscribeName);
    };
  }, [channelName, eventName]);

  return { data };
};
