import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/redux/Provider";
import { AlertMessage } from "@/components/global/AlertMessage";
import { WebVitalsReporter } from "@/components/global/WebVitalsReporter";
import { FcmProvider } from "@/context/FcmContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Lemonade Admin", template: "%s | Lemonade Admin" },
  description: "Lemonade Admin Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Per-request render so middleware's CSP nonce can be stamped onto scripts.
  await headers();

  return (
    <html lang="en">
      <body className={inter.className}>
        <WebVitalsReporter />
        <Providers>
          <FcmProvider>
            <Suspense fallback={null}>{children}</Suspense>
          </FcmProvider>
          <AlertMessage />
        </Providers>
      </body>
    </html>
  );
}
