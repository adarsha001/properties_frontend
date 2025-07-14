import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FiArrowDown } from "react-icons/fi";

const imageArray = ['/Buildingt.png', '/newbuild.jpeg', '/cartoonbackground.png'];

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
    }, 3000);

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
      className={`w-full min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-10 space-y-8 md:space-y-0 md:space-x-10 ${
        bgChanged ? 'bg-gradient-to-br from-gray-900 to-black' : 'bg-gradient-to-br from-blue-50 to-blue-100'
      }`}
    >
      {/* Image */}
      <div className="w-full max-w-md md:w-[400px] h-[280px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-white flex items-center justify-center">
        <img
          ref={imgRef}
          src={imageArray[currentImage]}
          alt="Real Estate Card"
          className="w-full h-full object-cover scale-150"
          style={{ opacity: 1 }}
        />
      </div>

      {/* Text */}
      <div className="text-center md:text-left px-4 relative">
        <h1
          ref={textRef}
          className={`${
            bgChanged ? 'text-white' : 'text-gray-800'
          } text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-wide`}
        >
          Garudan Properties
          <br />
          <span className={`${
            bgChanged ? 'text-yellow-400' : 'text-blue-600'
          } text-xl sm:text-2xl md:text-3xl`}>
            Real Estate Solutions in Bangalore
          </span>
        </h1>
        
        <button
          onClick={scrollToContact}
          className={`mt-8 px-6 py-3 rounded-full font-medium flex items-center gap-2 mx-auto md:mx-0 transition-all ${
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
      <div
      className="absolute bottom-0 left-0 w-full h-24 pointer-events-none z-10"
      style={{
        background: bgChanged
          ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, #000000 100%)'
          : 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, #e0f2fe 100%)'
      }}
    ></div>
    </>
  );
};

export default Animatedslider;
