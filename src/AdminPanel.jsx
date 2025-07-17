// AdminPanel.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCopy, FiCheckCircle, FiTrash2, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [submissions, setSubmissions] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    } else {
      fetchSubmissions();
      fetchContactSubmissions();
    }
  }, [navigate]);

  const fetchSubmissions = () => {
    const token = localStorage.getItem("adminToken");
    axios
      .get("https://properties-backend-ok36.onrender.com/api/chat", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSubmissions(res.data))
      .catch(() => {
        alert("Session expired. Please login again.");
        handleLogout();
      });
  };

  const fetchContactSubmissions = () => {
    const token = localStorage.getItem("adminToken");
    axios
      .get("https://properties-backend-ok36.onrender.com/api/contact", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setContactSubmissions(res.data))
      .catch(() => {
        alert("Session expired while loading contact forms.");
        handleLogout();
      });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Phone number copied to clipboard");
    });
  };

  const markAsContacted = (id, currentStatus) => {
    const token = localStorage.getItem("adminToken");
    axios
      .put(
        `https://properties-backend-ok36.onrender.com/api/chat/${id}`,
        { contacted: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => fetchSubmissions())
      .catch(() => {
        alert("Session expired. Please login again.");
        handleLogout();
      });
  };

  const deleteSubmission = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    const token = localStorage.getItem("adminToken");
    axios
      .delete(`https://properties-backend-ok36.onrender.com/api/chat/${id}`,
        { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchSubmissions())
      .catch(() => {
        alert("Session expired. Please login again.");
        handleLogout();
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const isMobile = window.innerWidth < 640;

  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Admin Panel - Siya Chats</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <FiLogOut /> Logout
        </button>
      </div>

      {/* Chat Submissions Section */}
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : isMobile ? (
        <div className="space-y-4">
          {submissions.map((entry, i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="font-semibold">{i+1}</div>
              <div className="font-semibold">{entry.name}</div>
              <div className="flex items-center gap-2">
                <span>{entry.phone}</span>
                <button
                  onClick={() => copyToClipboard(entry.phone)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FiCopy />
                </button>
              </div>
              <div>Intent: {entry.intent}</div>
              <div>Budget: {entry.budget}</div>
              <div>Type: {entry.propertyType}</div>
              <div>Location: {entry.location}</div>
              <div>Date/Time: {entry.scheduleDate} @ {entry.scheduleTime}</div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => markAsContacted(entry._id, entry.contacted)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    entry.contacted ? "bg-green-600 text-white" : "bg-gray-200"
                  }`}
                >
                  {entry.contacted ? (
                    <><FiCheckCircle className="inline mr-1" /> Contacted</>
                  ) : (
                    "Mark as Contacted"
                  )}
                </button>
                <button
                  onClick={() => deleteSubmission(entry._id)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm"
                >
                  <FiTrash2 className="inline" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-xs sm:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-2">id</th>
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Phone</th>
                <th className="px-2 py-2">Intent</th>
                <th className="px-2 py-2">Budget</th>
                <th className="px-2 py-2">Type</th>
                <th className="px-2 py-2">Location</th>
                <th className="px-2 py-2">Date/Time</th>
                <th className="px-2 py-2">Contacted</th>
                <th className="px-2 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((entry, i) => (
                <tr key={i} className="text-center border-t">
                  <td className="px-2 py-2">{i+1}</td>
                  <td className="px-2 py-2">{entry.name}</td>
                  <td className="px-2 py-2 flex items-center justify-center gap-2">
                    <span>{entry.phone}</span>
                    <button
                      onClick={() => copyToClipboard(entry.phone)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiCopy />
                    </button>
                  </td>
                  <td className="px-2 py-2">{entry.intent}</td>
                  <td className="px-2 py-2">{entry.budget}</td>
                  <td className="px-2 py-2">{entry.propertyType}</td>
                  <td className="px-2 py-2">{entry.location}</td>
                  <td className="px-2 py-2">{entry.scheduleDate} @ {entry.scheduleTime}</td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => markAsContacted(entry._id, entry.contacted)}
                      className={`px-2 py-1 text-xs rounded ${
                        entry.contacted ? "bg-green-600 text-white" : "bg-gray-200"
                      }`}
                    >
                      {entry.contacted ? (
                        <><FiCheckCircle className="inline mr-1" /> Contacted</>
                      ) : (
                        "Mark"
                      )}
                    </button>
                  </td>
                  <td className="px-2 py-2">
                    <button
                      onClick={() => deleteSubmission(entry._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Contact Submissions Section */}
      <div className="mt-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Contact Form Submissions</h2>

        {contactSubmissions.length === 0 ? (
          <p>No contact form submissions yet.</p>
        ) : isMobile ? (
          <div className="space-y-4">
            {contactSubmissions.map((entry, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="font-semibold">#{i + 1}</div>
                <div className="font-semibold">Name: {entry.name}</div>
                <div>Email: {entry.email}</div>
                <div className="flex items-center gap-2">
                  Phone: <span>{entry.phone}</span>
                  <button
                    onClick={() => copyToClipboard(entry.phone)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiCopy />
                  </button>
                </div>
                <div className="mt-2">Message:</div>
                <p className="text-sm text-gray-600 whitespace-pre-line">{entry.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {contactSubmissions.map((entry, i) => (
                  <tr key={i} className="border-t text-center">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{entry.name}</td>
                    <td className="px-3 py-2">{entry.email}</td>
                    <td className="px-3 py-2 flex items-center justify-center gap-2">
                      {entry.phone}
                      <button
                        onClick={() => copyToClipboard(entry.phone)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiCopy />
                      </button>
                    </td>
                    <td className="px-3 py-2 text-left max-w-sm whitespace-pre-wrap">{entry.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;