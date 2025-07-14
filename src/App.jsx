import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin"; // ✅ ScrollTo plugin
import { FiMoon, FiSun, FiArrowDown } from "react-icons/fi";
import InfiniteScroller from "../ReviewSlider";
import ContactSection from "./ContactSection";
import GuaranteeSection from "./GuaranteeSection";
import Animatedslider from "./Animatedslider";

// Register plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const App = () => {
  const [bgChanged, setBgChanged] = useState(false);
  const contactRef = useRef(null);
  const section1Ref = useRef(null);
  const wrapper1Ref = useRef(null);
  const section2Ref = useRef(null);
  const wrapper2Ref = useRef(null);

  const scrollToContact = () => {
    if (contactRef.current) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: {
          y: contactRef.current,
          offsetY: 80,
        },
        ease: "power2.inOut",
      });
    }
  };

  useEffect(() => {
    const sections = [
      { section: section1Ref, wrapper: wrapper1Ref },
      { section: section2Ref, wrapper: wrapper2Ref },
    ];

    const ctx = gsap.context(() => {
      sections.forEach(({ section, wrapper }) => {
        if (!section.current || !wrapper.current) return;

        const update = () => {
          const wrapperWidth = wrapper.current.scrollWidth;
          const viewportWidth = window.innerWidth;
          const offset = Math.max((viewportWidth - wrapperWidth) / 2, 0);

          gsap.set(wrapper.current, { x: offset });

          gsap.to(wrapper.current, {
            x: -wrapperWidth + viewportWidth / 2,
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: "+=1000",
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true,
            },
          });
        };

        update();
        window.addEventListener("resize", update);
      });
    });

    return () => {
      ctx.revert();
      window.removeEventListener("resize", () => {});
    };
  }, []);

  const textColor = bgChanged ? "text-white" : "text-gray-800";
  const bgColor = bgChanged ? "bg-black" : "bg-white";

  return (
    <div className={`${bgColor} overflow-x-hidden transition-colors duration-700 ease-in-out`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setBgChanged(!bgChanged)}
        className={`fixed z-50 bottom-6 right-6 p-3 rounded-full shadow-lg transition-all duration-300 ${
          bgChanged ? "bg-white text-black" : "bg-black text-white"
        }`}
        aria-label="Toggle color scheme"
      >
        {bgChanged ? <FiSun size={24} /> : <FiMoon size={24} />}
      </button>

      {/* Scroll to Contact Button */}
      <button
        onClick={scrollToContact}
        className={`fixed z-50 bottom-6 left-6 p-3 rounded-full shadow-lg transition-all duration-300 flex flex-col items-center ${
          bgChanged ? "text-white" : "text-black"
        }`}
        aria-label="Scroll to contact"
      >
        <span className="text-sm mb-1">Contact</span>
        <FiArrowDown size={20} className="animate-bounce" />
      </button>

      {/* Hero Section */}
      <Animatedslider scrollToContact={scrollToContact} bgChanged={bgChanged} />

      <div className="h-20" />

      <GuaranteeSection bgChanged={bgChanged} />
      <InfiniteScroller bgChanged={bgChanged} />

      {/* Contact Section */}
      <div ref={contactRef}>
        <ContactSection bgChanged={bgChanged} />
      </div>
    </div>
  );
};

export default App;
