import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PT. Daya Prana Raya - Civil Construction & Building Maintenance",
  description: "Perusahaan konstruksi terpercaya yang bergerak di bidang jasa konstruksi, sipil, mekanik, elektrik, dan engineering.",
  keywords: ["PT. Daya Prana Raya", "konstruksi", "civil construction", "building maintenance", "sipil", "mekanik", "elektrik", "engineering"],
  authors: [{ name: "PT. Daya Prana Raya" }],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "PT. Daya Prana Raya - Civil Construction & Building Maintenance",
    description: "Perusahaan konstruksi terpercaya yang bergerak di bidang jasa konstruksi, sipil, mekanik, elektrik, dan engineering.",
    url: "https://dayapranaraya.com",
    siteName: "PT. Daya Prana Raya",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PT. Daya Prana Raya - Civil Construction & Building Maintenance",
    description: "Perusahaan konstruksi terpercaya yang bergerak di bidang jasa konstruksi, sipil, mekanik, elektrik, dan engineering.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
