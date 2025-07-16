// SiyaChatbox.jsx
import React, { useState } from "react";
import axios from "axios";
import { FiX } from "react-icons/fi";

const Chatbox = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    {
      from: "siya",
      text:
        "👋 Hi! I'm Siya, your virtual assistant from Garudan Properties. I’m here to help you explore the best plots and properties across Bangalore. 🏡",
    },
  ]);
  const [formData, setFormData] = useState({
    intent: "",
    budget: "",
    propertyType: "",
    location: "",
    scheduleDate: "",
    scheduleTime: "",
    name: "",
    phone: "",
  });
  const [customInput, setCustomInput] = useState("");

  const questions = [
    {
      text: "How can I assist you today?",
      field: "intent",
      options: ["Buy Property", "Sell Property", "Develop Site"],
    },
    {
      text: "💰 What’s your budget?",
      field: "budget",
      options: ["< ₹20L", "₹20-50L", "₹50-1Cr", "> ₹1Cr"],
    },
    {
      text: "🏗️ What kind of property are you looking for?",
      field: "propertyType",
      options: ["Plot", "Villa", "Apartment", "Shop"],
    },
    {
      text: "📍 Preferred location?",
      field: "location",
      options: ["Avalahalli", "Whitefield", "KR Puram", "Hoskote"],
    },
    {
      text: "📅 Please select a date and time for your visit or call.",
      field: "scheduleDateTime",
      options: [],
    },
  ];

  const handleOption = (value) => {
    const key = questions[step].field;
    if (key === "scheduleDateTime") return; // skip for date/time
    setMessages((prev) => [
      ...prev,
      { from: "user", text: value },
      {
        from: "siya",
        text:
          questions[step + 1]?.text ||
          "Please share your name and phone number:",
      },
    ]);
    setFormData((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
    setCustomInput("");
  };

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      handleOption(customInput);
    }
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("https://your-backend-url/api/chat", formData);
      setMessages((prev) => [
        ...prev,
        { from: "user", text: `${formData.name} - ${formData.phone}` },
        {
          from: "siya",
          text: "✅ Thank you! Our agent will contact you shortly.",
        },
      ]);
      setStep(questions.length + 2);
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <>
      <button
        className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg z-50"
        onClick={() => setOpen(!open)}
      >
        Chat with Siya
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 bg-white rounded-lg shadow-xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-100">
            <div className="flex items-center gap-2">
              <img src="/aigirl.png" alt="siya" className="w-8 h-8 rounded-full" />
              <span className="font-semibold">siya</span>
            </div>
            <FiX className="cursor-pointer" onClick={() => setOpen(false)} />
          </div>

          <div className="flex flex-col justify-start items-center px-4 py-2 overflow-y-auto flex-1 text-sm">
            <img
              src="/aigirl.png"
              alt="siya"
              className="w-16 h-16 mt-2 mb-4 rounded-full"
            />
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 w-full ${
                  msg.from === "siya"
                    ? "text-left text-gray-800"
                    : "text-right text-blue-700"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {step < questions.length - 1 && (
              <div className="mt-3 w-full">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleOption(opt)}
                    className="block w-full bg-gray-100 hover:bg-gray-200 p-2 mb-1 rounded"
                  >
                    {opt}
                  </button>
                ))}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Custom option"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={handleCustomSubmit}
                    className="bg-blue-600 text-white px-3 rounded"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}

            {step === questions.length - 1 && (
              <div className="flex flex-col gap-2 mt-3 w-full">
                <label className="text-left text-xs">Select date:</label>
                <input
                  type="date"
                  name="scheduleDate"
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <label className="text-left text-xs">Select time:</label>
                <input
                  type="time"
                  name="scheduleTime"
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <button
                  onClick={() => {
                    setMessages((prev) => [
                      ...prev,
                      {
                        from: "user",
                        text: `${formData.scheduleDate} at ${formData.scheduleTime}`,
                      },
                      {
                        from: "siya",
                        text: "Please share your name and phone number:",
                      },
                    ]);
                    setStep((prev) => prev + 1);
                  }}
                  className="bg-green-600 text-white py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            )}

            {step === questions.length && (
              <div className="flex flex-col gap-2 mt-3 w-full">
                <input
                  name="name"
                  placeholder="Your name"
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <input
                  name="phone"
                  placeholder="Phone number"
                  onChange={handleInputChange}
                  className="p-2 border rounded"
                />
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white py-2 rounded"
                >
                  Submit
                </button>
              </div>
            )}
          </div>

          <div className="text-center text-xs py-1 border-t bg-gray-50">
            ⚡ by Garudan Properties
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;
