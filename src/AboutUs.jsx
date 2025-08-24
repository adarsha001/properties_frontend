import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutUs = ({ bgChanged }) => {
  const aboutRef = useRef(null);
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const raviTejaRef = useRef(null);
  const statsRef = useRef(null);

  // Dynamic colors based on theme
  const textColor = bgChanged ? "text-white" : "text-gray-800";
  const bgColor = bgChanged ? "bg-gradient-to-br from-black to-gray-900" : "bg-gradient-to-br from-blue-50 to-blue-100";
  const highlightColor =
    "bg-gradient-to-l from-blue-300 via-blue-300 to-teal-400 bg-clip-text text-transparent";// Keep orange as accent color
  const cardBg = bgChanged ? "bg-gray-800" : "bg-white";
  const borderColor = bgChanged ? "border-gray-700" : "border-gray-400";

  useGSAP(() => {
    // Animation for the heading
    gsap.from(headingRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: headingRef.current,
        start: "top 80%",
      },
    });

    // Animation for the content
    gsap.from(contentRef.current, {
      opacity: 0,
      x: -30,
      duration: 1,
      delay: 0.3,
      ease: "back.out(1.2)",
      scrollTrigger: {
        trigger: contentRef.current,
        start: "top 75%",
      },
    });

    // Animation for Ravi Teja's section
    gsap.from(raviTejaRef.current, {
      opacity: 0,
      y: 30,
      duration: 1,
      delay: 0.1,
      ease: "elastic.out(1, 0.5)",
      scrollTrigger: {
        trigger: raviTejaRef.current,
        start: "top 70%",
      },
    });

    // Animation for stats (15 projects)
    gsap.from(statsRef.current, {
      scale: 0.5,
      opacity: 0,
      duration: 1,
      delay: 0.2,
      ease: "bounce.out",
      scrollTrigger: {
        trigger: statsRef.current,
        start: "top 70%",
      },
    });

  }, { scope: aboutRef });

  return (
    <section ref={aboutRef} className={`py-16 px-4 ${bgColor} transition-colors duration-700`}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <h2
          ref={headingRef}
          className={`text-4xl font-bold text-center mb-12 ${textColor}`}
        >
          About <span className={highlightColor}>SP PROPERTIES</span>
        </h2>

        {/* Company Intro */}
        <div
          ref={contentRef}
          className={`mb-12 text-lg ${textColor} leading-relaxed`}
        >
          <p className="mb-6">
            At <strong className={highlightColor}>SP PROPERTIES</strong>, we pride ourselves on delivering excellence in real estate with integrity, innovation, and unmatched expertise. With a strong commitment to quality and customer satisfaction, we have carved a niche as a trusted name in the industry.
          </p>
        </div>

        {/* Ravi Teja's Section */}
        <div
          ref={raviTejaRef}
          className={`${cardBg} p-8 rounded-lg shadow-lg mb-8 border-l-4 ${borderColor} transition-colors duration-700`}
        >
          <h3 className={`text-2xl font-semibold mb-4 ${textColor}`}>
            Meet Our Experts – <span className={highlightColor}>MR.Varshan and MRS.Manjula </span>
          </h3>
          <p className={`${textColor} mb-4`}>
            With <strong>7 years of dedicated experience</strong> in the real estate sector, <strong>Varshan and Manjula</strong> has been an invaluable asset to SP Properties. There keen eye for detail, deep market understanding, and relentless dedication have enabled him to deliver outstanding results.
          </p>
        </div>

        {/* Stats Animation */}
        <div
          ref={statsRef}
          className={` ${textColor} text-center py-6 px-4 rounded-lg max-w-md mx-auto`}
        >
          <p className="text-3xl font-bold mb-2">15+</p>
          <p className="text-lg">Projects Successfully Completed</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;