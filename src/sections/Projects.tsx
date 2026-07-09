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
      className="pt-20 pb-0 container"
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
      <div className="block md:hidden">
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
                <div className="col-start-5 col-span-4 pointer-events-auto h-full relative z-40">
                  <div
                    className="group flex flex-col justify-between items-center text-center custom-border border-2 bg-off-white hover:bg-black transition-colors duration-300 relative py-8 px-4 h-full rounded-none overflow-hidden"
                  >
                    {/* Invisible link covering the entire card */}
                    <a
                      id={`fixed-product-info-${SECTION_ID}`}
                      href={FEATURED_PROJECTS[0].url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10"
                      aria-label="Visit project site"
                    ></a>

                    {/* Status tag & App Link */}
                    <div className="relative flex items-center justify-center gap-2 z-20">
                      <div className="relative flex items-center justify-center px-4 py-1.5 border border-gray/20 group-hover:border-white/20 rounded-lg transition-colors duration-300">
                        <span className="text-gray label whitespace-nowrap z-10 transition-colors duration-300 group-hover:text-white">
                          <span id={`sourcing-tag-${SECTION_ID}`}>
                            {FEATURED_PROJECTS[0].status}
                          </span>
                        </span>
                      </div>

                      {/* App Link Button (Hidden if no appUrl) */}
                      <a
                        id={`fixed-product-app-link-${SECTION_ID}`}
                        href={FEATURED_PROJECTS[0].appUrl || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray/10 hover:bg-white hover:text-black transition-colors duration-300 text-gray ${!FEATURED_PROJECTS[0].appUrl ? 'hidden' : ''}`}
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
                    <div className="flex flex-col gap-2 relative z-20 pointer-events-none">
                      <h3
                        id={`product-title-${SECTION_ID}`}
                        className="medium text-black transition-colors duration-300 group-hover:text-white text-3xl"
                      >
                        {FEATURED_PROJECTS[0].title}
                      </h3>
                      <p
                        id={`product-price-${SECTION_ID}`}
                        className="label text-gray transition-colors duration-300 group-hover:text-white/80 uppercase tracking-widest"
                      >
                        {FEATURED_PROJECTS[0].role}
                      </p>
                    </div>

                    {/* Subtitle / CTA */}
                    <div className="relative w-full z-20 pointer-events-none">
                      <p
                        id={`product-subtitle-${SECTION_ID}`}
                        className="regular text-gray transition-opacity duration-300 group-hover:opacity-0 max-w-[80%] mx-auto"
                      >
                        {FEATURED_PROJECTS[0].subtitle}
                      </p>
                      
                      {/* Fake CTA that just shows on hover, but the whole card is the real link */}
                      <span
                        className="regular absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center text-gray opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-hover:text-white"
                      >
                        Visit Live Site ↗
                      </span>
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
