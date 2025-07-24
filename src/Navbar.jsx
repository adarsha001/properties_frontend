import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react'; // Hamburger icons

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const mobileMenuRef = useRef(null);
  const animationRef = useRef(null);

  // Desktop nav animation
  useEffect(() => {
    animationRef.current = gsap.timeline()
      .to(navRef.current, {
        y: -1,
        opacity: 1,
        duration: 0.3,
        ease: "power3.out"
      })
      .fromTo(logoRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.3 },
        "-=0.1"
      )
      .fromTo(linksRef.current,
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15
        },
        "-=0.3"
      );
    return () => animationRef.current?.kill();
  }, []);

  // Mobile menu animation
  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(mobileMenuRef.current,
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out"
        }
      );
    }
  }, [isOpen]);

  return (
    <nav className=" fixed top-0 left-0 w-full h-32 bg-white shadow-md z-40">
      <div ref={navRef} className="max-w-7xl mx-auto px-4 md:py-12 py-12 flex justify-between items-center">
     
        <div className="flex items-center space-x-2">
            <Link to="/" className="hover:underline">
          <img src="../../file_00000000e990622f9652adf74ae50a89.png" alt="Voice Survey Logo" className="w-32 h-20 " />
         
            </Link>
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6">
          {['Home', 'About', 'Create'].map((item, i) => (
            <Link
              key={item}
              ref={el => (linksRef.current[i] = el)}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="hover:text-teal-400"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white px-4 pt-2 pb-4 shadow-md space-y-2"
        >
          
          {['Home', 'About', 'Create'].map(item => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
              className="block text-gray-700 hover:text-teal-500"
              onClick={() => setIsOpen(false)}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
