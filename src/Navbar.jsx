import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { Menu, X, Home, Info, Phone } from 'lucide-react';

const Navbar = ({ scrollToContact, scrollToAboutUs }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const linksRef = useRef([]);
  const mobileMenuRef = useRef(null);
  const animationRef = useRef(null);

  const addToLinksRef = (el) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  useEffect(() => {
    if (navRef.current && logoRef.current && linksRef.current.length > 0) {
      animationRef.current = gsap.timeline()
        .fromTo(navRef.current, { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" })
        .fromTo(logoRef.current, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 }, "-=0.1")
        .fromTo(linksRef.current, { y: 10, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.15
        }, "-=0.3");
    }

    return () => {
      if (animationRef.current) animationRef.current.kill();
    };
  }, []);

  useEffect(() => {
    if (isOpen && mobileMenuRef.current) {
      gsap.fromTo(mobileMenuRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [isOpen]);

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: {
        y: 0,
        offsetY: 80,
      },
      ease: "power2.inOut",
    });
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-40 font-montserrat">
      <div
        ref={navRef}
        className="max-w-7xl mx-auto px-4 md:py-12 py-6 mt-5 flex justify-between items-center h-20"
      >
        <Link to="/" className="hover:underline" ref={logoRef}>
          <img
            src="../../file_000000000af061f79f4fd1c4d7592afd.png"
            alt="SP Properties Logo"
            className="w-32 h-20"
            onClick={scrollToTop}
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 text-lg font-semibold text-gray-800">
          <button onClick={scrollToTop} className="hover:text-teal-400 flex items-center gap-2" ref={addToLinksRef}>
            <Home size={18} /> Home
          </button>
          <button onClick={() => { scrollToAboutUs(); setIsOpen(false); }} className="hover:text-teal-400 flex items-center gap-2" ref={addToLinksRef}>
            <Info size={18} /> About
          </button>
          <button onClick={() => { scrollToContact(); setIsOpen(false); }} className="hover:text-teal-400 flex items-center gap-2" ref={addToLinksRef}>
            <Phone size={18} /> Contact
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 w-full bg-white shadow-md md:hidden space-y-2 px-4 py-3"
        >
          <button onClick={scrollToTop} className="flex items-center gap-2 text-gray-700 hover:text-teal-500 w-full text-left">
            <Home size={18} /> Home
          </button>
          <button onClick={() => { scrollToAboutUs(); setIsOpen(false); }} className="flex items-center gap-2 text-gray-700 hover:text-teal-500 w-full text-left">
            <Info size={18} /> About
          </button>
          <button onClick={() => { scrollToContact(); setIsOpen(false); }} className="flex items-center gap-2 text-gray-700 hover:text-teal-500 w-full text-left">
            <Phone size={18} /> Contact
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
