import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import NextAuthProvider from "@/components/next-auth-provider";
import Header from "./_components/header";
import Footer from "./_components/footer";
import { Toaster } from "react-hot-toast";

import "@/app/globals.css";

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Formie",
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
          "flex min-h-screen flex-col bg-background py-10 font-sans antialiased",
          fontSans.variable,
        )}
      >
        <NextAuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
            <Header />
            <main className="flex flex-1 flex-col px-6">{children}</main>
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
