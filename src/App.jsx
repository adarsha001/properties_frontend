import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiHome, FiMapPin, FiDollarSign, FiLayers } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [bgChanged, setBgChanged] = useState(false);

  const section1Ref = useRef(null);
  const wrapper1Ref = useRef(null);
  const section2Ref = useRef(null);
  const wrapper2Ref = useRef(null);

  const handleImageClick = () => setBgChanged((prev) => !prev);

  useEffect(() => {
    const sections = [
      { section: section1Ref, wrapper: wrapper1Ref },
      { section: section2Ref, wrapper: wrapper2Ref }
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
              invalidateOnRefresh: true
            }
          });
        };

        update();
        window.addEventListener("resize", update);
      });
    });

    return () => ctx.revert();
  }, []);

  const textColor = bgChanged ? "text-white" : "text-gray-800";
  const bgColor = bgChanged ? "bg-black" : "bg-white";

  const imageCards1 = [
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      title: "Luxury Villa by the Lake"
    },
    {
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      title: "Modern Whitefield Apartment"
    },
    {
      src: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80",
      title: "City-View High-Rise"
    }
      ,{
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      title: "Modern Whitefield Apartment"
    },  {
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      title: "Modern Whitefield Apartment"
    },  {
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      title: "Modern Whitefield Apartment"
    },  {
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      title: "Modern Whitefield Apartment"
    },  {
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      title: "Modern Whitefield Apartment"
    },  {
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      title: "Modern Whitefield Apartment"
    },  {
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      title: "Modern Whitefield Apartment"
    }
  ];

  const imageCards2 = [
    {
      src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      title: "Green Gated Community"
    },
    {
      src: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      title: "Spacious Family Homes"
    },
    {
      src: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=1200&q=80",
      title: "Downtown Commercial Block"
    },
    {
      src: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      title: "Spacious Family Homes"
    },
    {
      src: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      title: "Spacious Family Homes"
    },
    {
      src: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      title: "Spacious Family Homes"
    },
    {
      src: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      title: "Spacious Family Homes"
    },
    {
      src: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      title: "Spacious Family Homes"
    },
    {
      src: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      title: "Spacious Family Homes"
    },
    {
      src: "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80",
      title: "Spacious Family Homes"
    }
  ];

  const renderImageCards = (cards, ref) => (
    <section
      ref={ref.section}
      className={`h-screen w-full flex items-center ${bgColor}`}
    >
      <div
        ref={ref.wrapper}
        className="flex gap-6 sm:gap-8 px-4 overflow-x-auto md:overflow-visible"
        style={{ minWidth: "fit-content" }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            className="w-60 sm:w-72 md:w-80 flex-shrink-0 transition-transform duration-500 hover:scale-105"
          >
            <img
              src={card.src}
              alt={card.title}
              className="w-full h-48 sm:h-60 md:h-72 object-cover rounded-2xl shadow-xl"
            />
            <h2
              className={`mt-4 text-lg sm:text-xl font-semibold ${textColor} whitespace-nowrap`}
            >
              {card.title}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <div
      className={`${bgColor} overflow-x-hidden transition-colors duration-700 ease-in-out`}
    >
      {/* Hero Section */}
      <section className="min-h-screen w-full flex flex-col md:flex-row items-center justify-center px-4">
        {/* Image Section */}
        <div className="relative w-full md:w-1/2 h-64 md:h-[80vh] flex justify-center items-center">
          <div className="absolute w-[130%] h-[120%] bg-gray-100 skew-y-6 rounded-xl shadow-xl -z-10" />
          <img
            className="z-10 w-32 sm:w-40 md:w-56 lg:w-64 object-contain cursor-pointer transition-all duration-700 ease-in-out transform hover:scale-105 opacity-0"
            src={bgChanged ? "/black.png" : "/grad.png"}
            alt="Property Visual"
            onClick={handleImageClick}
            onLoad={(e) => e.currentTarget.classList.remove("opacity-0")}
          />
        </div>

        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-start gap-6 p-1 sm:p-6 lg:p-4">
          <h2
            className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${textColor}`}
          >
            Garudan Properties
          </h2>
          <ul className="space-y-4 text-sm sm:text-base lg:text-lg">
            <li className={`flex items-center gap-4 ${textColor}`}>
              <FiHome className="text-blue-500" size={24} />
              3BHK Luxury Apartments
            </li>
            <li className={`flex items-center gap-4 ${textColor}`}>
              <FiMapPin className="text-green-500" size={24} />
              Prime Location – Whitefield, Bangalore
            </li>
            <li className={`flex items-center gap-4 ${textColor}`}>
              <FiDollarSign className="text-yellow-500" size={24} />
              Affordable Pricing with Easy EMI Options
            </li>
            <li className={`flex items-center gap-4 ${textColor}`}>
              <FiLayers className="text-purple-500" size={24} />
              Amenities: Gym, Pool, Clubhouse & Security
            </li>
          </ul>
        </div>
      </section>

      {/* Image Scroll Sections */}
      {renderImageCards(imageCards1, {
        section: section1Ref,
        wrapper: wrapper1Ref
      })}
      {renderImageCards(imageCards2, {
        section: section2Ref,
        wrapper: wrapper2Ref
      })}

      {/* Footer */}
      <div className="h-20" />
    </div>
  );
};

export default App;
