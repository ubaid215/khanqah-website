'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1280&h=460&fit=crop',
      title: 'Transform Your Future',
      subtitle: 'Learn Skills That Matter',
      description: 'Join thousands of students mastering cutting-edge technologies',
      cta: 'Start Learning',
      ctaLink: '/courses',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1280&h=460&fit=crop',
      title: 'Expert-Led Courses',
      subtitle: 'Industry Professionals',
      description: 'Learn from the best instructors in the field',
      cta: 'View Courses',
      ctaLink: '/courses',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1280&h=460&fit=crop',
      title: 'Build Your Career',
      subtitle: 'Real-World Projects',
      description: 'Get hands-on experience with practical projects',
      cta: 'Get Started',
      ctaLink: '/about',
    },
  ];

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isPaused, slides.length]);

  const goToSlide = (index: SetStateAction<number>) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div 
      className="relative w-full overflow-hidden bg-gray-900 min-h-[300px] sm:min-h-[350px] md:min-h-[400px]"
      style={{ aspectRatio: '16/9', maxHeight: '460px' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover object-center"
            />
            {/* Overlay - Stronger on mobile for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40 sm:from-black/70 sm:via-black/50 sm:to-transparent" />
          </div>

          {/* Content */}
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-full sm:max-w-2xl">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="inline-block px-3 py-1 sm:px-4 sm:py-1 bg-blue-600/90 text-white text-[10px] xs:text-xs sm:text-sm font-semibold rounded-full mb-2 sm:mb-3 md:mb-4">
                  {slides[currentSlide].subtitle}
                </span>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 sm:mb-6 md:mb-8 line-clamp-2 sm:line-clamp-none"
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <motion.a
                  href={slides[currentSlide].ctaLink}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 xs:px-5 xs:py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-blue-600 text-white text-xs xs:text-sm sm:text-base font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  {slides[currentSlide].cta}
                  <Play className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5" />
                </motion.a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 md:p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full transition-all duration-200 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 md:p-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-full transition-all duration-200 z-10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 sm:h-2 md:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? 'bg-white w-6 sm:w-8 md:w-12'
                : 'bg-white/50 hover:bg-white/75 w-1.5 sm:w-2 md:w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;