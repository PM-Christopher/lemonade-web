"use client";
import React from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { QueryProvider } from "./QueryProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </QueryProvider>
  );
};

export default Providers;
