import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/redux/Provider";
import LayoutWrapper from "@/components/LayoutWrapper";
import { FcmProvider } from "@/context/FcmContext";
import { MenuStateProvider } from "@/context/MenuStateProvider";
import { WebVitalsReporter } from "@/components/global/WebVitalsReporter";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Lemonade", template: "%s - Lemonade" },
  description: "Lemonade",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Per-request render so middleware's CSP nonce can be stamped onto scripts.
  // Static HTML cannot carry a fresh nonce; without this, enforced CSP +
  // 'strict-dynamic' blocks every /_next script and the page never paints.
  await headers();

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
