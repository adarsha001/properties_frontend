import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    // Simple fade-in animation for the whole content
    gsap.from(contentRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out"
    });

    // Floating animation for the container
    gsap.to(containerRef.current, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4"
    >
      <div 
        ref={contentRef}
        className="text-center max-w-md"
      >
        <div className="flex items-center justify-center mb-6">
          <span className="text-9xl font-bold text-blue-400">4</span>
          <span className="text-9xl font-bold text-blue-400">0</span>
          <span className="text-9xl font-bold text-blue-400">4</span>
        </div>
        
        <h2 className="text-2xl mb-6 text-gray-300">
          Oops! Page not found
        </h2>
        
        <p className="mb-8 text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-lg transition-colors duration-300"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;