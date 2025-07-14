import React from "react";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const ContactSection = ({ bgChanged }) => {
  const bgColor = bgChanged ? "bg-gradient-to-br from-black to-gray-900" : "bg-gray-100";
  const cardColor = bgChanged ? "bg-gray-800" : "bg-white";
  const titleColor = bgChanged ? "text-white" : "text-gray-800";
  const textColor = bgChanged ? "text-gray-300" : "text-gray-600";
  const labelColor = bgChanged ? "text-gray-200" : "text-gray-700";

  return (
    <section className={`${bgColor} py-16 px-4 transition-colors duration-500`} id="contact">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Contact Form */}
        <div>
          <h2 className={`text-3xl font-bold mb-4 ${titleColor}`}>
            Get In Touch
          </h2>
          <p className={`mb-8 text-lg ${textColor}`}>
            We'd love to hear from you. Whether you're buying, selling, or just exploring — our team is here to help!
          </p>

          <form className="space-y-6">
            <div>
              <label className={`block mb-1 ${labelColor}`}>Name</label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 ${
                  bgChanged ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                placeholder="Your Name"
              />
            </div>

            <div>
              <label className={`block mb-1 ${labelColor}`}>Email</label>
              <input
                type="email"
                className={`w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 ${
                  bgChanged ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className={`block mb-1 ${labelColor}`}>Phone</label>
              <input
                type="tel"
                className={`w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 ${
                  bgChanged ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                placeholder="+91 89041 09093"
              />
            </div>

            <div>
              <label className={`block mb-1 ${labelColor}`}>Message</label>
              <textarea
                rows="4"
                className={`w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 ${
                  bgChanged ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                placeholder="How can we assist you?"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info Card */}
        <div className={`${cardColor} p-6 rounded-xl shadow-lg space-y-6`}>
          <div className="flex items-center space-x-4">
            <FiPhone className="text-blue-500 text-xl" />
            <div>
              <p className={`font-medium ${labelColor}`}>Phone</p>
              <p className={`${textColor}`}>+91 89041 09093</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <FiMail className="text-blue-500 text-xl" />
            <div>
              <p className={`font-medium ${labelColor}`}>Email</p>
              <p className={`${textColor}`}>garudanproperties@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <FiMapPin className="text-blue-500 text-xl" />
            <div>
              <p className={`font-medium ${labelColor}`}>Address</p>
              <p className={`${textColor}`}>Whitefield, Bangalore - 560066</p>
            </div>
          </div>

          {/* Optional Map */}
          <div className="rounded-lg overflow-hidden">
            <iframe
              title="location-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3890.8586947981366!2d77.75100531482327!3d12.984197890850957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1216fb4b6ad9%3A0x68f3c985bb0f8ac0!2sWhitefield%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1688361745476!5m2!1sen!2sin"
              width="100%"
              height="200"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="border-0 w-full"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
