import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Direct URL imports (since we know these work)
import image1 from './assets/WhatsApp Image 2025-07-24 at 8.48.39 PM.jpeg';
import image2 from './assets/WhatsApp Image 2025-07-24 at 8.38.50 PM.jpeg';
import image3 from './assets/WhatsApp Image 2025-07-24 at 9.06.41 PM.jpeg';
import image4 from './assets/WhatsApp Image 2025-07-24 at 8.48.39 PM.jpeg';

const Animatedsliders = () => {
 const slides = [
    {
      url: image1,
      title: 'Find Your Dream Home',
      description: 'Browse listings of luxury apartments and family homes in top locations.',
      buttonText: 'Explore Now',
    },
    {
      url: image2,
      title: 'Invest Smartly',
      description: 'Discover premium commercial and residential investment opportunities.',
      buttonText: 'Start Investing',
    },
    {
      url: image3,
      title: 'Modern Living Spaces',
      description: 'Experience contemporary living in our newly built smart homes.',
      buttonText: 'View Listings',
    },
    {
      url: image4,
      title: 'Modern Apartments',
      description: 'Live in comfort and style with our curated apartment listings.',
      buttonText: 'Browse Apartments',
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* MAIN IMAGE CONTAINER - SIMPLIFIED */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <img
            key={index}
            src={slide.url}
            alt={slide.title}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              currentIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>

      {/* OVERLAY CONTENT */}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-3xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {slides[currentIndex].title}
          </h2>
          <p className="text-lg md:text-xl mb-6">{slides[currentIndex].description}</p>
          <button className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg transition-colors">
            {slides[currentIndex].buttonText}
          </button>
        </div>
      </div>

      {/* NAVIGATION ARROWS */}
      <button
        onClick={() => setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1))}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-all"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={() => setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1))}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-all"
      >
        <FiChevronRight size={24} />
      </button>

      {/* DOTS INDICATOR */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === index ? 'bg-white w-6' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Animatedsliders;

