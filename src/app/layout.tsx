import type { Metadata } from "next";
import Script from "next/script";
import { Lexend_Giga } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

const lexendGiga = Lexend_Giga({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});
import "@/styles/globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimationBootstrap from "@/components/AnimationBootstrap";
import { CustomCursor } from "@/components/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://sumanthbhat.me"),
  title: "Sumanth Bhat — Fullstack & Mobile Developer",
  description:
    "Portfolio of Sumanth Bhat, an award-winning Fullstack & Mobile Developer crafting premium web experiences and scalable mobile apps.",
  keywords: [
    "Sumanth Bhat", "Sumant Bhat", "Sumant", "Sumanth", "Bhat", 
    "Software Engineer", "Fullstack Developer", "Mobile Developer",
    "React Developer", "Next.js", "Flutter", "Freelance Developer"
  ],
  authors: [{ name: "Sumanth Bhat" }],
  openGraph: {
    title: "Sumanth Bhat — Developer Portfolio",
    description:
      "Crafting premium digital experiences, mobile applications, and fullstack platforms.",
    images: ["/images/projects/banner/sumanth_og.png"],
  },
  icons: {
    icon: '/images/webicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={lexendGiga.variable}>
      <head>
        {/* Google Fonts – Lexend Giga */}
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://use.typekit.net/tta7oiv.css" />
        
        {/* LCP Preload for Hero Image */}
        <link rel="preload" href="/images/hero/1.png" as="image" />

        {/* JSON-LD Structured Data for AEO / GEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://sumanthbhat.me/#person",
                  "name": "Sumanth Bhat",
                  "alternateName": ["Sumant Bhat", "Sumanth", "Sumant", "Bhat"],
                  "url": "https://sumanthbhat.me",
                  "jobTitle": "Fullstack & Mobile Developer",
                  "description": "Award-winning Fullstack and Mobile Developer specializing in React, Next.js, and Flutter.",
                  "knowsAbout": ["Web Development", "Mobile App Development", "Frontend Engineering", "React", "Next.js", "Flutter"],
                  "sameAs": [
                    "https://www.linkedin.com/in/sumantsbhat/",
                    "https://github.com/Sumantbhatta",
                    "https://www.instagram.com/sumantbhat_/"
                  ]
                },
                {
                  "@type": "WebSite",
                  "@id": "https://sumanthbhat.me/#website",
                  "url": "https://sumanthbhat.me",
                  "name": "Sumanth Bhat - Developer Portfolio",
                  "publisher": {
                    "@id": "https://sumanthbhat.me/#person"
                  }
                }
              ]
            })
          }}
        />
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
        <Analytics />
      </body>
    </html>
  );
}
