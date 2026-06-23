import type { Metadata } from "next";
import { Providers } from "./providers";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import CartDrawer from "@/components/layout/CartDrawer";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Flint & Beam — Artisan Lighting, Hand-Finished in California",
  description:
    "Handcrafted lighting from our Sonoma workshop. Each piece is built to order using time-honored techniques, raw brass, hand-blown glass, and California hardwoods. Designed to last generations.",
  keywords: [
    "artisan lighting",
    "handcrafted lighting",
    "Sonoma lighting",
    "California lighting",
    "hand-finished sconces",
    "custom pendants",
    "brass lighting",
    "Flint & Beam",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Flint & Beam",
    title: "Flint & Beam — Artisan Lighting, Hand-Finished in California",
    description:
      "Handcrafted lighting from our Sonoma workshop. Each piece is built to order using time-honored techniques.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Flint & Beam — Artisan Lighting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flint & Beam — Artisan Lighting",
    description:
      "Handcrafted lighting from our Sonoma workshop. Built to order, designed to last.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <CartDrawer />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
