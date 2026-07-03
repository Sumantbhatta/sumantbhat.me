import Image from "next/image";
import Link from "next/link";

const SPLIT_VIDEO_SRC = "/images/international_projects.mp4"; // TODO: Drop your custom video file here

export default function SplitSection() {
  return (
    <section
      className="relative overflow-hidden container custom-grid min-h-[80dvh] md:min-h-screen pb-20 pt-0 -mt-[5dvh] md:-mt-[10dvh]"
      data-header-theme="dark"
    >
      {/* Left: text */}
      <div className="col-span-4 md:col-span-5 relative z-10 order-2 md:order-1">
        <div
          className="w-full h-full flex flex-col justify-center"
          data-scroll
          data-scroll-speed="-0.15"
        >
          {/* Display heading */}
          <div className="mb-8 md:mb-16">
            <h2
              className="display relative text-black mb-2"
              data-split="heading"
              data-split-reveal="chars"
            >
              More
            </h2>
            <h3
              className="display-cursive relative ml-8 md:ml-20 -mt-6 md:-mt-12 whitespace-nowrap text-black"
              data-split="heading"
              data-split-reveal="chars"
            >
              Projects
            </h3>
          </div>

          {/* Body copy */}
          <p
            className="regular text-black max-w-md md:ml-20 mb-8"
            data-split="heading"
            data-split-reveal="lines"
          >
            There's more where that came from. Browse all my work — mobile apps, web platforms, fullstack tools, and everything in between.
          </p>

          {/* CTA */}
          <span className="md:ml-20" data-reveal-group="scroll" data-delay="0">
            <Link
              href="/projects"
              data-underline-link="alt"
              className="button-hover group relative inline-flex items-center label text-inherit mb-2 cursor-pointer"
            >
              <div className="relative overflow-hidden inline-flex items-center">
                <span aria-hidden="true" className="button-icon-sweep">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 8">
                    <g stroke="currentColor" strokeWidth=".75">
                      <path d="m14.931 7.652 3.733-3.733L14.931.187M18.664 3.92H0" />
                    </g>
                  </svg>
                </span>
                <span className="button-text">View All Projects</span>
                <span aria-hidden="true" className="button-icon-default">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 19 8">
                    <g stroke="currentColor" strokeWidth=".75">
                      <path d="m14.931 7.652 3.733-3.733L14.931.187M18.664 3.92H0" />
                    </g>
                  </svg>
                </span>
              </div>
            </Link>
          </span>
        </div>
      </div>

      {/* Right: video */}
      <div className="col-span-4 md:col-start-7 md:col-span-6 lg:col-span-7 relative z-0 overflow-hidden order-1 md:order-2 min-h-80 md:min-h-[120dvh]">
        <div
          className="media-wrapper w-full h-full relative overflow-hidden parallax-height"
          data-scroll
          data-scroll-speed="-0.5"
          style={{ willChange: "transform" }}
        >
          <video
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={SPLIT_VIDEO_SRC} type="video/mp4" />
          </video>
        </div>
      </div>


    </section>
  );
}
