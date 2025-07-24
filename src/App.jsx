// App.jsx
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { FiMoon, FiSun } from "react-icons/fi";

import InfiniteScroller from "./ReviewSlider";
import ContactSection from "./ContactSection";
import GuaranteeSection from "./GuaranteeSection";
// import Animatedslider from "./Animatedslider";
import AboutUs from "./AboutUs";
import Marquee from "./Marquee";
import ChatBot from "./Chatbox";
import AdminPanel from "./AdminPanel"; // ✅ Create this
import AdminLogin from "./AdminLogin"; // ✅ Optional login screen
import NotFoundPage from "./NotFoundPage";
import Navbar from "./Navbar";
import Animatedsliders from "./Animatedsliders";
import PropertyMap from "./PropertyMap";
import RealEstateDetails from "./RealEstateDetails";
// import PropertyDetails from "./PropertyDetails";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const MainSite = () => {
  const [bgChanged, setBgChanged] = useState(false);
  const contactRef = useRef(null);
    const aboutUsRef = useRef(null);
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
 const scrollToAboutUs = () => { // Add this function
    if (aboutUsRef.current) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: {
          y: aboutUsRef.current,
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
    };
  }, []);

  const textColor = bgChanged ? "text-white" : "text-gray-800";
  const bgColor = bgChanged ? "bg-black" : "bg-white";

  return (
    <div className={`${bgColor} overflow-x-hidden transition-colors duration-700 ease-in-out`}>
      {/* Theme Toggle */}
      <button
        onClick={() => setBgChanged(!bgChanged)}
        className={`fixed z-50 bottom-6 left-6 p-3 rounded-full shadow-lg transition-all duration-300 flex flex-col items-center ${
          bgChanged ? "bg-white text-black" : "bg-black text-white"
        }`}
        aria-label="Toggle Theme"
      >
        {bgChanged ? <FiSun size={24} /> : <FiMoon size={24} />}
      </button>

      <Marquee />

    
 <Navbar scrollToContact={scrollToContact} scrollToAboutUs={scrollToAboutUs} /> 
      <div className="h-32"></div>
      
<Animatedsliders/>

      {/* <Animatedslider scrollToContact={scrollToContact} bgChanged={bgChanged} />
      <ChatBot />
      {/* <PropertyDetails/> */}
      <RealEstateDetails/>
      <PropertyMap/>
      <GuaranteeSection bgChanged={bgChanged} />
       <div ref={aboutUsRef} id="about"> {/* Update this line */}
        <AboutUs bgChanged={bgChanged} />
      </div>
<InfiniteScroller bgChanged={bgChanged} id="home" />
<div ref={contactRef} id="contact">
  <ContactSection bgChanged={bgChanged} />
</div>
<footer className="text-center text-sm py-4 opacity-70">
  <p className={`${textColor}`}>© {new Date().getFullYear()} Created by Adarsha</p>
</footer>
    </div>
  );
};

// 👇 Main entry for routing
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={<AdminPanel />} />
        Optional: <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
