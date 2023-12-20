import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "@/components/next-auth-provider";
import Header from "./_components/header";
import Footer from "./_components/footer";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";
import { Suspense } from "react";
import { PHProvider, PostHogPageview } from "./posthog";

import "@/app/globals.css";
import { env } from "@/env.mjs";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const title = "formie";
const description = "Zero setup form backend.";

export const metadata: Metadata = {
  title,
  description,
  manifest: "https://formie.dev/manifest.json",
  openGraph: {
    title,
    description,
    url: "https://formie.dev",
    type: "website",
    images: ["https://formie.dev/og.jpg"],
  },
  icons: {
    icon: "https://formie.dev/logo-small.svg",
    shortcut: "https://formie.dev/favicon.ico",
    apple: "https://formie.dev/logo-small.png",
  },
  appleWebApp: {
    title,
    statusBarStyle: "default",
    startupImage: ["https://formie.dev/logo-small.png"],
  },
  metadataBase: new URL(env.NEXT_PUBLIC_BASE_URL),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  themeColor: "#75bd82",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>
        <body
          className={cn(
            "flex min-h-screen flex-col bg-background font-sans antialiased",
            fontSans.variable,
          )}
        >
          <NextTopLoader color="hsl(131 38% 74%)" />
          <NextAuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              disableTransitionOnChange
            >
              <Header />
              <main className="flex flex-1 flex-col">{children}</main>
              <Footer />

              <Toaster
                toastOptions={{ className: "text-sm !bg-zinc-800 !text-white" }}
              />
            </ThemeProvider>
          </NextAuthProvider>
        </body>
      </PHProvider>
    </html>
  );
}
