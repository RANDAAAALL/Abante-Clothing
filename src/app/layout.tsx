// import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import "./globals.css";

// custom font
const metrapolis = localFont({
  src: [
    { path: "../fonts/metrapolis/Metrapolis-ExtraLight.woff2", weight: "200", style: "normal" },
    { path: "../fonts/metrapolis/Metrapolis-Thin.woff2", weight: "100", style: "normal" },
    { path: "../fonts/metrapolis/Metrapolis-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/metrapolis/Metrapolis-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../fonts/metrapolis/Metrapolis-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/metrapolis/Metrapolis-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/metrapolis/Metrapolis-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-metrapolis",
});


export const metadata: Metadata = {
 metadataBase: new URL("https://yourproject.vercel.app"),
  title:{
    default: "Abante Clothing",
    template: "%s | Abante Clothing"
  },
  description: "Abante Clothing – Stylish and affordable fashion for everyone. Discover the latest trends today!",
  openGraph: {
    title: "Abante Clothing",        // Title shown when shared
    description: "Discover fashion trends at Abante Clothing.", // Short description
    url: "https://abanteclothing.com", // Canonical URL
    siteName: "Abante Clothing",     // Your brand/site name
    images: [                       
      {
        url: "/images/png/abante-clothing-logo.png",    // Image shown on FB
        width: 1200,
        height: 630,
        alt: "Abante Clothing Hero Banner",
      },
    ],
    locale: "en_US", // Language/region
    type: "website",           
  },

  // Twitter metadata
  twitter: {
    card: "summary_large_image",
    title: "Abante Clothing",
    description: "Discover fashion trends at Abante Clothing.",
    images: ["/images/png/abante-clothing-logo.png"]
  }
  

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${metrapolis.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
