// src/lib/data/products.ts

export interface ProductVariant {
  id: string;
  title: string;
  price: number; // in cents
  displayPrice: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  subtitle: string;
  description: string;
  sourcing: string;
  sourcingLabel: string;
  fromPrice: string;
  bgColor: string;
  variants: ProductVariant[];
  images: ProductImage[];
  hoverImage: string;
  closedImage: string;
  openImage: string;
  bgImage: string;
  lifestyleImage: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "10721453048081",
    handle: "white-sturgeon",
    title: "White Sturgeon",
    subtitle: "Silky, clean, and quietly luxurious.",
    description:
      "White Sturgeon caviar offers a bold yet refined expression of classic caviar tradition. Featuring firm, medium-to-large pearls in shades of charcoal and slate, it delivers a clean, buttery flavor with a touch of salinity and a smooth finish. Rich without being overpowering, White Sturgeon caviar is a modern staple—ideal for pairing with blinis, crème fraîche, or enjoyed simply on its own.",
    sourcing: "USA",
    sourcingLabel: "Idaho, USA",
    fromPrice: "From $135.00",
    bgColor: "bg-green-100",
    variants: [
      { id: "52850124226833", title: "50G", price: 13500, displayPrice: "$135.00" },
      { id: "52850124259601", title: "125G", price: 33500, displayPrice: "$335.00" },
      { id: "52850124292369", title: "250G", price: 66000, displayPrice: "$660.00" },
      { id: "52850124325137", title: "500G", price: 130000, displayPrice: "$1,300.00" },
      { id: "52850124357905", title: "1KG", price: 250000, displayPrice: "$2,500.00" },
    ],
    images: [
      {
        src: "/images/shop/files/Sumanths_Flat_Lay_White_Sturgeon_transparent_shadow8a9e.png",
        alt: "White Sturgeon",
      },
      {
        src: "/images/shop/files/Sumanths_Flat_Lay_White_Sturgeon_open_transparent_shadowec97.png",
        alt: "White Sturgeon Open",
      },
      {
        src: "/images/shop/files/Frame_4286cb9.png",
        alt: "White Sturgeon Lifestyle",
      },
      {
        src: "/images/shop/files/20260115_CAPSERS_SHOT_30_4x54x5_jpegs_1b81c.png",
        alt: "White Sturgeon Served",
      },
    ],
    hoverImage:
      "/images/shop/files/Sumanths_Flat_Lay_White_Sturgeon_open_transparent_shadow63a9.png",
    closedImage:
      "/images/shop/files/Sumanths_Flat_Lay_White_Sturgeon_transparent_shadow1bc7.png",
    openImage:
      "/images/shop/files/Sumanths_Flat_Lay_White_Sturgeon_open_transparent_shadow63a9.png",
    bgImage: "/images/shop/files/Sumanths_Background_greenb679.png",
    lifestyleImage:
      "/images/shop/files/20260115_CAPSERS_SHOT_27_4x54x5_jpegs_1fc62.png",
  },
  {
    id: "10724601594129",
    handle: "siberian-sturgeon",
    title: "Siberian Sturgeon",
    subtitle: "Bold, bright, and full of character.",
    description:
      "Siberian Sturgeon caviar is celebrated for its distinctive, full-bodied flavor profile. Medium-sized pearls with a dark hue deliver a bold, nutty taste with a pleasant brine finish. Sourced from the pristine waters of Poland, this caviar offers complexity and depth that makes it a favorite among connoisseurs and adventurous palates alike.",
    sourcing: "POL",
    sourcingLabel: "Poland",
    fromPrice: "From $130.00",
    bgColor: "bg-blue-100",
    variants: [
      { id: "52994899869969", title: "50G", price: 13000, displayPrice: "$130.00" },
      { id: "52994899902737", title: "125G", price: 32000, displayPrice: "$320.00" },
      { id: "52994899935505", title: "250G", price: 62500, displayPrice: "$625.00" },
      { id: "52994899968273", title: "500G", price: 120000, displayPrice: "$1,200.00" },
      { id: "52994900001041", title: "1KG", price: 230000, displayPrice: "$2,300.00" },
    ],
    images: [
      {
        src: "/images/shop/files/Sumanths_Flat_Lay_Siberian_Sturgeon_transparent_shadow849d.png",
        alt: "Siberian Sturgeon",
      },
      {
        src: "/images/shop/files/Sumanths_Flat_Lay_Siberian_Sturgeon_open_transparent_shadow1b57.png",
        alt: "Siberian Sturgeon Open",
      },
      {
        src: "/images/shop/files/20260115_CAPSERS_SHOT_21_4x54x5_jpegs_1027d.png",
        alt: "Siberian Sturgeon Lifestyle",
      },
      {
        src: "/images/shop/files/20260115_CAPSERS_SHOT_19_4x54x5_jpegs_175d3.png",
        alt: "Siberian Sturgeon Served",
      },
    ],
    hoverImage:
      "/images/shop/files/Sumanths_Flat_Lay_Siberian_Sturgeon_open_transparent_shadow3881.png",
    closedImage:
      "/images/shop/files/Sumanths_Flat_Lay_Siberian_Sturgeon_transparent_shadowf293.png",
    openImage:
      "/images/shop/files/Sumanths_Flat_Lay_Siberian_Sturgeon_open_transparent_shadow3881.png",
    bgImage: "/images/shop/files/Sumanths_Background_bluee2b3.png",
    lifestyleImage:
      "/images/shop/files/20260115_CAPSERS_SHOT_18_4x54x5_jpegs_1fca7.png",
  },
  {
    id: "10724601495825",
    handle: "ossetra",
    title: "Ossetra",
    subtitle: "Rich, warm, and naturally decadent.",
    description:
      "Ossetra caviar is one of the world's most prized varieties, known for its complex flavor profile that ranges from buttery and rich to subtly sweet and briny. Sourced from Madagascar's pristine aquaculture environments, these medium-to-large golden-brown pearls deliver an unforgettable eating experience with remarkable depth and a lingering finish.",
    sourcing: "MDG",
    sourcingLabel: "Madagascar",
    fromPrice: "From $150.00",
    bgColor: "bg-purple-100",
    variants: [
      { id: "52992299893009", title: "50G", price: 15000, displayPrice: "$150.00" },
      { id: "52992299925777", title: "125G", price: 37500, displayPrice: "$375.00" },
      { id: "52992299958545", title: "250G", price: 75000, displayPrice: "$750.00" },
      { id: "52992299991313", title: "500G", price: 150000, displayPrice: "$1,500.00" },
      { id: "52992300024081", title: "1KG", price: 300000, displayPrice: "$3,000.00" },
    ],
    images: [
      {
        src: "/images/shop/files/Sumanths_Flat_Lay_Ossetra_transparent_shadow849d.png",
        alt: "Ossetra",
      },
      {
        src: "/images/shop/files/Sumanths_Flat_Lay_Ossetra_open_transparent_shadow1b57.png",
        alt: "Ossetra Open",
      },
      {
        src: "/images/shop/files/20260115_CAPSERS_SHOT_29_4x54x5_jpegs_1c07d.png",
        alt: "Ossetra Lifestyle",
      },
      {
        src: "/images/shop/files/20260115_CAPSERS_SHOT_05_4x54x5_jpegs_1604b.png",
        alt: "Ossetra Served",
      },
    ],
    hoverImage:
      "/images/shop/files/Sumanths_Flat_Lay_Ossetra_open_transparent_shadow3881.png",
    closedImage:
      "/images/shop/files/Sumanths_Flat_Lay_Ossetra_transparent_shadowf293.png",
    openImage:
      "/images/shop/files/Sumanths_Flat_Lay_Ossetra_open_transparent_shadow3881.png",
    bgImage: "/images/shop/files/Sumanths_Background_purple6cfc.png",
    lifestyleImage:
      "/images/shop/files/20260115_CAPSERS_SHOT_23_4x54x5_jpegs_1b339.png",
  },
];

export function getProductByHandle(handle: string): Product | undefined {
  return PRODUCTS.find((p) => p.handle === handle);
}
