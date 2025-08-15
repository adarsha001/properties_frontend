import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Marquee = () => {
  const marqueeContainerRef = useRef(null);

  const contactInfo = {
    phones: ["+918951706247", "+918971498538"], // Removed spaces for direct dialing
    email: "spproperties.2021@gmail.com",
  };

  // Marquee animation
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

// Track clicks with consistent structure
const handleContactClick = async (value) => {
  const type = value.includes("@") ? "email" : "phone";

  try {
    await fetch("https://properties-backend-ok36.onrender.com/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        value,
        sourceComponent: "ContactSection", // Component identifier
      }),
    });
  } catch (err) {
    console.error("Error recording click:", err);
  }
};


  // Repeated items for seamless loop
  const items = [...contactInfo.phones, contactInfo.email];
  const scrollingContent = [...items, ...items]; // duplicate for loop

  return (
    <nav className="w-full fixed top-0 bg-gray-900 z-50 px-4 border-b border-slate-600 text-white overflow-hidden">
      <div className="max-w-screen-xl mx-auto py-2">
        {/* Scrolling Marquee Only */}
        <div className="relative overflow-hidden">
          <div
            ref={marqueeContainerRef}
            className="flex gap-10 min-w-max whitespace-nowrap text-sm sm:text-base font-medium"
          >
            {scrollingContent.map((item, i) => (
              <span 
                key={i} 
                className="flex items-center gap-1 shrink-0 cursor-pointer hover:text-blue-400 transition-colors"
                onClick={() => handleContactClick(item)}
              >
                {item.includes("@") ? "📧" : "📞"} {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Marquee;