// Footer.jsx
import React from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FiMapPin } from "react-icons/fi";

const Footer = ({ darkBg, darkText, darkCardBg, darkBorder }) => {
  return (
    <footer className={`${darkBg} ${darkText} py-8`}>
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold mb-3">SP Properties</h2>
          <p className="text-sm opacity-80">
            Your trusted partner in buying and selling premium properties.
            We bring you verified listings, transparency, and hassle-free transactions.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center">
              <FaPhoneAlt className="mr-2 text-teal-400" /> +91 98765 43210
            </li>
            <li className="flex items-center">
              <MdEmail className="mr-2 text-teal-400" /> info@spproperties.com
            </li>
            <li className="flex items-center">
              <FiMapPin className="mr-2 text-teal-400" /> Bangalore, India
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex space-x-4">
            {["#", "#", "#"].map((link, index) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className={`${darkCardBg} p-2 rounded-full hover:bg-teal-500 transition`}
              >
                {index === 0 && <FaFacebookF />}
                {index === 1 && <FaInstagram />}
                {index === 2 && <FaLinkedinIn />}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`mt-8 pt-4 text-center text-sm opacity-70 border-t ${darkBorder}`}>
        © {new Date().getFullYear()} Created by Adarsha. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
