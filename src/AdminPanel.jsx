import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiCopy, FiCheckCircle, FiTrash2, FiLogOut, FiPlus, FiEdit } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "./api";
const AdminPanel = () => {
    const [submissions, setSubmissions] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [leads, setLeads] = useState([]);
  
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [callDetails, setCallDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callDetailForm, setCallDetailForm] = useState({
    buyingStatus: "mid",
    description: "",
    followUpDate: ""
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
    } else {
      fetchSubmissions();
      fetchContactSubmissions();
      fetchLeads();
    }
  }, [navigate]);

  const getAuthHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });

  const fetchSubmissions = () => {
    axios
      .get(API.chatSubmissions, getAuthHeader())
      .then((res) => setSubmissions(res.data))
      .catch(() => {
        alert("Session expired. Please login again.");
        handleLogout();
      });
  };

  const fetchContactSubmissions = () => {
    axios
      .get(API.contactSubmissions, getAuthHeader())
      .then((res) => setContactSubmissions(res.data))
      .catch(() => {
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


  const fetchCallDetails = (submissionId) => {
  axios
    .get(`${API.callDetails}/submission/${submissionId}`, getAuthHeader())
    .then((res) => {
      // Ensure we always have an array
      setCallDetails(Array.isArray(res.data) ? res.data : []);
    })
    .catch((err) => {
      console.error("Error fetching call details:", err);
      setCallDetails([]); // Reset to empty array on error
    });
};


  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard");
    });
  };

  const markAsContacted = (id, currentStatus) => {
    axios
      .put(
        API.chatById(id),
        { contacted: !currentStatus },
        getAuthHeader()
      )
      .then(() => fetchSubmissions())
      .catch(() => {
        alert("Session expired. Please login again.");
        handleLogout();
      });
  };

  const deleteSubmission = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    axios
      .delete(API.chatById(id), getAuthHeader())
      .then(() => fetchSubmissions())
      .catch(() => {
        alert("Session expired. Please login again.");
        handleLogout();
      });
  };

  const deleteLead = (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    axios
      .delete(API.leadById(id), getAuthHeader())
      .then(() => fetchLeads())
      .catch(() => {
        alert("Session expired. Please login again.");
        handleLogout();
      });
  };
  const deletecontact = (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    axios
      .delete(API.deleteById(id), getAuthHeader())
      .then(() => fetchContactSubmissions())
      .catch(() => {
        alert("Session expired. Please login again.");
        handleLogout();
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  


  const handleAddCallDetail = (submission) => {
    setSelectedSubmission(submission);
    fetchCallDetails(submission._id);
    setIsModalOpen(true);
  };

  const submitCallDetail = () => {
    if (!callDetailForm.description || !callDetailForm.followUpDate) {
      alert("Please fill all fields");
      return;
    }

    axios
      .post(
        API.callDetails,
        {
          submissionId: selectedSubmission._id,
          ...callDetailForm
        },
        getAuthHeader()
      )
      .then(() => {
        fetchCallDetails(selectedSubmission._id);
        setCallDetailForm({
          buyingStatus: "mid",
          description: "",
          followUpDate: ""
        });
      })
      .catch((err) => alert("Error adding call detail: " + err.message));
  };

  const deleteCallDetail = (id) => {
    if (!window.confirm("Are you sure you want to delete this call detail?")) return;
    axios
      .delete(`${API.callDetails}/${id}`, getAuthHeader())
      .then(() => fetchCallDetails(selectedSubmission._id))
      .catch((err) => alert("Error deleting call detail: " + err.message));
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

     {/* Header and logout button remain the same */}
  {!isMobile && (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-xs sm:text-sm">
        <thead>
          <tr className="bg-gray-100">
            {/* Submission Info Columns */}
            <th className="px-4 py-2 whitespace-nowrap">ID</th>
            <th className="px-4 py-2 whitespace-nowrap">Name</th>
            <th className="px-4 py-2 whitespace-nowrap">Phone</th>
            <th className="px-4 py-2 whitespace-nowrap">Intent</th>
            <th className="px-4 py-2 whitespace-nowrap">Budget</th>
            <th className="px-4 py-2 whitespace-nowrap">Property Type</th>
            <th className="px-4 py-2 whitespace-nowrap">Location</th>
            <th className="px-4 py-2 whitespace-nowrap">Schedule Date/Time</th>
            
           
            
            <th className="px-4 py-2 whitespace-nowrap">Contacted</th>
            <th className="px-4 py-2 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((entry, i) => (
            <React.Fragment key={i}>
              {/* Main Row - Shows submission data and first call detail if exists */}
              <tr className="border-t">
                {/* Submission Data */}
                <td className="px-4 py-2 text-center">{i+1}</td>
                <td className="px-4 py-2">{entry.name}</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  {entry.phone}
                  <button 
                    onClick={() => copyToClipboard(entry.phone)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiCopy size={14}/>
                  </button>
                </td>
                <td className="px-4 py-2">{entry.intent}</td>
                <td className="px-4 py-2">{entry.budget}</td>
                <td className="px-4 py-2">{entry.propertyType}</td>
                <td className="px-4 py-2">{entry.location}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {entry.scheduleDate} @ {entry.scheduleTime}
                </td>
                
               
                
                {/* Actions */}
                <td className="px-4 py-2">
                  <button
                    onClick={() => markAsContacted(entry._id, entry.contacted)}
                    className={`px-3 py-1 rounded text-sm ${
                      entry.contacted ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    {entry.contacted ? "Contacted" : "Mark"}
                  </button>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => handleAddCallDetail(entry)}
                      className="text-blue-600 hover:text-blue-800 p-1"
                      title="Add Call Details"
                    >
                      <FiEdit size={16}/>
                    </button>
                    <button
                      onClick={() => deleteSubmission(entry._id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <FiTrash2 size={16}/>
                    </button>
                  </div>
                </td>
              </tr>
              
              {/* Additional Rows for Additional Call Details */}
              {entry.callDetails?.slice(1).map((detail, callIndex) => (
                <tr key={`${i}-${callIndex}`} className="bg-gray-50 border-t">
                  <td colSpan={8} className="px-4 py-2 text-right text-gray-500">
                    Additional Call {callIndex + 2}:
                  </td>
                  
                  {/* Call Details Data */}
                  <td className="px-4 py-2">
                    <span className={`font-medium ${
                      detail.buyingStatus === 'high' ? 'text-green-600' :
                      detail.buyingStatus === 'mid' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {detail.buyingStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(detail.followUpDate).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-pre-wrap max-w-xs">
                    {detail.description}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {new Date(detail.createdAt).toLocaleString()}
                  </td>
                  
                  <td colSpan={2} className="px-4 py-2">
                    <button
                      onClick={() => deleteCallDetail(detail._id)}
                      className="text-red-500 hover:text-red-700 flex items-center gap-1"
                    >
                      <FiTrash2 size={14}/> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )}

  {/* Mobile View - Card Style */}
  {isMobile && (
    <div className="space-y-4">
      {submissions.map((entry, i) => (
        <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div><span className="font-medium">ID:</span> {i+1}</div>
            <div><span className="font-medium">Name:</span> {entry.name}</div>
            <div className="col-span-2 flex items-center">
              <span className="font-medium">Phone:</span> {entry.phone}
              <button 
                onClick={() => copyToClipboard(entry.phone)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <FiCopy size={14}/>
              </button>
            </div>
            <div><span className="font-medium">Intent:</span> {entry.intent}</div>
            <div><span className="font-medium">Budget:</span> {entry.budget}</div>
            <div><span className="font-medium">Type:</span> {entry.propertyType}</div>
            <div><span className="font-medium">Location:</span> {entry.location}</div>
            <div className="col-span-2">
              <span className="font-medium">Schedule:</span> {entry.scheduleDate} @ {entry.scheduleTime}
            </div>
          </div>

       

          {/* Action Buttons */}
          <div className="flex justify-between mt-4 pt-3 border-t">
            <button
              onClick={() => markAsContacted(entry._id, entry.contacted)}
              className={`px-4 py-2 rounded ${
                entry.contacted ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              {entry.contacted ? "✓ Contacted" : "Mark as Contacted"}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => handleAddCallDetail(entry)}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded"
              >
                <FiEdit className="inline mr-1"/> Add Call
              </button>
              <button
                onClick={() => deleteSubmission(entry._id)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded"
              >
                <FiTrash2 className="inline mr-1"/> Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

  {/* Mobile View - Show all data with expandable sections */}
  {isMobile && submissions.length > 0 && (
    <div className="space-y-4">
      {submissions.map((entry, i) => (
        <div key={i} className="border rounded-lg p-4 shadow-sm bg-white">
          <div className="font-semibold">{i+1}. {entry.name}</div>
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
          
          {/* Contacted Status */}
          <div className="mt-2">
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
          </div>

          {/* All Call Details */}
          <div className="mt-4 border-t pt-3">
            <h4 className="font-medium mb-2">All Call Details:</h4>
            {entry.callDetails?.length > 0 ? (
              <div className="space-y-3">
                {entry.callDetails.map((call, callIndex) => (
                  <div key={callIndex} className="border rounded p-3 bg-gray-50">
                    <div className="flex justify-between">
                      <span className={`font-medium ${
                        call.buyingStatus === 'high' ? 'text-green-600' :
                        call.buyingStatus === 'mid' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        Call {callIndex + 1}: {call.buyingStatus.toUpperCase()}
                      </span>
                      <button
                        onClick={() => deleteCallDetail(call._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <div className="mt-1">
                      <span className="font-medium">Follow-up:</span> {new Date(call.followUpDate).toLocaleString()}
                    </div>
                    <div className="mt-1 whitespace-pre-wrap">{call.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Added: {new Date(call.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400">No call details available</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => handleAddCallDetail(entry)}
              className="px-3 py-1 bg-blue-100 text-blue-600 rounded text-sm"
            >
              <FiEdit className="inline" /> Add Call
            </button>
            <button
              onClick={() => deleteSubmission(entry._id)}
              className="px-3 py-1 bg-red-100 text-red-600 rounded text-sm"
            >
              <FiTrash2 className="inline" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )}

      {/* Call Details Modal */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Call Details for {selectedSubmission.name} ({selectedSubmission.phone})
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Add New Call Detail</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Buying Status</label>
                  <select
                    value={callDetailForm.buyingStatus}
                    onChange={(e) => setCallDetailForm({...callDetailForm, buyingStatus: e.target.value})}
                    className="w-full border rounded p-2"
                  >
                    <option value="high">High</option>
                    <option value="mid">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Follow-up Date</label>
                  <input
                    type="datetime-local"
                    value={callDetailForm.followUpDate}
                    onChange={(e) => setCallDetailForm({...callDetailForm, followUpDate: e.target.value})}
                    className="w-full border rounded p-2"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={callDetailForm.description}
                  onChange={(e) => setCallDetailForm({...callDetailForm, description: e.target.value})}
                  className="w-full border rounded p-2 h-24"
                  placeholder="Enter call notes..."
                />
              </div>
              <button
                onClick={submitCallDetail}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Call Detail
              </button>
            </div>

            <div>
              <h4 className="font-medium mb-2">Previous Call Details</h4>
              {callDetails.length === 0 ? (
                <p>No call details yet.</p>
              ) : (
                <div className="space-y-4">
                  {callDetails.map((detail, i) => (
                    <div key={i} className="border rounded p-4">
                      <div className="flex justify-between">
                        <span className={`font-medium ${
                          detail.buyingStatus === 'high' ? 'text-green-600' :
                          detail.buyingStatus === 'mid' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {detail.buyingStatus.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(detail.followUpDate).toLocaleString()}
                        </span>
                        <button
                          onClick={() => deleteCallDetail(detail._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap">{detail.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        Added on: {new Date(detail.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Submissions Section */}
      <div className="mb-12">
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
                  <th className="px-3 py-2">Delete</th>
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
                      <td className="px-2 py-2">
                      <button
                        onClick={() => deletecontact(entry._id)}
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
    </div>
  );
};

export default AdminPanel;