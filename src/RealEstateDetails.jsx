import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const RealEstateDetails = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.from(sectionRef.current, {
    //   opacity: 0,
      y: 100,
      duration: 1.2,
      ease: "power3.out",
    });
  }, []);

  return (
    <div ref={sectionRef} className=" bg-gray-100 min-h-screen text-gray-800 pb-40">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden">
         <h1 className="text-3xl font-bold text-teal-700">
            Presents E-Khata Gated Community Layout
          </h1>
     <img
  src="../../garudan.jpeg"
  alt="E-Khata Layout"
  className="w-full"
/>

        <div className="p-8 space-y-6">
        

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">TITLE</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>📍 Individual E-Khata</li>
              <li>📍 D.C Converted</li>
              <li>📍 Panchayat Approved Layout</li>
              <li>📍 Building Approval – G+3</li>
              <li>📍 NOC from HPA</li>
              <li>📍 LIC/HDFC Loan Available</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">AMENITIES</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>✔️ TAR Road</li>
              <li>✔️ Under Ground Drainage</li>
              <li>✔️ Rain Water Drainage</li>
              <li>✔️ Electricity & Street Lights</li>
              <li>✔️ Water Connection to each site</li>
              <li>✔️ Compound Wall</li>
              <li>✔️ Tree Plantation</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">SPECIFICATIONS</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>🚘 Next to Airport parallel road</li>
              <li>🚘 25 minutes from Metro station</li>
              <li>🚘 25 minutes from Railway station</li>
              <li>🚘 15 mins from Old Madras Road</li>
              <li>🚘 5 mins from Airport Road</li>
              <li>🚘 40 mins from ITPL/Whitefield</li>
              <li>🚘 25 mins from KR Puram</li>
              <li>🚘 45 mins from Airport</li>
              <li>🚘 10 mins from Schools/Hospitals</li>
            </ul>
          </div>

          <div>
            <p className="text-gray-700 leading-relaxed">
              Residential Layout near Avalahalli. It is surrounded by well-developed
              residential houses which offer the comfort of construction to the
              purchasers at very affordable prices.
              <br />
              <br />
              It’s surrounded by Metro station, KR Puram, ITPL/Whitefield, Brigade Signature
              Tower, NH-75, Old Madras Road, Hypermarket, ORION Mall, Nandi Grant/Lemon Leaf
              Restaurants, East Point College of Engineering & Hospital, Airport Road, New
              Baldwin International School, Vibgyor School, and Narayana E-Techno School. This
              development will fetch excellent returns and excellent convenience to the
              residents too.
              <br />
              <br />
              The layout ⏫ is designed to have different facings and different dimensions to
              cover all budgeted People.
            </p>
          </div>

          <div className="text-lg font-semibold text-teal-700">
            📞 Contact: <a href="tel:9535755382" className="underline">9535755382</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateDetails;
