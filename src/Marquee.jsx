import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Marquee = () => {
  const marqueeContainerRef = useRef(null);
  const animationRef = useRef(null);

  const contactInfo = {
    phones: ["+918951706247", "+918971498538"],
    email: "spproperties.2021@gmail.com",
  };

  useEffect(() => {
    const marqueeEl = marqueeContainerRef.current;

    gsap.set(marqueeEl, { willChange: "transform" });

    animationRef.current = gsap.timeline({
      repeat: -1,
      onRepeat: () => gsap.set(marqueeEl, { xPercent: 0 })
    });

    animationRef.current.to(marqueeEl, {
      xPercent: -100,
      duration: 30,
      ease: "none",
    });

    const handleWheel = (e) => {
      if (!animationRef.current) return;
      const scrollDir = Math.sign(e.deltaY);
      animationRef.current.timeScale(scrollDir * 2);
    };

    window.addEventListener("wheel", handleWheel);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      animationRef.current?.kill();
    };
  }, []);

  const handleContactClick = async (item) => {
    const type = item.includes("@") ? "email" : "phone";
    const source = "Marquee";

    // ✅ Pause exactly where it is
    animationRef.current?.pause();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      await fetch("https://properties-backend-ok36.onrender.com/api/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value: item, sourceComponent: source }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error("Error recording click:", err);
      }
    }

    // Open link in new tab
    if (type === "email") {
      window.open(`mailto:${item}`, '_blank');
    } else {
      window.open(`tel:${item}`, '_blank');
    }

    // ✅ Resume animation after 2 seconds
    setTimeout(() => {
      animationRef.current?.resume();
    }, 2000);
  };

  const items = [...contactInfo.phones, contactInfo.email];

  return (
    <nav 
      className="w-full fixed top-0 bg-gray-900 z-50 px-4 border-b border-slate-600 text-white overflow-hidden"
      aria-label="Contact information"
    >
      <div className="max-w-screen-xl mx-auto py-2">
        <div className="relative overflow-hidden">
          <div
            ref={marqueeContainerRef}
            className="flex gap-8 md:gap-12 min-w-max whitespace-nowrap text-sm sm:text-base font-medium"
            aria-live="polite"
          >
            {items.map((item, i) => (
              <span 
                key={`${item}-${i}`}
                className="flex items-center gap-2 shrink-0 cursor-pointer hover:text-blue-400 transition-colors duration-200"
                onClick={() => handleContactClick(item)}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => e.key === 'Enter' && handleContactClick(item)}
              >
                <span aria-hidden="true">
                  {item.includes("@") ? "📧" : "📞"}
                </span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Marquee;
