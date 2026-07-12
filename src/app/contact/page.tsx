import { Metadata } from "next";
import BrokenKeyboard from "@/sections/BrokenKeyboard";
import PhysicsHero from "@/sections/PhysicsHero";

export const metadata: Metadata = {
  title: "Contact | Sumanth Bhat",
  description: "Get in touch with Sumanth Bhat for freelance development, web platforms, and mobile apps.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-32 pb-12 min-h-screen bg-black flex flex-col overflow-hidden">
      <div className="container relative z-10 flex flex-col items-start justify-start mb-4 md:mb-12 shrink-0 pt-4 md:pt-12">
        <PhysicsHero />
      </div>
      <div className="flex-grow relative z-20">
        <BrokenKeyboard />
      </div>
    </div>
  );
}
