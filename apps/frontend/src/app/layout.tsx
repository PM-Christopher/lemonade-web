import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/redux/Provider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { FcmProvider } from "@/context/FcmContext";
import { MenuStateProvider } from "@/context/MenuStateProvider";
import { WebVitalsReporter } from "@/components/global/WebVitalsReporter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Lemonade", template: "%s | Lemonade" },
  description: "Lemonade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebVitalsReporter />
        <MenuStateProvider>
          <Provider>
            <LayoutWrapper>
              {/* useNavigation/useSearchParams need a Suspense boundary. */}
              <FcmProvider>
                <Suspense fallback={null}>{children}</Suspense>
              </FcmProvider>
            </LayoutWrapper>
          </Provider>
        </MenuStateProvider>
      </body>
    </html>
  );
}
