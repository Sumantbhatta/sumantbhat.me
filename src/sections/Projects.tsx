import Image from "next/image";
import Link from "next/link";
import { PROJECTS } from "@/lib/data/projects";
import ImageLightbox from "@/components/ImageLightbox";

const SECTION_ID = "home-featured-projects";
const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);

export default function Projects() {
  return (
    <section
      id={`featured-products-${SECTION_ID}`}
      className="pt-20 pb-0 container relative z-50"
      data-section-id={SECTION_ID}
      data-header-theme="dark"
    >
      <h2
        data-split="heading"
        data-split-reveal="words"
        className="heading text-center text-black mb-20"
      >
        Selected Work
      </h2>

      {/* ── MOBILE: simple grid ─────────────────────────── */}
      <div className="block md:hidden px-4">
        <div className="custom-grid gap-y-12">
          {FEATURED_PROJECTS.map((project, index) => (
            <div className="col-span-4 flex flex-col gap-4 mobile-project-reveal opacity-0" key={project.handle}>
              <article className="group relative">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block relative overflow-hidden bg-gray/10 rounded-none`}
                >
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={project.leftImage}
                      alt={project.title}
                      fill
                      priority={index === 0}
                      className="object-contain p-4"
                      unoptimized={project.leftImage.endsWith('.gif')}
                    />
                  </div>
                </a>
                <div className="flex items-center justify-between mt-4">
                  <h3 className="medium text-black">{project.title}</h3>
                  <p className="label text-gray px-2 py-1 bg-gray/10 rounded-full">{project.status}</p>
                </div>
                <p className="regular text-gray mt-2">{project.subtitle}</p>
              </article>

              {/* Stack the second image underneath for mobile */}
              <div className={`w-full aspect-[4/3] relative bg-gray/10 rounded-none overflow-hidden`}>
                <ImageLightbox src={project.rightImage} alt={`${project.title} Banner`} priority={index === 0} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP: sticky center info card + scroll rows ─ */}
      <div className="relative hidden md:block">
        <div className="flex flex-col gap-12">
          {/* Fixed overlay info card */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-30">
            <div
              className="relative h-[85dvh]"
              data-featured-product-pin
            >
              <div className="custom-grid h-full">
                <div className="col-start-5 col-span-4 flex items-center justify-center pointer-events-auto h-full relative z-40">
                  <div
                    id="real-info-card"
                    className="group bg-[#f2f2f2] custom-border border-2 transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] relative w-full h-full rounded-none overflow-hidden cursor-pointer"
                  >
                    {/* Hover Reveal Background (Visible normally, stays in morph) */}
                    <div className="absolute inset-0 bg-[#1c1c1c] scale-y-0 group-hover:scale-y-100 origin-bottom transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-0" />

                    {/* Invisible link covering the entire card */}
                    <a
                      id={`fixed-product-info-${SECTION_ID}`}
                      href={FEATURED_PROJECTS[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-40"
                      aria-label="Visit project site"
                    ></a>

                    {/* --- THE EXPLORE BUTTON (Fades in during SplitSection morph) --- */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] z-50 pointer-events-none group-[.morph-explore]:opacity-100 group-[.morph-explore]:scale-100 text-[#f4f4f5] mix-blend-difference">
                      <div className="flex flex-col items-center justify-center leading-[0.9] text-center">
                        <span className="font-title text-[28px] md:text-[34px] tracking-tight uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:tracking-[0.1em]">
                          View All
                        </span>
                        <span className="font-title text-[28px] md:text-[34px] tracking-tight uppercase transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:tracking-[0.1em]">
                          Projects
                        </span>
                      </div>
                    </div>

                    {/* --- THE ORIGINAL CONTENT (Fades out during SplitSection morph) --- */}
                    <div className="absolute inset-0 flex flex-col justify-between items-center text-center pt-8 pb-16 px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-[.morph-explore]:opacity-0 group-[.morph-explore]:scale-95 z-20 pointer-events-none">
                      {/* Status tag & App Link */}
                      <div className="relative flex items-center justify-center gap-2">
                        <div className="relative flex items-center justify-center px-4 py-1.5 border border-black/20 group-hover:border-white/20 rounded-lg transition-colors duration-300">
                          <span className="text-black label whitespace-nowrap z-10 transition-colors duration-300 group-hover:text-white">
                            <span id={`sourcing-tag-${SECTION_ID}`}>
                              {FEATURED_PROJECTS[0].status}
                            </span>
                          </span>
                        </div>

                        <a
                          id={`fixed-product-app-link-${SECTION_ID}`}
                          href={FEATURED_PROJECTS[0].appUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-white hover:text-black transition-colors duration-300 text-black group-hover:text-white ${!FEATURED_PROJECTS[0].appUrl ? 'hidden' : ''}`}
                          title="Download App"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="7 10 12 15 17 10"></polyline>
                            <line x1="12" y1="15" x2="12" y2="3"></line>
                          </svg>
                        </a>
                      </div>

                      {/* Title + Role */}
                      <div className="flex flex-col gap-2 relative">
                        <h3
                          id={`product-title-${SECTION_ID}`}
                          className="medium text-black transition-colors duration-300 group-hover:text-white text-3xl"
                        >
                          {FEATURED_PROJECTS[0].title}
                        </h3>
                        <p
                          id={`product-price-${SECTION_ID}`}
                          className="label text-black transition-colors duration-300 group-hover:text-white/80 uppercase tracking-widest"
                        >
                          {FEATURED_PROJECTS[0].role}
                        </p>
                      </div>

                      {/* Subtitle / CTA */}
                      <div className="relative w-full">
                        <p
                          id={`product-subtitle-${SECTION_ID}`}
                          className="regular text-black transition-opacity duration-300 group-hover:opacity-0 max-w-[80%] mx-auto"
                        >
                          {FEATURED_PROJECTS[0].subtitle}
                        </p>
                        
                        <span
                          className="regular absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-black opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:text-white"
                        >
                          Visit Live Site ↗
                        </span>
                      </div>
                    </div>

                    {/* ── Nav Buttons ── */}
                    <div className="absolute bottom-6 left-0 right-0 px-6 flex items-center justify-between z-50 group-[.morph-explore]:opacity-0 transition-opacity duration-500">
                      <button
                        id={`project-nav-prev-${SECTION_ID}`}
                        aria-label="Previous project"
                        data-project-nav="prev"
                        data-section-id={SECTION_ID}
                        className="flex items-center gap-1.5 regular text-black/40 hover:text-black group-hover:text-white/70 transition-colors duration-300 cursor-pointer select-none disabled:opacity-20"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Prev
                      </button>

                      <button
                        id={`project-nav-next-${SECTION_ID}`}
                        aria-label="Next project"
                        data-project-nav="next"
                        data-section-id={SECTION_ID}
                        className="flex items-center gap-1.5 regular text-black/40 hover:text-black group-hover:text-white/70 transition-colors duration-300 cursor-pointer select-none disabled:opacity-20"
                      >
                        Next
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product rows (scroll-driven) */}
          {FEATURED_PROJECTS.map((project, index) => (
            <div
              key={project.handle}
              className="product-row custom-grid min-h-[85dvh]"
              data-product-title={project.title}
              data-product-price={project.role}
              data-product-subtitle={project.subtitle}
              data-product-sourcing={project.status}
              data-product-url={project.url}
              data-product-app-url={project.appUrl || ""}
              data-section-id={SECTION_ID}
            >
              {/* Left: primary image/gif */}
              <div className={`col-span-4 relative z-10 group overflow-hidden bg-gray/10 h-full rounded-none flex items-center justify-center p-8`}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full h-full relative z-10"
                >
                  <Image
                    src={project.leftImage}
                    alt={project.title}
                    fill
                    priority={index === 0}
                    className="object-contain p-4 project-parallax-img scale-110"
                    unoptimized={project.leftImage.endsWith('.gif')}
                  />
                </a>
              </div>

              {/* Right: promotional banner - Exactly like left side! */}
              <div className={`col-start-9 col-span-4 relative z-10 group overflow-hidden bg-gray/10 h-full rounded-none flex items-center justify-center p-8`}>
                <div className="w-full h-full relative project-parallax-img scale-110">
                  <ImageLightbox src={project.rightImage} alt={`${project.title} Banner`} priority={index === 0} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
