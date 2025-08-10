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
import AdminPanel from "./Admin/AdminPanel"; // ✅ Create this
import AdminLogin from "./Admin/AdminLogin"; // ✅ Optional login screen
import NotFoundPage from "./NotFoundPage";
import Navbar from "./Navbar";
import Animatedsliders from "./Animatedsliders";
import PropertyMap from "./PropertyMap";
import RealEstateDetails from "./RealEstateDetails";
import Footer from "./Footer";
import UserPromptModal from "./UserPromptModal";
// import PropertyDetails from "./pages/ProjectDetail";
// import { ProjectsListing, ProjectDetails } from "./pages/Projects"; 

import ProjectsComponent from './Projects';
import Vision from "./Vision";


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
  const darkBg =   bgChanged
            ? 'bg-gradient-to-tr from-black to-gray-900'
            : 'bg-gradient-to-tr from-blue-50 to-blue-100';

            const footerbg='bg-gradient-to-tr from-black to-gray-900';
  const darkText = bgChanged ? "text-gray-100" : "text-gray-100";
  const darkCardBg = bgChanged ? "bg-gray-800" : "bg-white";
  const darkBorder = bgChanged ? "" : "";
  return (
    <div  style={{ fontFamily: 'Montserrat, sans-serif' }} className={`${darkBg} overflow-x-hidden transition-colors duration-700 ease-in-out`}>
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
      {/* <div className="h-32"></div> */}
      <UserPromptModal/>
<Animatedsliders/>

<RealEstateDetails bgChanged={bgChanged} />
    <PropertyMap bgChanged={bgChanged} />
<ProjectsComponent />
      <ChatBot />
      <GuaranteeSection bgChanged={bgChanged} />
       <div ref={aboutUsRef} id="about"> {/* Update this line */}
        <AboutUs bgChanged={bgChanged} />
      </div>
      <Vision bgChanged={bgChanged} />
<InfiniteScroller bgChanged={bgChanged} id="home" />
<div ref={contactRef} id="contact">
  <ContactSection bgChanged={bgChanged} />
</div>
   <Footer
        darkBg={footerbg}
        darkText={darkText}
        darkCardBg={darkCardBg}
        darkBorder={darkBorder}
      />
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

        {/* <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/projects" element={<ProjectsListing />} /> */}

<Route path="/projects/*" element={<ProjectsComponent />} />
      </Routes>

    </BrowserRouter>
  );
};

export default App;
