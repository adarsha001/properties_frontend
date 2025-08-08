import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoClose } from 'react-icons/io5'; // Importing close icon

const Userinformation = ({ propertyId }) => {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://properties-backend-ok36.onrender.com/api/leads', { ...form, propertyId });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form', err);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50  bg-opacity-40 backdrop-blur-sm flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-sm">
        <button
          onClick={() => setShow(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
        >
          <IoClose />
        </button>

        {submitted ? (
          <p className="text-center text-green-600 font-semibold">
            Thanks! We'll contact you soon.
          </p>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Interested in this property?</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                className="w-full border border-gray-300 px-4 py-2 rounded"
              />
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700"
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Userinformation;
