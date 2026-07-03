import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | Sumanth's Caviar",
  description: "Your Sumanth's Caviar cart.",
};

export default function CartPage() {
  return (
    <section className="container pt-24 pb-20 min-h-screen" data-header-theme="dark">
      <div className="custom-grid gap-y-12">
        <div className="col-span-4 md:col-span-7">
          <h1 className="heading mb-12 text-black">Your Cart</h1>
          <div className="border-b-2 border-dotted border-gray pb-8 mb-8">
            <p className="regular text-gray">Your cart is empty.</p>
          </div>
          <a
            href="/collections/all"
            className="label text-black border border-dotted border-black px-6 py-3 hover:bg-black hover:text-off-white transition-colors duration-300 inline-block"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </section>
  );
}
