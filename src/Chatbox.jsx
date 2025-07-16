// SiyaChatbox.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiX, FiSend, FiCalendar, FiClock, FiUser, FiPhone } from "react-icons/fi";

const Chatbox = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([
    {
      from: "siya",
      text: "👋 Hi! I'm Siya, your virtual assistant from Garudan Properties. I'm here to help you explore the best plots and properties across Bangalore. 🏡",
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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const questions = [
    {
      text: "How can I assist you today?",
      field: "intent",
      options: ["Buy Property", "Sell Property", "Develop Site"],
    },
    {
      text: "💰 What's your range?",
      field: "budget",
      options: ["< ₹20L", "₹20-50L", "₹50-1Cr", "> ₹1Cr"],
    },
    {
      text: "🏗️ What kind of property ?",
      field: "propertyType",
      options: ["Plot", "Villa", "Apartment", "Commercial Space"],
    },
    {
      text: "📍 location?",
      field: "location",
      options: ["Avalahalli", "Whitefield", "KR Puram", "Hoskote", "Other"],
    },
    {
      text: "📅 When would you like to visit or schedule a call?",
      field: "scheduleDateTime",
      options: [],
    },
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const simulateTyping = (callback) => {
    setIsTyping(true);
    setTimeout(() => {
      callback();
      setIsTyping(false);
    }, 1000);
  };

  const handleOption = (value) => {
    const key = questions[step].field;
    if (key === "scheduleDateTime") return;
    
    setMessages((prev) => [
      ...prev,
      { from: "user", text: value },
    ]);
    
    setFormData((prev) => ({ ...prev, [key]: value }));
    
    simulateTyping(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "siya",
          text: questions[step + 1]?.text || "Please share your name and phone number:",
        },
      ]);
      setStep((prev) => prev + 1);
      setCustomInput("");
    });
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
    if (!formData.name || !formData.phone) {
      setMessages((prev) => [
        ...prev,
        { from: "siya", text: "Please provide both your name and phone number." },
      ]);
      return;
    }

    try {
      setIsTyping(true);
      await axios.post("http://localhost:5000/api/chat", formData);
      
      simulateTyping(() => {
        setMessages((prev) => [
          ...prev,
          { from: "user", text: `${formData.name} - ${formData.phone}` },
          {
            from: "siya",
            text: "✅ Thank you! Our agent will contact you shortly. We appreciate your interest in Garudan Properties!",
          },
        ]);
        setStep(questions.length + 2);
      });
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "siya", text: "⚠️ Something went wrong! Please try again later." },
      ]);
    }
  };

  return (
    <>
      <button
        className="fixed bottom-5 right-5 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center hover:shadow-2xl transition-all duration-300"
        onClick={() => setOpen(!open)}
      >
        <img src="/aigirl.png" alt="siya" className="w-8 h-8 mr-2 rounded-full" />
        Chat with Siya
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 bg-white rounded-lg shadow-xl w-full max-w-md h-[80vh] flex flex-col overflow-hidden z-50 border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-green-600 to-green-700 text-white">
            <div className="flex items-center gap-3">
              <img src="/aigirl.png" alt="siya" className="w-8 h-8 rounded-full border-2 border-white" />
              <div>
                <span className="font-semibold">Siya</span>
                <p className="text-xs opacity-80">Garudan Properties Assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-full hover:bg-white/10">
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Chat area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="flex flex-col space-y-3">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.from === "siya" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.from === "siya"
                        ? "bg-white text-gray-800 border border-gray-200"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg px-4 py-2 border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <div className="border-t bg-white p-3">
            {step < questions.length - 1 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {questions[step].options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOption(opt)}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-sm transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your answer..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleCustomSubmit()}
                    className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <button
                    onClick={handleCustomSubmit}
                    className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors"
                  >
                    <FiSend />
                  </button>
                </div>
              </div>
            )}

            {step === questions.length - 1 && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <FiCalendar className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="date"
                      name="scheduleDate"
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="relative">
                    <FiClock className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="time"
                      name="scheduleTime"
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (!formData.scheduleDate || !formData.scheduleTime) {
                      setMessages((prev) => [
                        ...prev,
                        { from: "siya", text: "Please select both date and time." },
                      ]);
                      return;
                    }
                    setMessages((prev) => [
                      ...prev,
                      {
                        from: "user",
                        text: `${formData.scheduleDate} at ${formData.scheduleTime}`,
                      },
                    ]);
                    simulateTyping(() => {
                      setMessages((prev) => [
                        ...prev,
                        {
                          from: "siya",
                          text: "Almost done! Please share your name and phone number:",
                        },
                      ]);
                      setStep((prev) => prev + 1);
                    });
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Confirm Schedule
                </button>
              </div>
            )}

            {step === questions.length && (
              <div className="space-y-3">
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="name"
                    placeholder="Your name"
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-3 text-gray-400" />
                  <input
                    name="phone"
                    placeholder="Phone number"
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Submit Details
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs py-2 border-t bg-gray-50 text-gray-500">
            ⚡ Powered by Garudan Properties
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbox;