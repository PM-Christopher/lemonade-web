import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/redux/Provider";
import LayoutWrapper from "@/components/LayoutWrapper";
import {FcmProvider} from "@/context/FcmContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lemonade",
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
        <Provider>
          <LayoutWrapper>
              <FcmProvider>
                  {children}
              </FcmProvider>
          </LayoutWrapper>
        </Provider>
      </body>
    </html>
  );
}
