// src/components/shared/HeroSlider.tsx
'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
  {
    id: 1,
    title: "Khanqah Saifia",
    subtitle: "Path of Spiritual Enlightenment",
    description:
      "Discover the teachings of Tasawwuf and purify your heart through the guidance of Awliya Allah. Learn how to live with peace, purpose, and closeness to Allah.",
    image:
      "https://images.unsplash.com/photo-1526677504211-233c8477c61b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    buttonText: "Explore Teachings",
    buttonLink: "/courses",
  },
  {
    id: 2,
    title: "Islamic Knowledge for Every Heart",
    subtitle: "Authentic Education & Guidance",
    description:
      "Gain true Islamic understanding through authentic sources — Qur'an, Hadith, and the wisdom of scholars. Build your foundation of Deen with love and knowledge.",
    image:
      "https://images.unsplash.com/photo-1587617425953-9075d28b8c46?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    buttonText: "Start Learning",
    buttonLink: "/courses",
  },
  {
    id: 3,
    title: "Spiritual Connection & Community",
    subtitle: "Journey Towards Allah",
    description:
      "Join a community dedicated to remembrance, reflection, and righteous action. Walk the path of sincerity and spiritual awakening with fellow seekers of truth.",
    image:
      "https://images.unsplash.com/photo-1575751639353-e292e76daca3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170",
    buttonText: "Join the Community",
    buttonLink: "/community",
  },
];


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[50vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] w-full overflow-hidden bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentSlide ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background Image with Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
          
          {/* Content */}
          <div className="relative h-full flex items-center justify-center">
            <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
              <div className="text-center text-white max-w-4xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mb-4"
                >
                  <span className="text-lg sm:text-xl font-semibold text-blue-300">
                    {slide.subtitle}
                  </span>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-5 leading-tight"
                >
                  {slide.title}
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="text-sm sm:text-base md:text-lg mb-5 sm:mb-7 text-gray-200 max-w-2xl mx-auto leading-relaxed px-3"
                >
                  {slide.description}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-blue-600 text-white font-medium sm:font-semibold rounded-md sm:rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-sm md:text-base"
                    onClick={() => window.location.href = slide.buttonLink}
                  >
                    {slide.buttonText}
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 z-10 opacity-70"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all duration-200 z-10 opacity-70"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;