import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const Marquee = () => {
  const marqueeRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copiedText, setCopiedText] = useState("");

  const contactInfo = {
    phones: ["+91 98765 43210", "+91 98765 43211", "+91 98765 43212"],
    email: "garudanproperties@gmail.com",
  };

  useEffect(() => {
    const handleWheel = (e) => {
      const scrollDir = e.deltaY > 0 ? 1 : -1;

      gsap.to(marqueeRef.current, {
        x: `+=${-scrollDir * 200}`,
        duration: 1,
        ease: "power2.out",
      });
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

  return (
    <div className="w-full fixed top-0 bg-gray-900 py-4 z-50 px-4 border-t border-slate-500 text-white">
      <div
        ref={marqueeRef}
        className="whitespace-nowrap flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-base sm:text-lg font-medium"
      >
        {/* Phone Numbers */}
        <div className="flex gap-4 flex-wrap">
          {contactInfo.phones.map((phone, index) => (
            <span key={index}>📞 {phone}</span>
          ))}
        </div>

        {/* Email */}
        <span>📧 {contactInfo.email}</span>

        {/* Copy Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-yellow-400 text-black px-4 py-1 rounded-full font-semibold hover:bg-yellow-500 transition"
          >
            📋 Copy
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded-lg shadow z-50 w-56">
              {contactInfo.phones.map((phone, index) => (
                <button
                  key={index}
                  onClick={() => handleCopy(phone)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Copy Phone {index + 1} 📞
                </button>
              ))}
              <button
                onClick={() => handleCopy(contactInfo.email)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Copy Email 📧
              </button>
            </div>
          )}

          {/* Feedback */}
          {copiedText && (
            <span className="absolute top-[-1.5rem] right-0 text-sm text-green-400 font-medium">
              Copied!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
