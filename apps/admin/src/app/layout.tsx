import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "@/redux/Provider";
import { AlertMessage } from "@/components/global/AlertMessage";
import { WebVitalsReporter } from "@/components/global/WebVitalsReporter";
import { FcmProvider } from "@/context/FcmContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lemonade Admin",
  description: "Lemonade Admin Dashboard",
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
        <Providers>
          <FcmProvider>{children}</FcmProvider>
          <AlertMessage />
        </Providers>
      </body>
    </html>
  );
}
