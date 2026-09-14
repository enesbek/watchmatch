import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WatchMatch — Bu akşam ne izlesek?",
  description:
    "Partnerinizle veya arkadaşlarınızla saniyeler içinde ortak film/dizi seçin. Swipe edin, eşleşin, izleyin.",
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
    <html lang="tr">
      <body className="min-h-screen bg-base antialiased">{children}</body>
    </html>
  );
}
