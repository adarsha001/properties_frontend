import React from "react";
import { FaHandshake, FaShieldAlt, FaHome, FaHeadset } from "react-icons/fa";

const guarantees = [
  {
    icon: <FaHandshake className="text-blue-500 text-3xl" />,
    title: "Transparent Process",
    description:
      "We ensure a clear, no-hidden-fees process. You’ll always know what you’re getting — no surprises, just results."
  },
  {
    icon: <FaShieldAlt className="text-green-500 text-3xl" />,
    title: "Secure Investments",
    description:
      "All properties are verified, legally compliant, and safe. Your investment is protected with us."
  },
  {
    icon: <FaHome className="text-yellow-500 text-3xl" />,
    title: "Quality Properties",
    description:
      "From premium apartments to cozy villas, we offer homes that meet high construction and lifestyle standards."
  },
  {
    icon: <FaHeadset className="text-purple-500 text-3xl" />,
    title: "Lifetime Support",
    description:
      "Our relationship doesn’t end at the sale. We assist you even after possession, every step of the way."
  }
];

const GuaranteeSection = ({ bgChanged }) => {
 const bgColor = bgChanged ? "bg-gray-900" : "bg-gray-50";
  const textColor = bgChanged ? "text-white" : "text-gray-800";
  const subTextColor = bgChanged ? "text-gray-300" : "text-gray-600";
  const cardBg = bgChanged ? "bg-gray-800" : "bg-gray-100";

  return (
    <section className={`${
          bgChanged
            ? 'bg-gradient-to-tr from-black to-gray-900'
            : 'bg-gradient-to-tr from-blue-50 to-blue-100'
        } py-20 px-6 transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className={`text-3xl font-bold ${textColor}`}>
          Our Promise to You
        </h2>
        <p className={`mt-4 ${subTextColor} text-lg`}>
          At Garudan Properties, we’re not just selling homes — we’re helping you build your future. Here’s our guarantee:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {guarantees.map((item, index) => (
          <div
            key={index}
            className={`${cardBg} p-6 rounded-xl shadow hover:shadow-xl transition`}
          >
            <div className="mb-4">{item.icon}</div>
            <h3 className={`text-xl font-semibold mb-2 ${textColor}`}>
              {item.title}
            </h3>
            <p className={`text-sm ${subTextColor}`}>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GuaranteeSection;
