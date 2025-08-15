import React, { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiMessageSquare } from "react-icons/fi";
import axios from "axios";

const ContactSection = ({ bgChanged }) => {
  const bgColor = bgChanged
    ? "bg-gradient-to-br from-black to-gray-900"
    : "bg-gradient-to-tr from-blue-50 to-blue-100";
  const cardColor = bgChanged ? "bg-gray-800" : "bg-white";
  const titleColor = bgChanged ? "text-white" : "text-gray-800";
  const textColor = bgChanged ? "text-gray-300" : "text-gray-600";
  const labelColor = bgChanged ? "text-gray-200" : "text-gray-700";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://properties-backend-ok36.onrender.com/api/contact", formData);
      alert("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  // Function to track clicks
  const trackClick = async (componentName) => {
    try {
      await axios.post("https://properties-backend-ok36.onrender.com/api/click", {
        component: componentName,
      });
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  return (
    <section
      className={`${bgColor} py-16 px-4 transition-colors duration-500`}
      id="contact"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Contact Form */}
        <div>
          <h2 className={`text-3xl font-bold mb-4 ${titleColor}`}>Get In Touch</h2>
          <p className={`mb-8 text-lg ${textColor}`}>
            We'd love to hear from you. Whether you're buying, selling, or just
            exploring — our team is here to help!
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className={`block mb-1 ${labelColor}`}>Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 ${
                  bgChanged ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label className={`block mb-1 ${labelColor}`}>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 ${
                  bgChanged ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className={`block mb-1 ${labelColor}`}>Phone</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 ${
                  bgChanged ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                placeholder="+91 89041 09093"
              />
            </div>

            <div>
              <label className={`block mb-1 ${labelColor}`}>Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 ${
                  bgChanged ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}
                placeholder="How can we assist you?"
                required
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
         <a
  href="tel:+918971498538"
  className={`${textColor} hover:underline`}
  onClick={() => trackClick("ContactSection", "contact")}
>
  +91 8971498538
</a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <FiMail className="text-blue-500 text-xl" />
            <div>
              <p className={`font-medium ${labelColor}`}>Email</p>
         <a
  href="mailto:spproperties.2021@gmail.com"
  className={`${textColor} hover:underline`}
  onClick={() => trackClick("ContactSection", "gmail")}
>
  spproperties.2021@gmail.com
</a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <FiMessageSquare className="text-blue-500 text-xl" />
            <div>
              <p className={`font-medium ${labelColor}`}>WhatsApp</p>
            <a
  href="https://wa.me/918971498538"
  target="_blank"
  rel="noopener noreferrer"
  className={`${textColor} hover:underline`}
  onClick={() => trackClick("ContactSection", "whatsapp")}
>
  Chat with us
</a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <FiMapPin className="text-blue-500 text-xl" />
            <div>
              <p className={`font-medium ${labelColor}`}>Address</p>
              <p className={`${textColor}`}>
                sy no 37/5, SP Properties, behind Northern Academy, Cheemasandra,
                Bidarahalli, Bengaluru, Karnataka 560049
              </p>
            </div>
          </div>

          <div className="rounded-lg overflow-hidden">
            <iframe
              title="location-map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d485.83593091940867!2d77.71790544093675!3d13.055555974029778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1100351a4def%3A0x948a23360fb3edaa!2sSP%20PROPERTIES!5e0!3m2!1sen!2sin!4v1753344807842!5m2!1sen!2sin"
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
