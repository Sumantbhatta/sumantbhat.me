import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { PRODUCTS } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop All | Sumanth's Caviar",
  description:
    "Explore our full collection of premium caviar, sourced globally and chosen for purity, balance, and unforgettable flavor.",
};

const COLLECTION_VIDEO_ID = "b0c92a10f7774c25b491fa1915f430a4";
const COLLECTION_VIDEO_SRC = `/videos/shop/videos/c/vp/${COLLECTION_VIDEO_ID}/${COLLECTION_VIDEO_ID}.HD-1080p-7.2Mbps-64743791a4f0.mp4`;

export default function CollectionPage() {
  return (
    <>
      {/* Hero banner */}
      <section
        className="relative min-h-[56rem] md:min-h-[80dvh] overflow-hidden text-off-white"
        data-header-theme="light"
      >
        <div className="absolute inset-0 z-0 overflow-hidden">
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
              <source src={COLLECTION_VIDEO_SRC} type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-black" style={{ opacity: 0.5 }} />
        </div>

        <div className="relative z-10 min-h-[56rem] md:min-h-[80dvh] flex flex-col container py-4">
          <div className="grow" />
          <div className="pb-4">
            <h1
              data-split="heading"
              data-split-reveal="words"
              data-split-type="load"
              className="heading mb-4"
            >
              Shop All
            </h1>
            <div className="max-w-md">
              <div
                data-split="heading"
                data-split-reveal="lines"
                data-split-type="load"
                className="regular"
              >
                Explore our full collection of premium caviar, sourced globally and chosen
                for purity, balance, and unforgettable flavor.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section
        className="relative py-12 md:py-20 text-black"
        data-header-theme="dark"
      >
        <div className="container">
          {/* Header bar */}
          <div
            data-reveal-group="scroll"
            className="flex flex-row items-center justify-between gap-4 mb-8 md:mb-12 pb-4 custom-border border-b"
          >
            <div className="flex items-center gap-8">
              <p className="label text-gray">3 products</p>
            </div>
            <div className="flex items-center gap-4">
              <label className="label text-gray hidden md:block">Sort by</label>
              <select className="label bg-transparent border-none text-black focus:outline-none cursor-pointer">
                <option value="best-selling">Best selling</option>
                <option value="price-ascending">Price, low to high</option>
                <option value="price-descending">Price, high to low</option>
              </select>
            </div>
          </div>

          {/* Product grid */}
          <div
            data-reveal-group="scroll"
            data-stagger="150"
            className="custom-grid gap-y-12 mb-16"
          >
            {PRODUCTS.map((product) => (
              <div className="col-span-4" key={product.handle}>
                <article className="group relative">
                  <Link
                    href={`/products/${product.handle}`}
                    className="block relative overflow-hidden mb-1 md:mb-2 bg-gray/20"
                  >
                    <div className="aspect-3/4 relative">
                      <Image
                        src={product.closedImage}
                        alt={product.title}
                        fill
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                      />
                      <Image
                        src={product.hoverImage}
                        alt={product.title}
                        fill
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      />
                    </div>
                  </Link>
                  <div className="flex items-center justify-between">
                    <h3 className="regular text-black">{product.title}</h3>
                    <p className="label text-black">{product.fromPrice}</p>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
