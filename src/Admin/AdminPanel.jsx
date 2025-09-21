import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";
import ChatSubmissionsTable from "./ChatSubmissionsTable";
import { FiCopy, FiCheckCircle, FiTrash2, FiLogOut, FiPlus, FiEdit } from "react-icons/fi";
import ContactSubmissionsTable from "./ContactSubmissionsTable";
import UserManagement from "./UserManagement";
import AdminAceess from "./AdminAceess";
import AdminClicks from "./AdminClicks";
import ExcelUpload from "./ExcelUpload";
// import ExcelDataDisplay from "./ExcelUpload";
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
      <AdminClicks/>
<ExcelUpload/>
      {/* <ExcelDataDisplay/> */}
    </div>
  );
};

export default AdminPanel;