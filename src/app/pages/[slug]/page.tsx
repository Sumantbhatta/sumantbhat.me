import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";

interface PageData {
  title: string;
  description: string;
  body: React.ReactNode;
  headerTheme: "light" | "dark";
  imageSrc?: string;
}

const PAGES: Record<string, PageData> = {
  about: {
    title: "About | Sumanth's Caviar",
    description:
      "Founded in New York City, Sumanth's Caviar sources exceptional caviar from world-class producers around the globe.",
    headerTheme: "dark",
    imageSrc: "/images/shop/files/about_image_casp4173.png",
    body: (
      <>
        <section
          className="relative overflow-hidden container custom-grid min-h-dvh pt-16 pb-4"
          data-header-theme="dark"
        >
          <div className="col-span-4 md:col-span-5 relative z-10 order-2 md:order-1">
            <div className="w-full h-full flex flex-col justify-end pb-4">
              <h2
                className="medium mb-4"
                data-split="heading"
                data-split-reveal="lines"
                data-split-type="load"
                data-split-delay="1"
              >
                About Sumanth's
              </h2>
              <p
                className="regular text-black max-w-md"
                data-split="heading"
                data-split-reveal="lines"
                data-split-type="load"
                data-split-delay="1.4"
              >
                Caviar is one of the world's oldest delicacies, but its future belongs to
                those who honor its heritage while shaping its place in modern culture.
                Founded in New York City, Sumanth's sources exceptional caviar from
                world-class producers and presents it in a way that feels refined, yet
                approachable. We work with carefully selected farms around the globe—
                prioritizing pristine waters, ethical aquaculture, and generational
                expertise. From Polish-raised Siberian Sturgeon to American White Sturgeon
                from Idaho and Ossetra from Madagascar, each tin reflects a distinct
                place, ecosystem, and craft. Like wine, watches, and fashion, we believe
                caviar should evolve with each generation—remaining a ritual worth
                repeating, wherever it's enjoyed.
              </p>
            </div>
          </div>
          <div className="col-span-4 md:col-start-7 md:col-span-6 lg:col-span-7 relative z-0 overflow-hidden order-1 md:order-2 h-80 md:h-full">
            <div
              className="media-wrapper w-full h-full relative overflow-hidden parallax-height"
              data-scroll
              data-scroll-speed="-0.5"
              style={{ willChange: "transform" }}
            >
              <Image
                src="/images/shop/files/about_image_casp4173.png"
                alt="About Sumanth's Caviar"
                fill
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Floating badge */}
          <div
            data-reveal-group="load"
            data-delay="1"
            className="absolute top-1/3 md:top-24 left-1/2 md:left-2/5 -translate-x-1/2 -translate-y-1/2 md:translate-y-0 md:-translate-x-2/5 z-20 w-20 md:w-44 aspect-square hidden sm:flex items-center justify-center"
          >
            <div className="w-full h-full">
              <div className="flex-none skew-x-[0.525deg] w-full h-full">
                <Image
                  src="/images/shop/files/Asset_6f6a5.svg"
                  alt="CC logo mark"
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </section>
      </>
    ),
  },
  sourcing: {
    title: "Sourcing | Sumanth's Caviar",
    description:
      "Our caviar is sourced globally from regions known for pristine waters and responsible practices.",
    headerTheme: "dark",
    body: (
      <section
        className="relative w-full pt-20 md:pt-[10.5rem] pb-12 overflow-hidden"
        data-header-theme="dark"
      >
        <div className="custom-grid container gap-y-6">
          <h1
            className="heading text-center mb-6 col-span-full"
            data-split="heading"
            data-split-reveal="chars"
          >
            Our Global Sources
          </h1>
          <p
            className="regular text-center max-w-md mx-auto mb-12 md:mb-20 col-span-full"
            data-split="heading"
            data-split-reveal="lines"
            data-split-delay="0.3"
          >
            Our caviar is sourced globally from regions known for pristine waters and
            responsible practices, chosen for quality you can taste.
          </p>

          {/* Source cards */}
          {[
            {
              label: "USA",
              videoId: "257286a9e4204be5b5e50295206eef2b",
              fileName: "257286a9e4204be5b5e50295206eef2b.HD-1080p-7.2Mbps-66400011a4f0.mp4",
            },
            {
              label: "POL",
              videoId: "7e8e88c4d58a4d7586b9bd15e839529b",
              fileName: "7e8e88c4d58a4d7586b9bd15e839529b.HD-1080p-7.2Mbps-66400012a4f0.mp4",
            },
            {
              label: "MDG",
              videoId: "6a90ce866a924580bbcda229f19709ca",
              fileName: "6a90ce866a924580bbcda229f19709ca.HD-1080p-7.2Mbps-66543550a4f0.mp4",
            },
          ].map(({ label, videoId, fileName }) => (
            <div
              key={label}
              className="relative aspect-[4/5] overflow-hidden block col-span-4 md:col-span-4"
              data-reveal-group
              data-stagger="100"
              data-sourcing-card
            >
              <div className="absolute inset-0 w-full h-full">
                <div
                  className="media-wrapper w-full h-full relative overflow-hidden parallax-height"
                  data-scroll
                  data-scroll-speed="-0.25"
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
                    <source
                      src={`/videos/shop/videos/c/vp/${videoId}/${fileName}`}
                      type="video/mp4"
                    />
                  </video>
                </div>
                <div
                  className="absolute inset-0 pointer-events-none bg-black z-20"
                  style={{ opacity: 0.5 }}
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <span className="text-off-white label whitespace-nowrap text-center">
                      {label}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 44 38"
                    fill="none"
                    className="text-off-white w-12"
                  >
                    <path
                      d="M22 0.5C33.9454 0.5 43.5 8.84902 43.5 19C43.5 29.151 33.9454 37.5 22 37.5C10.0546 37.5 0.5 29.151 0.5 19C0.5 8.84902 10.0546 0.5 22 0.5Z"
                      stroke="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },
  contact: {
    title: "Contact | Sumanth's Caviar",
    description: "Get in touch with Sumanth's Caviar for inquiries, wholesale, and events.",
    headerTheme: "dark",
    imageSrc: "/images/shop/files/contac_tfish70dc.svg",
    body: (
      <section
        className="container pt-24 pb-20 min-h-screen"
        data-header-theme="dark"
      >
        <div className="custom-grid gap-y-12">
          <div className="col-span-4 md:col-span-5">
            <h1
              className="heading mb-8 text-black"
              data-split="heading"
              data-split-reveal="chars"
              data-split-type="load"
              data-split-delay="0.5"
            >
              Get in Touch
            </h1>
            <p
              className="regular text-black max-w-sm mb-12"
              data-split="heading"
              data-split-reveal="lines"
              data-split-type="load"
              data-split-delay="1"
            >
              For inquiries about wholesale, events, gifting, or general questions, we'd
              love to hear from you.
            </p>

            <ContactForm />
          </div>

          <div className="col-span-4 md:col-span-4 md:col-start-8 flex items-center justify-center">
            <Image
              src="/images/shop/files/contac_tfish70dc.svg"
              alt="Contact fish illustration"
              width={400}
              height={400}
              className="w-full max-w-sm"
            />
          </div>
        </div>
      </section>
    ),
  },
  "caviar-101": {
    title: "Caviar 101 | Sumanth's Caviar",
    description:
      "Everything you need to know about caviar — from how to taste it to how to store it.",
    headerTheme: "dark",
    body: (
      <section className="container pt-24 pb-20 min-h-screen" data-header-theme="dark">
        <div className="custom-grid gap-y-12">
          <div className="col-span-4 md:col-span-7">
            <h1
              className="heading mb-12 text-black"
              data-split="heading"
              data-split-reveal="chars"
              data-split-type="load"
              data-split-delay="0.5"
            >
              Caviar 101
            </h1>

            {[
              {
                q: "What is caviar?",
                a: "Caviar is salt-cured fish roe (eggs) from sturgeon. It is one of the world's most prized delicacies, treasured for its complex flavors ranging from buttery and briny to nutty and earthy.",
              },
              {
                q: "How should I eat caviar?",
                a: "Caviar is best enjoyed simply — served chilled on a mother-of-pearl spoon, on blinis with crème fraîche, or directly from the tin. Avoid metal spoons, which can alter the flavor.",
              },
              {
                q: "How do I store caviar?",
                a: "Store unopened caviar in the coldest part of your refrigerator (28–32°F). Once opened, consume within 2–3 days. Keep the tin sealed and on ice when serving.",
              },
              {
                q: "What size should I buy?",
                a: "For a solo tasting, 30–50g is ideal. For 2–4 people as an appetizer, 50–125g works well. Larger quantities are perfect for events and entertaining.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="border-b-2 border-dotted border-gray"
                data-accordion-status="not-active"
              >
                <div
                  className="flex justify-between items-center py-4 cursor-pointer label text-black"
                  data-accordion-toggle
                >
                  <span>{q}</span>
                  <span className="label text-gray accordion-plus transition-transform duration-[600ms]">
                    +
                  </span>
                </div>
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-[600ms] overflow-hidden accordion-body">
                  <div className="overflow-hidden min-h-0">
                    <div className="pb-4 regular text-black">
                      <p>{a}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-4 md:col-span-4 md:col-start-9">
            <div className="relative aspect-square h-auto w-full overflow-hidden sticky top-24">
              <Image
                src="/images/shop/files/FAQ_image9a9b.png"
                alt="Caviar 101"
                fill
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    ),
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) return { title: "Not Found" };
  return { title: page.title, description: page.description };
}

export default async function PageRoute({ params }: Props) {
  const { slug } = await params;
  const page = PAGES[slug];
  if (!page) notFound();
  return <>{page.body}</>;
}
