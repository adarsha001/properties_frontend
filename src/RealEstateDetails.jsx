import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const RealEstateDetails = () => {
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

  return (
    <div ref={sectionRef} className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div 
        ref={contentRef}
        className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden transform transition-all hover:shadow-3xl duration-300"
      >
        {/* Header with image */}
        <div className="relative">
          <img
            src="../../garudan.jpeg"
            alt="E-Khata Layout"
            className="w-full h-screen  object-fill"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
              Presents E-Khata Gated Community Layout
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Title Section */}
          <div className="bg-teal-50 p-5 rounded-lg border-l-4 border-teal-500">
            <h2 className="text-2xl font-bold text-teal-700 mb-3">TITLE DETAILS</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">📍</span>
                <span>Individual E-Khata</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">📍</span>
                <span>D.C Converted</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">📍</span>
                <span>Panchayat Approved Layout</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">📍</span>
                <span>Building Approval – G+3</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">📍</span>
                <span>NOC from HPA</span>
              </li>
              <li className="flex items-start">
                <span className="text-teal-600 mr-2">📍</span>
                <span>LIC/HDFC Loan Available</span>
              </li>
            </ul>
          </div>

          {/* Amenities Section */}
          <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold text-blue-700 mb-3">PREMIUM AMENITIES</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✔️</span>
                <span>TAR Road</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✔️</span>
                <span>Under Ground Drainage</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✔️</span>
                <span>Rain Water Drainage</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✔️</span>
                <span>Electricity & Street Lights</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✔️</span>
                <span>Water Connection to each site</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✔️</span>
                <span>Compound Wall</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✔️</span>
                <span>Tree Plantation</span>
              </li>
            </ul>
          </div>

          {/* Specifications Section */}
          <div className="bg-purple-50 p-5 rounded-lg border-l-4 border-purple-500">
            <h2 className="text-2xl font-bold text-purple-700 mb-3">LOCATION HIGHLIGHTS</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">🚘</span>
                <span>Next to Airport parallel road</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">🚘</span>
                <span>25 minutes from Metro station</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">🚘</span>
                <span>25 minutes from Railway station</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">🚘</span>
                <span>15 mins from Old Madras Road</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">🚘</span>
                <span>5 mins from Airport Road</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">🚘</span>
                <span>40 mins from ITPL/Whitefield</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">🚘</span>
                <span>25 mins from KR Puram</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">🚘</span>
                <span>45 mins from Airport</span>
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">🚘</span>
                <span>10 mins from Schools/Hospitals</span>
              </li>
            </ul>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-gray-400">
            <p className="text-gray-700 leading-relaxed text-justify">
              <span className="font-semibold text-gray-800">Residential Layout near Avalahalli</span> offers the comfort of construction at very affordable prices. 
              Surrounded by well-developed residential houses, this prime location provides excellent convenience and future appreciation potential.
              
              <br /><br />
              
              <span className="font-semibold text-gray-800">Key nearby landmarks include:</span> Metro station, KR Puram, ITPL/Whitefield, Brigade Signature Tower, NH-75, 
              Old Madras Road, Hypermarket, ORION Mall, Nandi Grant/Lemon Leaf Restaurants, East Point College of Engineering & Hospital, 
              Airport Road, New Baldwin International School, Vibgyor School, and Narayana E-Techno School.
              
              <br /><br />
              
              The layout is thoughtfully designed with different facings and dimensions to accommodate various budgets while maintaining 
              premium quality standards throughout the community.
            </p>
          </div>

          {/* Contact CTA */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-5 rounded-lg text-center shadow-md">
            <div className="text-xl sm:text-2xl font-bold text-white mb-2">
              Interested in this property?
            </div>
            <a 
              href="tel:9535755382" 
              className="inline-block bg-white text-teal-600 font-bold py-3 px-6 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
            >
              📞 Call Now: 9535755382
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateDetails;