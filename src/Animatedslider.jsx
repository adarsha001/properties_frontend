import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FiArrowDown } from "react-icons/fi";

const imageArray = ['/Why-High-Resolution-Photos-Help-You-Sell-Your-Property.jpg', '/365706.jpg', '/1899412.webp'];
const descriptions = [
  "Explore our luxurious modern apartment towers designed with cutting-edge architecture and premium materials. These high-rise residential buildings are ideal for individuals and families looking for spacious, well-ventilated homes with scenic balcony views, 24/7 security, integrated smart home systems, and access to top-tier amenities like gyms, swimming pools, and co-working spaces — all in the heart of Bangalore’s fastest-growing localities.",

  "Step into a freshly constructed, family-oriented residential community that perfectly blends comfort, elegance, and functionality. These newly built properties are tailored for modern lifestyles with open-plan living, eco-friendly building materials, energy-efficient systems, and landscaped gardens. Located close to schools, tech parks, and shopping hubs, they offer the perfect balance between work, leisure, and peaceful living.",

  "Visualize your future investment through our creative, artist-rendered cartoon layout, designed to help you better understand the scale, zoning, and aesthetics of the project site. This layout illustration includes plotted land divisions, road networks, green zones, commercial zones, and utility placements — ideal for buyers, investors, or developers who seek a comprehensive overview before making a decision."
];

const Animatedslider = ({ scrollToContact, bgChanged }) => {
  const textRef = useRef(null);
  const imgRef = useRef(null);
  const containerRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      gsap.to(imgRef.current, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          setCurrentImage((prev) => (prev + 1) % imageArray.length);
        },
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      imgRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
      }
    );
  }, [currentImage]);

  useGSAP(() => {
    const main = containerRef.current;

    main?.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX / window.innerWidth - 0.5) * 40;

      gsap.to(imgRef.current, {
        x: `${moveX * 0.2}%`,
        duration: 0.2,
        ease: 'power2.out',
      });

      gsap.to(textRef.current, {
        x: -moveX * 1.5,
        duration: 0.5,
        ease: 'power2.out',
      });
    });

    gsap.from(textRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 40,
      duration: 1.2,
      ease: 'power3.out',
      delay: 0.2,
    });
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className={`w-full min-h-screen flex flex-col-reverse md:flex-row items-center justify-between px-4 md:px-10 py-10 gap-10 ${
          bgChanged
            ? 'bg-gradient-to-br from-black to-gray-900'
            : 'bg-gradient-to-br from-blue-50 to-blue-100'
        }`}
      >
        {/* Image + Description */}
        <div className={`w-full md:w-[65%] flex flex-col items-center justify-center rounded-2xl shadow-2xl ${
          bgChanged
            ? 'bg-gray-800'
            : 'bg-gray-100'
        } overflow-hidden`}>
          <img
            ref={imgRef}
            src={imageArray[currentImage]}
            alt="Real Estate Slide"
            className="w-full h-[240px] sm:h-[320px] md:h-[400px] object-cover scale-x-125"
            style={{ opacity: 1 }}
          />
          <p className={`text-center text-sm sm:text-base md:text-lg font-medium p-1 max-w-[95%] sm:max-w-[90%] ${ bgChanged?text-white:text-gray-800} md:max-w-[85%]`}>
            {descriptions[currentImage]}
          </p>
        </div>

        {/* Text Content */}
        <div className="w-full md:w-[35%] text-center md:text-left px-4">
          <h1
            ref={textRef}
            className={`${
              bgChanged ? 'text-white' : 'text-gray-800'
            } text-2xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-wide`}
          >
            Garudan Properties
            <br />
            <span
              className={`${
                bgChanged ? 'text-yellow-400' : 'text-blue-600'
              } text-lg sm:text-2xl md:text-3xl`}
            >
              Real Estate Solutions in Bangalore
            </span>
          </h1>

          <button
            onClick={scrollToContact}
            className={`mt-6 px-6 py-3 rounded-full font-medium flex items-center gap-2 mx-auto md:mx-0 transition-all ${
              bgChanged
                ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Contact Us
            <FiArrowDown className="animate-bounce" />
          </button>
        </div>
      </div>

      {/* Bottom Gradient */}
      {/* <div
        className="absolute bottom-0 left-0 w-full h-24 pointer-events-none z-10"
        style={{
          background: bgChanged
            ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #000000 100%)'
            : 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #e0f2fe 100%)',
        }}
      ></div> */}
    </>
  );
};

export default Animatedslider;
