"use client";

import { useEffect } from "react";
import {
  onMessageListener,
  requestNotificationPermission,
} from "@/lib/requestNotificationPermission";

const FirebaseInit = () => {
  useEffect(() => {
    const subscribeUser = async () => {
      await requestNotificationPermission();
    };

    onMessageListener().then(() => {});
    subscribeUser();
  }, []);
  return null;
};

export default FirebaseInit;
