import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNavigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MealMate - Culinary Inspiration Awaits",
  description:
    "Your personal meal planning assistant. Discover recipes from Karnataka, South India, North India, and cuisines around the world. Track nutrition and plan your meals with style.",
  keywords: [
    "meal planning",
    "recipes",
    "Indian food",
    "Karnataka cuisine",
    "nutrition tracker",
    "cooking",
    "culinary",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] min-h-screen`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pb-24 md:pb-0">{children}</main>
            <Footer />
            <BottomNavigation />
          </div>
        </Providers>
      </body>
    </html>
  );
}
