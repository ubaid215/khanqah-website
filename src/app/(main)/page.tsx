'use client';

import Hero from '@/components/home/Hero';
import AboutSection from '@/components/home/AboutSection';
import PillarsSection from '@/components/home/PillarsSection';
import PrayerTimesSection from '@/components/home/PrayerTimesSection';
import CurriculumSection from '@/components/home/CurriculumSection';
import HadithSlider from '@/components/home/HadithSlider';
import CTASection from '@/components/home/CTASection';

const Homepage = () => {



  return (
    <div>

      {/* Hero Slider */}
      <Hero/>

      {/* About Section with Image on Left */}
      <AboutSection/>

      {/* Five Pillars of Islam Section */}
      <PillarsSection/>

      {/* Programs Section */}
      <CurriculumSection/>

      {/* Prayer Times Section */}
      <PrayerTimesSection/>

      {/* Gallery Section with Light Gradient and Animation */}
      <HadithSlider/>

      

      {/* CTA Section */}
      <CTASection/>
    </div>
  );
};

export default Homepage;