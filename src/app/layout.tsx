import type { Metadata } from "next";
import Script from "next/script";
import "@/styles/globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimationBootstrap from "@/components/AnimationBootstrap";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://sumanthbhat.me"),
  title: "Sumanth's Caviar – Premium Caviar, Sourced Globally",
  description:
    "Sumanth's Caviar sources exceptional caviar from world-class producers across the globe. Shop White Sturgeon, Siberian Sturgeon, and Ossetra caviar online.",
  openGraph: {
    title: "Sumanth's Caviar",
    description:
      "Premium caviar sourced from pristine waters worldwide. Experience the finest caviar from Idaho, Poland, and Madagascar.",
    images: ["/images/shop/files/sumanth_112547.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Adobe Typekit – interstate, interstate-condensed, sloop-script-one */}
        <link rel="stylesheet" href="https://use.typekit.net/tta7oiv.css" />
        {/* Google Fonts – Lexend Giga */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Lexend+Giga&display=swap" />
      </head>
      <body id="top">
        {/* GSAP core + free plugins (npm) loaded via Script */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
        {/* GSAP Club plugins – loaded from local copies */}
        <Script src="/vendor/SplitText.min.js" strategy="beforeInteractive" />
        <Script src="/vendor/Flip.min.js" strategy="beforeInteractive" />

        <CustomCursor />
        <Navigation />
        <main>{children}</main>
        <Footer />

        {/* Bootstrap all GSAP animations after page load */}
        <AnimationBootstrap />
      </body>
    </html>
  );
}
