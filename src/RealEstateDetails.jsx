import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const RealEstateDetails = ({ bgChanged }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current, {
      y: 100,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(contentRef.current.children, {
      y: 30,
      stagger: 0.1,
      duration: 0.8,
      delay: 0.3,
      ease: "back.out(1)",
    });
  }, []);

  // Dark mode classes
  const darkBg =   bgChanged
            ? 'bg-gradient-to-tr from-black to-gray-900'
            : 'bg-gradient-to-tr from-blue-50 to-blue-100'
  const darkText = bgChanged ? "text-gray-100" : "text-black";
  const darkCardBg = bgChanged ? "bg-gray-800" : "bg-white";
  const darkBorder = bgChanged ? "" : "";

  return (
    <div 
      ref={sectionRef} 
      className={`${darkBg} min-h-screen p-4 py-7 px-4 sm:px-6 lg:px-8`}
    >
      <h1 className={`text-3xl sm:text-4xl font-bold ${darkText} text-center pb-6 drop-shadow-lg`}>
        Presents E-Khata Gated Community Layout
      </h1>
      
      <div 
        ref={contentRef}
        className={`max-w-5xl mx-auto ${darkCardBg} shadow-2xl rounded-2xl overflow-hidden transform transition-all hover:shadow-3xl duration-300 ${darkBorder}`}
      >
        {/* Header with image */}
        <div className="relative">
          <img
            src="../../WhatsApp Image 2025-07-24 at 8.48.39 PM.jpeg"
            alt="E-Khata Layout"
            className="w-full h-auto md:h-screen object-fill"
          />
        </div>

        <div className="p-4 grid grid-cols-2 gap-3 sm:gap-4 sm:p-6">
          {/* Column 1 */}
          <div className="space-y-3 sm:space-y-4">
            {/* Title Section */}
            <div className={`${bgChanged ? 'bg-gray-800' : 'bg-teal-50'} p-3 rounded-lg border-l-4 ${bgChanged ? 'border-gray-600' : 'border-teal-500'}`}>
              <h2 className={`text-sm sm:text-base font-bold ${bgChanged ? 'text-teal-300' : 'text-teal-700'} mb-1 sm:mb-2`}>TITLE DETAILS</h2>
              <ul className="grid grid-cols-1 gap-1">
                {[
                  "Individual E-Khata",
                  "D.C Converted",
                  "Panchayat Approved Layout",
                  "Building Approval – G+3",
                  "NOC from HPA",
                  "LIC/HDFC Loan Available"
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-xs sm:text-sm">
                    <span className={`${bgChanged ? 'text-teal-400' : 'text-teal-600'} mr-1`}>📍</span>
                    <span className={bgChanged ? 'text-gray-200' : ''}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3 sm:space-y-4">
            {/* Amenities Section */}
            <div className={`${bgChanged ? 'bg-gray-700' : 'bg-blue-50'} p-3 rounded-lg border-l-4 ${bgChanged ? 'border-gray-600' : 'border-blue-500'}`}>
              <h2 className={`text-sm sm:text-base font-bold ${bgChanged ? 'text-blue-300' : 'text-blue-700'} mb-1 sm:mb-2`}>PREMIUM AMENITIES</h2>
              <ul className="grid grid-cols-1 gap-1">
                {[
                  "Electricity & Street Lights",
                  "Water Connection",
                  "Compound Wall",
                  "Tree Plantation",
                  "TAR Road",
                  "Under Ground Drainage"
                ].map((item, index) => (
                  <li key={index} className="flex items-start text-xs sm:text-sm">
                    <span className={`${bgChanged ? 'text-blue-400' : 'text-blue-600'} mr-1`}>✔️</span>
                    <span className={bgChanged ? 'text-gray-200' : ''}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Full-width items */}
          <div className="col-span-2 space-y-3 sm:space-y-4">
            {/* Description */}
            <div className={`${bgChanged ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg border-l-4 ${bgChanged ? 'border-gray-600' : 'border-gray-400'}`}>
              <p className={`text-xs sm:text-sm leading-relaxed text-justify ${bgChanged ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className={`font-semibold ${bgChanged ? 'text-gray-100' : 'text-gray-800'}`}>
                  Residential Layout near Avalahalli offers the perfect blend of affordability and modern living,
                </span> with ready-to-build plots at exceptionally competitive prices. Nestled in a rapidly developing neighborhood, this well-planned community is surrounded by established residential enclaves, ensuring immediate convenience while promising strong future appreciation.
              </p>
            </div>

            {/* Contact CTA */}
            <div className={`bg-gradient-to-r ${bgChanged ? 'from-teal-700 to-teal-800' : 'from-teal-500 to-teal-600'} p-3 rounded-lg text-center shadow-md`}>
              <div className="text-sm sm:text-base font-bold text-white mb-1 sm:mb-2">
                Interested in this property?
              </div>
              <a 
                href="tel:9535755382" 
                className="inline-block bg-white text-teal-600 font-bold py-1 px-3 sm:py-2 sm:px-4 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300 text-xs sm:text-sm"
              >
                📞 Call Now: 9535755382
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateDetails;