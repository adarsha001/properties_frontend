import React, { useState, useEffect } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Animatedsliders = () => {
  const slides = [
    {
      url: '/assets/316.png',
      title: 'Find Your Dream Home',
      description: 'Browse listings of luxury apartments and family homes in top locations.',
      buttonText: 'Explore Now',
    },
    {
      url: '/assets/2014612456_1_1_180904_122005-w1920-h1279.jpg',
      title: 'Invest Smartly',
      description: 'Discover premium commercial and residential investment opportunities.',
      buttonText: 'Start Investing',
    },
    {
      url: '/assets/shops.jpg',
      title: 'Modern Living Spaces',
      description: 'Experience contemporary living in our newly built smart homes.',
      buttonText: 'View Listings',
    },
    {
      url: '/assets/whatsapp.jpeg',
      title: 'Modern Apartments',
      description: 'Live in comfort and style with our curated apartment listings.',
      buttonText: 'Browse Apartments',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="relative w-full pt-60 h-[400px]  md:h-[500px] lg:h-[600px] overflow-hidden group ">
      <div
        className="w-full h-full bg-cover bg-center transition-all duration-1000 ease-in-out"
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center px-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {slides[currentIndex].title}
            </h2>
            <p className="text-lg md:text-xl text-white mb-6">
              {slides[currentIndex].description}
            </p>
            <button className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors">
              {slides[currentIndex].buttonText}
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={goToPrevious}
        className="hidden md:block absolute left-5 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={goToNext}
        className="hidden md:block absolute right-5 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all"
      >
        <FiChevronRight size={24} />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentIndex === slideIndex ? 'bg-white w-6' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Animatedsliders;
