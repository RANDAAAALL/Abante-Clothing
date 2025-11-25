import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { metrapolis } from "../lib/custom-font";
import "../styles/globals.css";
import ClientProvider from "@/context/client-providers";
import FooterSectionContent from "@/components/ui/footer-section/footer-content";
import CartModalContent from "@/components/ui/modal/cart-item/cart-modal-content";
import ToasterClient from "@/components/ui/toast/toaster-client";
import NavbarLayout from "@/components/ui/navbar-section/navbar-layout";

// SEO Config
export const metadata: Metadata = {
  metadataBase: new URL("https://abante-clothing.vercel.app"),
  title: {
    default: "Abante Clothing",
    template: "%s | Abante Clothing",
  },
  icons: {
    icon: "/images/svg/abante-clothing-white-logo.png",
    shortcut: "/images/png/abante-clothing-white-logo.png",
    apple: "/images/png/abante-clothing-white-logo.png"
  },
  description:
    "Abante Clothing – Stylish and affordable fashion for everyone. Discover the latest trends today!",
  openGraph: {
    title: "Abante Clothing", // Title shown when shared
    description: "Discover fashion trends at Abante Clothing.", // Short description
    url: "https://abante-clothing.vercel.app/", // URL
    siteName: "Abante Clothing", // brand/site name
    images: [
      {
        url: "https://abante-clothing.vercel.app/images/png/abante-clothing-white-logo.png", // Image shown on FB
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
    images: ["/images/png/abante-clothing-white-logo.png"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${metrapolis.variable} dark:bg-black-background relative`}
      >
        <ClientProvider>
          <NavbarLayout>
            <CartModalContent />
            <ToasterClient />
            {children}
          </NavbarLayout>
          <footer className="text-sm mx-auto max-w-[1980] p-4">
            <FooterSectionContent className="mt-25" styleName="md:pt-6" />
          </footer>
        </ClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
