import { Metadata } from "next";
import LifeStory from "@/sections/LifeStory";
import AboutTimeline from "@/sections/AboutTimeline";

export const metadata: Metadata = {
  title: "About — Sumanth Bhat",
  description:
    "The story behind the work. Scroll through Sumanth Bhat's life story — chapter by chapter.",
};

export default function AboutPage() {
  return (
    <>
      {/* Scroll-scrubbed life story — starts with cinematic black intro */}
      <LifeStory />

      {/* Career timeline */}
      <AboutTimeline />
    </>
  );
}

