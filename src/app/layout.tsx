import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { metrapolis } from "../lib/custom-font";
import "../styles/globals.css";

// SEO Config
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
    url: "https://abanteclothing.com", // URL
    siteName: "Abante Clothing",     // brand/site name
    images: [                       
      {
        url: "https://abante-clothing.vercel.app/images/png/abante-clothing-logo.png",    // Image shown on FB
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
