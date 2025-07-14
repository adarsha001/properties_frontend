import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Marquee = () => {
  const marqueeContainerRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const contactInfo = {
    phones: ["+91 98765 43210", "+91 98765 43211", "+91 98765 43212"],
    email: "garudanproperties@gmail.com",
  };

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

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setDropdownOpen(false);
    setTimeout(() => setCopiedText(""), 2000);
  };

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

        {/* Copy Button */}
        <div className="relative ml-2 flex-shrink-0">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-yellow-400 text-black px-4 py-1 rounded-full font-semibold hover:bg-yellow-500 transition text-sm sm:text-base"
          >
            📋 Copy
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow z-50 w-56">
              {contactInfo.phones.map((phone, index) => (
                <button
                  key={index}
                  onClick={() => handleCopy(phone)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                >
                  Copy Phone {index + 1} 📞
                </button>
              ))}
              <button
                onClick={() => handleCopy(contactInfo.email)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Copy Email 📧
              </button>
            </div>
          )}

          {copiedText && (
            <span className="absolute top-[-1.5rem] right-0 text-xs text-green-400 font-medium">
              Copied!
            </span>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Marquee;
