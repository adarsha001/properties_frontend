import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

// Direct URL imports
import image1 from './assets/WhatsApp Image 2025-07-24 at 8.48.39 PM.jpeg';
import image2 from './assets/WhatsApp Image 2025-07-24 at 8.38.50 PM.jpeg';
import image3 from './assets/WhatsApp Image 2025-07-24 at 9.06.41 PM.jpeg';
import image4 from './assets/WhatsApp Image 2025-07-24 at 9.14.59 PM.jpeg';

const DetailView = ({ slide, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-700 hover:text-black z-10"
        >
          <FiX size={24} />
        </button>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 md:h-full">
            <img 
              src={slide.url} 
              alt={slide.title} 
              className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            />
          </div>
          
          <div className="p-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800">{slide.title}</h2>
            <p className="text-gray-600 mb-6">{slide.description}</p>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>Premium location with great views</li>
                <li>Modern architecture and design</li>
                <li>High-quality construction materials</li>
                <li>Smart home technology included</li>
              </ul>
            </div>
            
            <button className="mt-8 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Contact Agent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnimatedSlider = () => {
  const slides = [
    {
      url: image1,
      title: 'Find Your Dream Home',
      description: 'Browse listings of luxury apartments and family homes in top locations. Our properties feature modern amenities, spacious layouts, and prime locations to suit your lifestyle needs.',
      buttonText: 'Explore Now',
    },
    {
      url: image2,
      title: 'Invest Smartly',
      description: 'Discover premium commercial and residential investment opportunities with high ROI potential. We provide comprehensive market analysis and investment strategies.',
      buttonText: 'Start Investing',
    },
    {
      url: image3,
      title: 'Modern Living Spaces',
      description: 'Experience contemporary living in our newly built smart homes equipped with the latest technology for comfort, security and energy efficiency.',
      buttonText: 'View Listings',
    },
    {
      url: image4,
      title: 'Secure land, secure future',
      description: 'Prime land parcels available for development or long-term investment. Strategically located with excellent growth potential and all necessary utilities.',
      buttonText: 'Browse Plots',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleButtonClick = () => {
    setSelectedSlide(slides[currentIndex]);
    setShowDetail(true);
  };

  return (
    <>
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {/* MAIN IMAGE CONTAINER */}
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
            <p className="text-lg md:text-xl mb-8">{slides[currentIndex].description}</p>
            <button 
              onClick={handleButtonClick}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
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

      {/* DETAIL VIEW MODAL */}
      {showDetail && (
        <DetailView 
          slide={selectedSlide} 
          onClose={() => setShowDetail(false)} 
        />
      )}
    </>
  );
};

export default AnimatedSlider;