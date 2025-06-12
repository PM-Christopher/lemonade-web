import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "@/redux/Provider";
import { AlertMessage } from "@/components/global/AlertMessage";
import { GoogleOAuthProvider } from '@react-oauth/google';

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
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            {children}
            <AlertMessage />
          </GoogleOAuthProvider>
        </Provider>
      </body>
    </html>
  );
}
