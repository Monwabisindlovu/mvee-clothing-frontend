import Link from 'next/link';
import { STORE_NAME, CATEGORIES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{STORE_NAME}.</h3>
            <p className="text-stone-400 text-sm">
              Your one-stop shop for trendy fashion. Quality clothing delivered to your doorstep.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-white">Shop</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map(cat => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.id}`}
                    className="text-stone-400 hover:text-blue-500 transition-colors duration-300 hover:underline hover:underline-offset-4"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/shop"
                  className="text-stone-400 hover:text-blue-500 transition-colors duration-300 hover:underline hover:underline-offset-4"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-stone-400 hover:text-blue-500 transition-colors duration-300 hover:underline hover:underline-offset-4"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4 text-white">Contact</h4>
            <p className="text-sm text-stone-400">
              Questions? Reach out via WhatsApp
              <br />
              Payment on delivery available
            </p>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-8 pt-8 text-center text-sm text-stone-400">
          © {new Date().getFullYear()} {STORE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
