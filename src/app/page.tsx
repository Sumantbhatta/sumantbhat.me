import { Metadata } from "next";
import { cookies } from "next/headers";
import { HeroSection } from "@/components/Hero/HeroSection";
import Projects from "@/sections/Projects";
import SplitSection from "@/sections/SplitSection";
import AboutTimeline from "@/sections/AboutTimeline";

export const metadata: Metadata = {
  title: "Sumanth Bhat – Senior Fullstack & Mobile Developer",
  description:
    "Selected works and portfolio of Sumanth Bhat. Expert in React, Next.js, and Flutter.",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const hasSeenIntro = cookieStore.get("hero_intro_seen")?.value === "1";

  return (
    <>
      <h1 className="sr-only">Sumanth Bhat - Senior Fullstack & Mobile Developer</h1>
      <HeroSection hasSeenIntro={hasSeenIntro} />
      <Projects />
      <SplitSection />
      <AboutTimeline />
    </>
  );
}
