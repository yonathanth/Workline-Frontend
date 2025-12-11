import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AppProvider from "./provider";
import DarkModeToggle from "@/features/LandingPage/presentation/components/DarkModeToggle";
import { Toaster } from "@/components/ui/sonner";
import { GlobalLoaderProvider } from "@/context/GlobalLoaderContext";
import { GlobalLoader } from "@/components/GlobalLoader";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Workline",
  description: "Modern Next.js application with Clean Architecture",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased font-sans`}
      >
        <AppProvider>
          <GlobalLoaderProvider>
            <GlobalLoader />
            {children}
            <DarkModeToggle />
            <Toaster richColors position="top-right" />
          </GlobalLoaderProvider>
        </AppProvider>
      </body>
    </html>
  );
}
