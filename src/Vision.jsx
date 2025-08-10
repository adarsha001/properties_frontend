import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Vision = ({ bgChanged }) => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const visionRef = useRef(null);
  const missionRef = useRef(null);
  const whyRef = useRef(null);

  // Theme-based colors
  const textColor = bgChanged ? "text-white" : "text-gray-800";
  const bgColor = bgChanged
    ? "bg-gradient-to-br from-black to-gray-900"
    : "bg-gradient-to-tr from-blue-50 to-blue-100";
  const highlightColor =
    "bg-gradient-to-l from-blue-300 via-blue-300 to-teal-400 bg-clip-text text-transparent";
  const cardBg = bgChanged ? "bg-gray-800" : "bg-white";
  const borderColor = bgChanged ? "border-gray-700" : "border-gray-300";

  useGSAP(() => {
    gsap.from(headingRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
    });

    gsap.from(visionRef.current, {
      opacity: 0,
      x: -50,
      duration: 1,
      delay: 0.2,
      ease: "power3.out",
      scrollTrigger: { trigger: visionRef.current, start: "top 80%" },
    });

    gsap.from(missionRef.current, {
      opacity: 0,
      x: 50,
      duration: 1,
      delay: 0.4,
      ease: "power3.out",
      scrollTrigger: { trigger: missionRef.current, start: "top 80%" },
    });

    gsap.from(whyRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.6,
      ease: "power3.out",
      scrollTrigger: { trigger: whyRef.current, start: "top 80%" },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className={`py-16 px-4 md:px-16 lg:px-24 ${bgColor} transition-colors duration-700`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2
          ref={headingRef}
          className={`text-4xl font-bold text-center mb-12 ${textColor}`}
        >
          Our <span className={highlightColor}>Vision & Mission</span>
        </h2>

        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div
            ref={visionRef}
            className={`${cardBg} p-6 rounded-xl shadow-lg border-l-4 ${borderColor} transition-colors`}
          >
            <h3 className={`text-2xl font-semibold mb-3 ${textColor}`}>
              Our Vision
            </h3>
            <p className={`${textColor} leading-relaxed`}>
              To become the most trusted real estate brand, delivering sustainable and
              high-quality properties that enrich communities and improve lifestyles.
            </p>
          </div>

          <div
            ref={missionRef}
            className={`${cardBg} p-6 rounded-xl shadow-lg border-l-4 ${borderColor} transition-colors`}
          >
            <h3 className={`text-2xl font-semibold mb-3 ${textColor}`}>
              Our Mission
            </h3>
            <p className={`${textColor} leading-relaxed`}>
              To offer premium, well-planned properties with transparency, innovation, 
              and customer-first service, ensuring long-term value for every investment.
            </p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div
          ref={whyRef}
          className={`${cardBg} p-8 rounded-xl shadow-lg border-l-4 ${borderColor} transition-colors`}
        >
          <h3 className={`text-2xl font-semibold mb-6 ${textColor}`}>
            Why Choose SP Properties?
          </h3>
          <ul className="space-y-4">
            <li className={`${textColor}`}>🏗 Premium gated communities with modern infrastructure</li>
            <li className={`${textColor}`}>📍 Strategically located for maximum growth potential</li>
            <li className={`${textColor}`}>💡 Transparent deals with no hidden charges</li>
            <li className={`${textColor}`}>🤝 Exceptional customer support from start to finish</li>
            <li className={`${textColor}`}>🌱 Commitment to sustainable and eco-friendly development</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Vision;
