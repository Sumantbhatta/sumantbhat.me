import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProductByHandle } from "@/lib/data/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductByHandle(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.title} | Sumanth's Caviar`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductByHandle(slug);
  if (!product) notFound();

  return (
    <section
      className="text-black min-h-screen relative container pt-16 pb-4"
      data-section-id={`product-${product.handle}`}
      data-header-theme="dark"
    >
      <div className="custom-grid gap-y-8">
        {/* Desktop thumbnail column */}
        <div
          data-reveal-group="load"
          data-delay="1"
          className="hidden md:flex flex-col gap-1 md:col-span-1 h-fit"
          data-scroll
          data-scroll-speed="-0.8"
          data-scroll-offset="0, -80%"
        >
          {product.images.map((img, i) => (
            <div key={i}>
              <button
                type="button"
                className="w-full relative aspect-square bg-gray/40 overflow-hidden cursor-pointer hover:scale-[0.97] transition-transform duration-[600ms]"
                data-target-media-id={`media-${i}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            </div>
          ))}
        </div>

        {/* Image gallery */}
        <div
          data-reveal-group="load"
          data-delay="1"
          className="col-span-4 md:col-span-6 order-first md:order-none"
        >
          {/* Mobile slider */}
          <div className="md:hidden relative">
            <div
              className="product-slider flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-0"
              data-product-slider
            >
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="product-slide flex-none w-full snap-center"
                  data-slide-index={i}
                >
                  <div className="w-full relative h-[25rem] bg-gray/40 overflow-hidden">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4" data-slider-dots>
              {product.images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-2 h-2 rounded-full bg-gray/40 transition-colors duration-300"
                  data-slider-dot={i}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop stacked images */}
          <div className="hidden md:flex flex-col gap-4">
            {product.images.map((img, i) => (
              <div
                key={i}
                id={`media-${i}`}
                className="w-full relative h-[30rem] md:h-[90dvh] bg-gray/40 overflow-hidden"
                data-media-id={`media-${i}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product info + form */}
        <div className="col-span-4 md:col-span-5 h-fit py-4 order-2 md:sticky md:top-20 md:self-start">
          <div className="h-fit md:min-h-[85dvh] flex flex-col items-center justify-between gap-8">
            {/* Info */}
            <div className="flex flex-col justify-center py-4 text-center">
              <p
                data-split="heading"
                data-split-reveal="lines"
                data-split-type="load"
                data-split-delay="1"
                className="label text-gray mb-4"
              >
                {product.sourcingLabel}
              </p>
              <h1
                data-split="heading"
                data-split-reveal="chars"
                data-split-type="load"
                data-split-delay="1.5"
                className="heading text-center mb-8"
              >
                {product.title}
              </h1>

              <div className="regular mb-8 max-w-[16rem] mx-auto">
                <div className="relative mb-1">
                  <div
                    className="transition-all duration-[600ms] overflow-hidden"
                    data-description-content
                    data-truncated="true"
                    style={{ maxHeight: "3.6rem" }}
                    data-split="heading"
                    data-split-reveal="lines"
                    data-split-type="load"
                    data-split-delay="1.5"
                  >
                    <p>{product.description}</p>
                  </div>
                  <div
                    className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-off-white to-transparent pointer-events-none transition-opacity duration-[600ms]"
                    data-description-gradient
                  />
                </div>
                <button
                  type="button"
                  className="regular text-gray cursor-pointer"
                  data-description-toggle
                  data-read-more-text="Read more"
                  data-read-less-text="Read less"
                >
                  Read more
                </button>
              </div>

              <p className="label" data-product-price>
                {product.variants[0].displayPrice} USD
              </p>
            </div>

            {/* Variant selector (static) */}
            <div
              data-reveal-group="load"
              data-delay="2.5"
              className="flex flex-col w-full gap-4"
            >
              <p className="label text-center text-gray mb-2">Select size</p>
              <div className="grid grid-cols-5 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    className="border border-dotted border-gray py-2 label text-black hover:bg-black hover:text-off-white transition-colors duration-300"
                  >
                    {v.title}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-black text-off-white label transition-colors duration-300 hover:bg-brown mt-4"
              >
                Add to Cart — {product.variants[0].displayPrice}
              </button>

              <p className="label text-center text-gray text-[9px]">
                Free shipping on orders over $250
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
