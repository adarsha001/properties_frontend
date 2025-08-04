import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ChatSubmissionsTable from "./ChatSubmissionsTable";
import { FiCopy, FiCheckCircle, FiTrash2, FiLogOut, FiPlus, FiEdit } from "react-icons/fi";
import ContactSubmissionsTable from "./ContactSubmissionsTable";
import UserManagement from "./UserManagement";
import AdminAceess from "./AdminAceess";
const AdminPanel = () => {
   const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [leads, setLeads] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!token || !user) {
      navigate("/admin/login");
    } else {
      setCurrentUser(user);
      fetchSubmissions();
      fetchContactSubmissions();
      fetchLeads();
    }
  }, [navigate]);


  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchSubmissions = () => {
    axios
      .get(API.chat, getAuthHeader())
      .then((res) => setSubmissions(res.data))
      .catch(() => {
        alert("Session expired. Please login again.");
        handleLogout();
      });
  };

  const fetchContactSubmissions = () => {
  axios
    .get(API.contactSubmissions, getAuthHeader())
    .then(async (res) => {
      // If callDetails are just IDs, fetch details for each submission
      const submissionsWithDetails = await Promise.all(
        res.data.map(async (submission) => {
          if (submission.callDetails && submission.callDetails.length > 0) {
            // Check if callDetails are already populated (have buyingStatus field)
            if (typeof submission.callDetails[0] === 'object' && submission.callDetails[0].buyingStatus) {
              return submission; // Already populated
            }
            
            // Fetch details for each call detail ID
            const details = await Promise.all(
              submission.callDetails.map(id => 
                axios.get(`${API.callDetails}/${id}`, getAuthHeader())
                  .then(detailRes => detailRes.data)
                  .catch(() => null) // Handle individual errors
              )
            );
            console.log(details)
            return {
              ...submission,
              callDetails: details.filter(Boolean) // Remove any nulls from failed fetches
            };
          }
          return submission;
        })
      );
      setContactSubmissions(submissionsWithDetails);
    })
    .catch((err) => {
      console.error("Error fetching contact submissions:", err);
      alert("Session expired while loading contact forms.");
      handleLogout();
    });
};

  const fetchLeads = () => {
    axios
      .get(API.leads, getAuthHeader())
      .then((res) => setLeads(res.data))
      .catch(() => {
        alert("Session expired while loading leads.");
        handleLogout();
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };
const isMobile = window.innerWidth < 640;
  return (
    <div className="p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          <FiLogOut /> Logout
        </button>
      </div>


      {/* Chat Submissions Section */}
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Chat Submissions</h2>
        <ChatSubmissionsTable 
          submissions={submissions}
          fetchSubmissions={fetchSubmissions}
          getAuthHeader={getAuthHeader}
        />
      </div>
 <div className="mb-12">
  <h2 className="text-xl sm:text-2xl font-semibold mb-4">Contact Form Submissions</h2>
  {contactSubmissions.length === 0 ? (
    <p>No contact form submissions yet.</p>
  ) : (
    <ContactSubmissionsTable 
      submissions={contactSubmissions}
      fetchSubmissions={fetchContactSubmissions}
      getAuthHeader={getAuthHeader}
      isMobile={isMobile}
    />
  )}
</div>

      {/* Leads Section */}
      <div className="mb-12">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Property Leads</h2>
        {leads.length === 0 ? (
          <p>No leads yet.</p>
        ) : isMobile ? (
          <div className="space-y-4">
            {leads.map((lead, i) => (
              <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="font-semibold">#{i + 1}</div>
                <div className="font-semibold">Name: {lead.name}</div>
                <div className="flex items-center gap-2">
                  Phone: <span>{lead.phone}</span>
                  <button
                    onClick={() => copyToClipboard(lead.phone)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FiCopy />
                  </button>
                </div>
             
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => deleteLead(lead._id)}
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
                  <th className="px-3 py-2">#</th>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Phone</th>
                 
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => (
                  <tr key={i} className="border-t text-center">
                    <td className="px-3 py-2">{i + 1}</td>
                    <td className="px-3 py-2">{lead.name}</td>
                    <td className="px-3 py-2 flex items-center justify-center gap-2">
                      {lead.phone}
                      <button
                        onClick={() => copyToClipboard(lead.phone)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiCopy />
                      </button>
                    </td>
            
                    <td className="px-3 py-2">
                      {new Date(lead.createdAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => deleteLead(lead._id)}
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
      </div>
      {currentUser?.role === 'admin' && (
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">User Management</h2>
          <UserManagement 
            getAuthHeader={getAuthHeader} 
            currentUser={currentUser}
          />
        </div>
      )}

      <AdminAceess/>
    </div>
  );
};

export default AdminPanel;