'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920',
    title: 'NEW SEASON',
    subtitle: 'COLLECTION 2024',
    description: 'Discover the latest trends in streetwear fashion',
    cta: 'Shop Now',
    link: '/shop',
  },
  {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
    title: "MEN'S",
    subtitle: 'ESSENTIALS',
    description: 'Premium quality clothing for the modern man',
    cta: 'Shop Men',
    link: '/shop?category=men',
  },
  {
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920',
    title: "WOMEN'S",
    subtitle: 'STYLE',
    description: 'Elevate your wardrobe with our curated collection',
    cta: 'Shop Women',
    link: '/shop?category=women',
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative h-[85vh] md:h-[90vh] bg-black overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white max-w-xl"
          >
            <p className="text-sm md:text-base tracking-[0.3em] mb-4 text-white/80">
              {slides[currentSlide].subtitle}
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-md">
              {slides[currentSlide].description}
            </p>
            <Link href={slides[currentSlide].link}>
              <Button className="bg-white text-black hover:bg-neutral-200 px-8 py-6 text-sm tracking-widest font-semibold">
                {slides[currentSlide].cta}
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          &lt;
        </button>
        <div className="flex gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentSlide === idx ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="p-2 text-white/60 hover:text-white transition-colors"
        >
          &gt;
        </button>
      </div>
    </section>
  );
}
