import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Marquee = () => {
  const marqueeContainerRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const dropdownRef = useRef(null);

  const contactInfo = {
    phones: ["+91 98765 43210", "+91 98765 43211", "+91 98765 43212"],
    email: "garudanproperties@gmail.com",
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setDropdownOpen(false);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Rest of your component remains the same...
  useEffect(() => {
    const marqueeEl = marqueeContainerRef.current;

    const tl = gsap.timeline({ repeat: -1 });
    tl.to(marqueeEl, {
      xPercent: -50,
      duration: 20,
      ease: "linear",
    });

    const handleWheel = (e) => {
      const scrollDir = e.deltaY > 0 ? 1 : -1;
      tl.timeScale(scrollDir);
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Repeated items for seamless loop
  const items = [...contactInfo.phones, contactInfo.email];
  const scrollingContent = [...items, ...items]; // duplicate for loop

  return (
    <nav className="w-full fixed top-0 bg-gray-900 z-50 px-4 border-b border-slate-600 text-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between py-2">
        {/* Scrolling Marquee */}
        <div className="relative flex-1 overflow-hidden">
          <div
            ref={marqueeContainerRef}
            className="flex gap-10 min-w-max whitespace-nowrap text-sm sm:text-base font-medium"
          >
            {scrollingContent.map((item, i) => (
              <span key={i} className="flex items-center gap-1 shrink-0">
                {item.includes("@") ? "📧" : "📞"} {item}
              </span>
            ))}
          </div>
        </div>

        {/* Copy Button - Updated section */}
        <div className="relative ml-2 flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-yellow-400 text-black px-4 py-1 rounded-full font-semibold hover:bg-yellow-500 transition text-sm sm:text-base flex items-center gap-1"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            📋 Copy
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow-lg z-50 w-56 overflow-hidden">
              {contactInfo.phones.map((phone, index) => (
                <button
                  key={index}
                  onClick={() => handleCopy(phone)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
                >
                  <span>📞</span>
                  <span>Phone {index + 1}</span>
                </button>
              ))}
              <button
                onClick={() => handleCopy(contactInfo.email)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm flex items-center gap-2"
              >
                <span>📧</span>
                <span>Email</span>
              </button>
            </div>
          )}

          {copiedText && (
            <div className="absolute -top-7 right-0 bg-gray-800 text-green-400 text-xs px-2 py-1 rounded">
              Copied {copiedText.includes("@") ? "email" : "phone"}!
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Marquee;