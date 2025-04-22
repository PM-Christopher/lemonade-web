"use client";
import React from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <AntdRegistry>
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
  );
};

export default Providers;
