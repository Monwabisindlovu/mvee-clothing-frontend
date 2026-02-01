'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  image: string;
  link: string;
}

interface Slide {
  title: string;
  description: string;
  image: string;
  link: string;
}

// Static categories
const categories: Category[] = [
  {
    id: '1',
    name: 'Men',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800',
    link: '/shop?category=men',
  },
  {
    id: '2',
    name: 'Women',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
    link: '/shop?category=women',
  },
];

// Static shoe slides
const shoeSlides: Slide[] = [
  {
    title: 'Men’s Formal Shoes',
    description: 'Sharp silhouettes crafted for confidence, power, and timeless style.',
    image: '/mens-formal-shoes.jpg',
    link: '/shop?category=men&subcategory=men-formal-shoes',
  },
  {
    title: 'Women’s Heels',
    description: 'Elegant heels designed to elevate every step, from day to night.',
    image: '/ladies-heels.webp',
    link: '/shop?category=women&subcategory=women-heels',
  },
];

export default function CategoryBanner() {
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1); // 1 = forward, -1 = backward

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActiveSlide(prev => (prev + 1) % shoeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 50) {
      setDirection(-1);
      setActiveSlide(prev => (prev - 1 + shoeSlides.length) % shoeSlides.length);
    } else if (info.offset.x < -50) {
      setDirection(1);
      setActiveSlide(prev => (prev + 1) % shoeSlides.length);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-neutral-500 mb-2">EXPLORE</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shop by Category</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Category cards */}
          {categories.map((category, idx) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={category.link}
                className="group block relative rounded-2xl overflow-hidden aspect-[3/4]"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                  <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                    {category.name}
                  </h3>
                  <span className="inline-flex items-center text-white text-sm tracking-wide group-hover:underline pointer-events-auto">
                    Shop Now →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Shoe slides */}
          <motion.div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
            <AnimatePresence custom={direction} mode="wait" initial={false}>
              <motion.div
                key={shoeSlides[activeSlide].title}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'tween', duration: 0.6 }}
                className="absolute inset-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
              >
                <Link href={shoeSlides[activeSlide].link} className="block w-full h-full relative">
                  <Image
                    src={shoeSlides[activeSlide].image}
                    alt={shoeSlides[activeSlide].title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                      {shoeSlides[activeSlide].title}
                    </h3>
                    <p className="text-white/90 text-sm mb-3">
                      {shoeSlides[activeSlide].description}
                    </p>
                    <span className="inline-flex items-center text-white text-sm tracking-wide group-hover:underline pointer-events-auto">
                      Shop Collection →
                    </span>
                  </div>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Slide navigation dots */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              {shoeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeSlide ? 1 : -1);
                    setActiveSlide(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition ${
                    activeSlide === idx ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
