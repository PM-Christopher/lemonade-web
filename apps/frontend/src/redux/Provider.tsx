"use client";
import React from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { ProgressProvider } from "@bprogress/next/app";
import { CookiesProvider } from "react-cookie";
import { QueryProvider } from "./QueryProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <CookiesProvider>
      <QueryProvider>
        <Provider store={store}>
          <ProgressProvider
            height="4px"
            color="#80BC00"
            options={{ showSpinner: true }}
            shallowRouting
          />
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </Provider>
      </QueryProvider>
    </CookiesProvider>
  );
};

export default Providers;
