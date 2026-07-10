import { Metadata } from "next";
import BrokenKeyboard from "@/sections/BrokenKeyboard";

export const metadata: Metadata = {
  title: "Contact | Sumanth Bhat",
  description: "Get in touch with Sumanth Bhat for freelance development, web platforms, and mobile apps.",
};

export default function ContactPage() {
  return (
    <div className="pt-24 md:pt-32 pb-12 min-h-screen bg-black flex flex-col">
      <div className="container relative z-10 flex flex-col items-start justify-start mb-12 md:mb-20 shrink-0 pt-12 md:pt-24">
        <div className="relative flex flex-col md:flex-row items-end ml-4 md:ml-16">
          <span className="text-[6rem] md:text-[11rem] font-title uppercase tracking-tighter text-off-white select-none font-bold leading-[0.8] block">
            GET IN
          </span>
          <span className="text-[5rem] md:text-[10rem] font-script text-gray select-none relative z-10 md:-ml-[15%] md:-mb-[8%] leading-none -mt-8 md:mt-0">
            Touch
          </span>
        </div>
      </div>
      <div className="flex-grow relative">
        <BrokenKeyboard />
      </div>
    </div>
  );
}
