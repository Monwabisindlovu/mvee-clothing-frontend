'use client';

import React from 'react';
import Link from 'next/link';
import { createPageUrl } from '@/utils/index';
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="font-black text-3xl tracking-tighter mb-4">MVEE</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Premium streetwear and fashion for everyone. Quality meets style.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-neutral-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-neutral-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-neutral-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-sm tracking-widest mb-4">SHOP</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <Link
                  href={createPageUrl('Shop') + '?category=men'}
                  className="hover:text-white transition-colors"
                >
                  Men
                </Link>
              </li>
              <li>
                <Link
                  href={createPageUrl('Shop') + '?category=women'}
                  className="hover:text-white transition-colors"
                >
                  Women
                </Link>
              </li>
              <li>
                <Link
                  href={createPageUrl('Shop') + '?category=kids'}
                  className="hover:text-white transition-colors"
                >
                  Kids
                </Link>
              </li>
              <li>
                <Link href={createPageUrl('Shop')} className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="font-semibold text-sm tracking-widest mb-4">HELP</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Delivery Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm tracking-widest mb-4">CONTACT</h3>
            <ul className="space-y-3 text-sm text-neutral-400">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+27 XX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@mveeclothing.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>South Africa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} MVEE Clothing. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500">Pay on Delivery Available</p>
        </div>
      </div>
    </footer>
  );
}
