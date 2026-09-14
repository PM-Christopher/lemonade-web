"use client";
import React from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { ProgressProvider } from "@bprogress/next/app";
import { QueryProvider } from "./QueryProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <Provider store={store}>
        <AntdRegistry>
          <ProgressProvider
            height="4px"
            color="#80BC00"
            options={{ showSpinner: true }}
            shallowRouting
          />
          <ConfigProvider
            theme={{
              components: {
                Modal: {
                  borderRadius: 8,
                  contentBg: "#ffffff",
                  headerBg: "transparent",
                },
              },
            }}
          >
            <PersistGate loading={null} persistor={persistor}>
              {children}
            </PersistGate>
          </ConfigProvider>
        </AntdRegistry>
      </Provider>
    </QueryProvider>
  );
};

export default Providers;
