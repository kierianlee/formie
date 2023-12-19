import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "@/components/next-auth-provider";
import Header from "./_components/header";
import Footer from "./_components/footer";
import { Toaster } from "react-hot-toast";
import NextTopLoader from "nextjs-toploader";

import "@/app/globals.css";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "formie",
  description: "Forms without the hassle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
    </html>
  );
}
