import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const RealEstateDetails = ({ bgChanged }) => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

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

    gsap.from(imageRef.current, {
      scale: 1.1,
      duration: 1.5,
      ease: "power2.out",
    });
  }, []);

  const darkBg = bgChanged
    ? "bg-gradient-to-tr from-black to-gray-900"
    : "bg-gradient-to-tr from-blue-50 to-blue-100";
  const darkText = bgChanged
    ? "bg-gradient-to-r from-gray-500 via-gray-400 to-gray-200 bg-clip-text text-transparent"
    : "bg-gradient-to-l from-gray-100 via-gray-600 to-gray-700 bg-clip-text text-transparent";
  const darkCardBg = bgChanged ? "bg-gray-800" : "bg-white";
const handleContactClick = async (type, value) => {
  try {
    await fetch("http://localhost:5000/api/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        value,
        sourceComponent: "RealEstateDetails" // component identifier
      }),
    });
  } catch (err) {
    console.error("Error recording click:", err);
  }

  if (type === "phone") {
    window.location.href = `tel:${value}`;
  } else if (type === "whatsapp") {
    window.open(`https://wa.me/${value}`, "_blank");
  }
};

  return (
    <div
      ref={sectionRef}
      className={`${darkBg} min-h-screen pb-5 pt-4 px-4 sm:px-6 lg:px-8`}
    >
      <h1
        className={`text-3xl sm:text-4xl font-bold bg-gradient-to-l from-gray-800 via-gray-600 to-gray-400 bg-clip-text text-transparent text-center pb-6 drop-shadow-lg`}
      >
        Presents E-Khata Gated Community Layout
      </h1>

      <div
        ref={contentRef}
        className={`max-w-6xl mx-auto ${darkCardBg} shadow-2xl rounded-2xl overflow-hidden`}
      >
        {/* Larger, More Responsive Header Image */}
       <div
  className="relative h-[50vh] sm:h-[40vh] md:h-[70vh] lg:h-[80vh] overflow-hidden"
  ref={imageRef}
>
  <img
    src="../../WhatsApp Image 2025-08-14 at 3.09.14 PM.jpeg"
    alt="E-Khata Layout"
    className="w-full h-full object-fit object-center"
  />
  {/* Optional overlay for better text contrast */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent">
</div>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-6">
          {/* Column 1 */}
          <div
            className={`${
              bgChanged ? "bg-gray-800" : "bg-teal-50"
            } p-4 rounded-lg border-l-4 border-gray-600`}
          >
            <h2
              className={`text-base sm:text-lg font-bold ${
                bgChanged ? "text-gray-100" : "text-gray-800"
              } mb-3`}
            >
              TITLE DETAILS
            </h2>
            <ul className="space-y-2">
              {[
                "Individual E-Khata",
                "D.C Converted",
                "Panchayat Approved Layout",
                "Building Approval G+3",
                "NOC from HPA",
                "Loan Available",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm sm:text-base"
                >
                  <span
                    className={`${
                      bgChanged ? "text-teal-400" : "text-teal-600"
                    } mr-2`}
                  >
                    •
                  </span>
                  <span
                    className={bgChanged ? "text-gray-200" : "text-gray-700"}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div
            className={`${
              bgChanged ? "bg-gray-800" : "bg-blue-50"
            } p-4 rounded-lg border-l-4 border-gray-600`}
          >
            <h2
              className={`text-base sm:text-lg font-bold ${
                bgChanged ? "text-gray-100" : "text-gray-800"
              } mb-3`}
            >
              PREMIUM AMENITIES
            </h2>
            <ul className="space-y-2">
              {[
                "Electricity & Street Lights",
                "Water Connection",
                "Compound Wall",
                "Tree Plantation",
                "TAR/CC Road",
                "Under Ground Drainage",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start text-sm sm:text-base"
                >
                  <span
                    className={`${
                      bgChanged ? "text-blue-400" : "text-blue-600"
                    } mr-2`}
                  >
                    •
                  </span>
                  <span
                    className={bgChanged ? "text-gray-200" : "text-gray-700"}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Full-width Description */}
          <div className="md:col-span-2">
            <div
              className={`${
                bgChanged ? "bg-gray-800" : "bg-gray-50"
              } p-4 rounded-lg`}
            >
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  bgChanged ? "text-gray-300" : "text-gray-700"
                }`}
              >
                <span
                  className={`font-semibold ${
                    bgChanged ? "text-gray-100" : "text-gray-800"
                  }`}
                >
                  Residential Layout near K.R puram offers the perfect blend of
                  affordability and modern living,
                </span>{" "}
                with ready-to-build plots at exceptionally competitive prices.
                Nestled in a rapidly developing neighborhood, this well-planned
                community is surrounded by established residential enclaves,
                ensuring immediate convenience while promising strong future
                appreciation.
              </p>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="md:col-span-2">
            <div
              className={`bg-gradient-to-r ${
                bgChanged
                  ? "from-teal-700 to-teal-800"
                  : "from-gray-900 to-gray-600"
              } p-4 rounded-lg text-center`}
            >
              <div className="text-base sm:text-lg font-bold text-white mb-3">
                Interested in this property?
              </div>
             <div className="flex flex-col sm:flex-row justify-center gap-3">
  <button
    onClick={() => handleContactClick("phone", "8951706247")}
    className="inline-block bg-white text-gray-800 font-bold py-2 px-6 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-300"
  >
    📞 Call Now
  </button>

  <button
    onClick={() => handleContactClick("whatsapp", "918951706247")}
    className="inline-block bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-green-600 transition-colors duration-300"
  >
    💬 WhatsApp
  </button>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealEstateDetails;
