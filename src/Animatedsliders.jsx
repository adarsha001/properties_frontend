import React, { useState, useEffect, Suspense } from 'react';
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

// // Optimized image imports (convert to WebP if possible)
// import ssdkammasandra from './assets/images/ssdkammasandra.webp';
// import urbanFeet from './assets/images/uf.webp';
// import rkbEnclave from './assets/images/rkb.webp';
// import sunriseMeadows from './assets/images/sunrise.webp';
// import saiSamrudhi from './assets/images/saisamrudhi.webp';
// import ssdGunduru from './assets/images/ssdgundur.webp';
// import avalahalli from './assets/images/hirandali.webp';
// import mandur from './assets/images/mandur-community.webp';

// Import all images from assets
import ssdkammasandra from './assets/images/ssdkammasandra.webp';
import urbanFeet from './assets/images/uf.JPG';
import rkbEnclave from './assets/images/rkb.webp';
import sunriseMeadows from './assets/images/sunrise.JPG';
import saiSamrudhi from './assets/images/saisamrudhi.webp';
import ssdGunduru from './assets/images/ssdgundur.webp';
import avalahalli from './assets/images/hirandali.JPG';
import mandur from './assets/images/mandur-community.jpeg'; // Fixed filename



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
              src={slide.image || slide.url} 
              alt={slide.title} 
              width="800"
              height="600"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            />
          </div>
          
          <div className="p-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{slide.title}</h2>
            <p className="text-gray-600 font-medium mb-1">{slide.location}</p>
            <p className="text-gray-600 mb-4">{slide.description}</p>
            
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                slide.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                slide.status === 'Ongoing' ? 'bg-blue-100 text-blue-800' : 
                'bg-yellow-100 text-yellow-800'
              }`}>
                {slide.status}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">{slide.details}</p>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">Features</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                {slide.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <a href="tel:+918951706247" className="block w-full">
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                  Contact Sales Representative
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnimatedSlider = () => {
  const projects = [
    {
      id: 8,
      title: "Sri Sai Dwaraka Gunduru",
      location: "Gunduru, Near Budigere Cross",
      image: ssdGunduru,
      description: "Premium E-Khata gated community with excellent connectivity near Airport Road",
      status: "Ongoing",
      buttonText: "View Project",
      features: [
        "CC Roads with underground drainage",
        "Building Approval for G+3",
        "Near Brigade Signature Tower",
        "5 mins from ORION Mall"
      ]
    },
    {
      id: 9,
      title: "Avalahalli Gated Community",
      location: "Avalahalli, Near NH-75",
      image: avalahalli,
      description: "Premier E-Khata community with direct access to Airport Parallel Road",
      status: "Ongoing",
      buttonText: "Explore Plots",
      features: [
        "Wide TAR Roads",
        "G+3 Building Permission",
        "15 mins from Old Madras Road",
        "Underground utilities"
      ]
    },
    {
      id: 10,
      title: "Mandur Gated Community",
      location: "Mandur, Budigere Cross",
      image: mandur,
      description: "Premium investment plots in Bangalore's fastest-growing corridor",
      status: "Ongoing",
      buttonText: "Invest Now",
      features: [
        "30ft & 40ft road frontage",
        "Rainwater harvesting",
        "5 mins from Airport Road",
        "Approved layouts"
      ]
    },
    {
      id: 3,
      title: "Sri Sai Dwaraka Kammasandra",
      location: "Kammasandra, Old Madras Road",
      image: ssdkammasandra,
      description: "Award-winning completed project with luxury amenities",
      status: "Completed",
      buttonText: "See Success Story",
      features: [
        "Landscaped parks",
        "24/7 surveillance",
        "International schools nearby",
        "Wide CC roads"
      ]
    },
    {
      id: 4,
      title: "Urban Feet Layout",
      location: "Whitefield, Near ITPL",
      image: urbanFeet,
      description: "Luxury sold-out community with world-class infrastructure",
      status: "Completed",
      buttonText: "View Legacy",
      features: [
        "BBMP A-Khata approved",
        "2 KM from Metro",
        "Dedicated gas lines",
        "Underground cabling"
      ]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === projects.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [projects.length]);

  const handleButtonClick = () => {
    setSelectedSlide(projects[currentIndex]);
    setShowDetail(true);
  };

  return (
    <>
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
        {/* MAIN IMAGE CONTAINER */}
        <div className="relative w-full h-full">
          {projects.map((project, index) => (
            <img
              key={index}
              src={project.image}
              alt={project.title}
              width="1920"
              height="1080"
              loading={index === currentIndex ? 'eager' : 'lazy'}
              decoding="async"
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
              {projects[currentIndex].title}
            </h2>
            {projects[currentIndex].location && (
              <p className="text-xl md:text-2xl mb-2">{projects[currentIndex].location}</p>
            )}
            <p className="text-lg md:text-xl mb-8">{projects[currentIndex].description}</p>
            <button 
              onClick={handleButtonClick}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {projects[currentIndex].buttonText}
            </button>
          </div>
        </div>

        {/* NAVIGATION ARROWS */}
        <button
          onClick={() => setCurrentIndex(prev => (prev === 0 ? projects.length - 1 : prev - 1))}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-all"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={() => setCurrentIndex(prev => (prev === projects.length - 1 ? 0 : prev + 1))}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-all"
        >
          <FiChevronRight size={24} />
        </button>

        {/* DOTS INDICATOR */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
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
