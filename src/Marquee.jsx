import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Marquee = () => {
  const marqueeContainerRef = useRef(null);

  const contactInfo = {
    phones: ["+91 8951706247",  "+91 8971498538"],
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
              <span key={i} className="flex items-center gap-1 shrink-0">
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