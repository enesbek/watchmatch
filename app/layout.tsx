import type { Metadata, Viewport } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "WatchMatch — What should we watch tonight?",
  description:
    "Pick a movie or show with your partner or friends in seconds. Swipe, match, watch.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0F0F12",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-base antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
