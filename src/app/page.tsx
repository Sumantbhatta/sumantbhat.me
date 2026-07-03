import { Metadata } from "next";
import { HeroSection } from "@/components/Hero/HeroSection";
import Projects from "@/sections/Projects";
import SplitSection from "@/sections/SplitSection";
import AboutTimeline from "@/sections/AboutTimeline";

export const metadata: Metadata = {
  title: "Sumanth Bhat – Portfolio",
  description:
    "Selected works and portfolio of Sumanth Bhat.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Projects />
      <SplitSection />
      <AboutTimeline />
    </>
  );
}


