'use client';

import React from 'react';
import Link from 'next/link';
import { createPageUrl } from '@/utils/index';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800',
    link: 'Shop?category=men',
  },
  {
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
    link: 'Shop?category=women',
  },
  {
    name: 'Kids',
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800',
    link: 'Shop?category=kids',
  },
];

export default function CategoryBanner() {
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-neutral-500 mb-2">EXPLORE</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={createPageUrl(category.link)} className="group block relative">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center text-white text-sm tracking-wide group-hover:underline">
                    Shop Now →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
