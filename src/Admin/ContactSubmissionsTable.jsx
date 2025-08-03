import React, { useState } from 'react';
import axios from 'axios';
import API from '../api';
import { FiCopy, FiTrash2, FiEdit, FiPlus, FiArrowUp, FiArrowDown, FiSearch ,FiStar} from "react-icons/fi";

const ContactSubmissionsTable = ({ 
  submissions, 
  fetchSubmissions,
  getAuthHeader,
  isMobile 
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [callDetails, setCallDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const [expandedCallDetails, setExpandedCallDetails] = useState(null);
      const [expandedContactId, setExpandedContactId] = useState(null);
  const [callDetailForm, setCallDetailForm] = useState({
    buyingStatus: "mid",
    description: "",
    followUpDate: ""
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [filterConfig, setFilterConfig] = useState({
    buyingStatus: null,
    contacted: null
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard");
    });
  };

const submitCallDetail = async () => {
  if (!callDetailForm.description || !callDetailForm.followUpDate) {
    alert("Please fill all fields");
    return;
  }

  try {
    const response = await axios.post(
      API.contactCallDetails(selectedSubmission._id),
      {
        contact: selectedSubmission._id,
        ...callDetailForm
      },
      getAuthHeader()
    );

    // Refresh both call details and submissions
    await fetchCallDetails(selectedSubmission._id);
    await fetchSubmissions(); // This should refetch the contact with populated call details
    
    setCallDetailForm({
      buyingStatus: "mid",
      description: "",
      followUpDate: ""
    });
  } catch (err) {
    console.error("Error adding call detail:", err);
    alert("Error adding call detail: " + (err.response?.data?.message || err.message));
  }
};

  const fetchCallDetails = (contactId) => {
    axios
      .get(API.getContactCallDetails(contactId), getAuthHeader())
      .then((res) => {
        setCallDetails(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Error fetching call details:", err);
        setCallDetails([]);
      });
  };

  const deleteContact = (id) => {
    if (!window.confirm("Are you sure you want to delete this contact submission?")) return;
    axios
      .delete(`${API.contactSubmissions}/${id}`, getAuthHeader())
      .then(() => fetchSubmissions())
      .catch((err) => alert("Error deleting contact submission: " + err.message));
  };

  const deleteCallDetail = (id) => {
    if (!id) {
      console.error("Cannot delete - no ID provided");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this call detail?")) return;
    axios
      .delete(`${API.callDetails}/${id}`, getAuthHeader())
      .then(() => {
        if (selectedSubmission) {
          fetchCallDetails(selectedSubmission._id);
        }
        fetchSubmissions();
      })
      .catch((err) => alert("Error deleting call detail: " + err.message));
  };

  const handleAddCallDetail = (submission) => {
    setSelectedSubmission(submission);
    fetchCallDetails(submission._id);
    setIsModalOpen(true);
  };
  const toggleCallDetails = (contactId) => {
    setExpandedCallDetails(expandedCallDetails === contactId ? null : contactId);
  };

  const toggleMarked = async (id, currentMarkedStatus) => {
  try {
    const response = await axios.patch(
      API.markContact(id),
      {}, // No body needed for toggle
      getAuthHeader()
    );
    fetchSubmissions();
  } catch (err) {
    console.error("Error toggling marked status:", err);
    alert("Error updating contact: " + (err.response?.data?.message || err.message));
  }
};

  // Search and filter functionality
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.phone?.includes(searchTerm) ||
      submission.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = 
      (!filterConfig.buyingStatus || 
        (submission.callDetails && submission.callDetails.some(
          detail => detail.buyingStatus === filterConfig.buyingStatus
        )));

    return matchesSearch && matchesFilters;
  });

  // Sort functionality
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (!sortConfig.key) return 0;

    // Special handling for dates
    if (sortConfig.key === 'createdAt') {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortConfig.direction === 'ascending' 
        ? dateA - dateB 
        : dateB - dateA;
    }
    
    // Special handling for call details (sort by latest call detail date)
    if (sortConfig.key === 'callDetails') {
      const latestA = a.callDetails?.length 
        ? Math.max(...a.callDetails.map(d => new Date(d.createdAt))) 
        : 0;
      const latestB = b.callDetails?.length 
        ? Math.max(...b.callDetails.map(d => new Date(d.createdAt))) 
        : 0;
      return sortConfig.direction === 'ascending' 
        ? latestA - latestB 
        : latestB - latestA;
    }

    // Default sorting for other fields
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key, value) => {
    setFilterConfig({
      ...filterConfig,
      [key]: value === 'all' ? null : value
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' 
      ? <FiArrowUp className="inline ml-1" /> 
      : <FiArrowDown className="inline ml-1" />;
  };

  const renderControls = () => (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Buying Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buying Status</label>
          <select
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterConfig.buyingStatus || 'all'}
            onChange={(e) => handleFilterChange('buyingStatus', e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="high">High</option>
            <option value="mid">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
    </div>
  );
if (isMobile) {
  return (
    <div className="space-y-4">
      {renderControls()}
      {sortedSubmissions.map((entry, i) => (
        <div key={i} className={`border rounded-lg p-4 shadow-sm bg-white ${entry.marked ? 'border-green-400 border-2' : ''}`}>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div><span className="font-medium">ID:</span> {i+1}</div>
            <div className="flex justify-between items-start">
              <span className="font-medium">Name:</span> {entry.name}
            </div>
            <div className="col-span-2 flex items-center">
              <span className="font-medium">Phone:</span> {entry.phone}
              <button 
                onClick={() => copyToClipboard(entry.phone)}
                className="ml-2 text-blue-500 hover:text-blue-700"
              >
                <FiCopy size={14}/>
              </button>
            </div>
            <div><span className="font-medium">Email:</span> {entry.email}</div>
            <div><span className="font-medium">Date:</span> {new Date(entry.createdAt).toLocaleDateString()}</div>
          </div>

          <div className="mt-2">
            <span className="font-medium">Message:</span>
            <p className="text-sm text-gray-600 whitespace-pre-line mt-1">{entry.message}</p>
          </div>
          
          {/* Call Details Section */}
          <div className="mt-4 border-t pt-3">
            <h4 className="font-medium mb-2">Call Details:</h4>
            {entry.callDetails?.length > 0 ? (
              <div className="space-y-3">
                {entry.callDetails.map((detail, idx) => (
                  <div key={idx} className="border rounded p-3 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`font-medium ${
                          detail.buyingStatus === 'high' ? 'text-green-600' :
                          detail.buyingStatus === 'mid' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          Call {idx + 1}: {detail.buyingStatus.toUpperCase()}
                        </span>
                        <div className="text-sm">
                          <span className="font-medium">Follow-up:</span> {new Date(detail.followUpDate).toLocaleString()}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteCallDetail(detail._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={16}/>
                      </button>
                    </div>
                    <div className="mt-2 whitespace-pre-wrap text-sm">
                      {detail.description}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Added: {new Date(detail.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-2">
                No call details available
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-4 pt-3 border-t">
            <button
              onClick={() => toggleMarked(entry._id, entry.marked)}
              className={`px-2 py-1 text-xs rounded ${
                entry.marked ? "bg-green-600 text-white" : "bg-gray-200"
              }`}
            >
              {entry.marked ? "✓Contacted" : "Mark as Contacted"}
            </button>
            <button
              onClick={() => deleteContact(entry._id)}
              className="px-4 py-2 bg-red-100 text-red-600 rounded"
            >
              <FiTrash2 className="inline mr-1"/> Delete
            </button>
             
            <button
              onClick={() => setExpandedContactId(expandedContactId === entry._id ? null : entry._id)}
              className="px-4 py-2 bg-blue-100 text-blue-600 rounded"
            >
              <FiEdit className="inline mr-1"/> {expandedContactId === entry._id ? 'Cancel' : 'Add Call'}
            </button>
          </div>

          {/* Add Call Form - shown when expanded */}
          {expandedContactId === entry._id && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-3">Add Call Details</h4>
              <div className="space-y-3">
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
                <div>
                  <label className="block text-sm font-medium mb-1">Follow-up Date</label>
                  <input
                    type="datetime-local"
                    value={callDetailForm.followUpDate}
                    onChange={(e) => setCallDetailForm({...callDetailForm, followUpDate: e.target.value})}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={callDetailForm.description}
                    onChange={(e) => setCallDetailForm({...callDetailForm, description: e.target.value})}
                    className="w-full border rounded p-2 h-24"
                    placeholder="Enter call notes..."
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setExpandedContactId(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSubmission(entry);
                      submitCallDetail();
                      setExpandedContactId(null);
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

  return (
    <>
      {renderControls()}
     <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">ID</th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('name')}
              >
                Name {renderSortIcon('name')}
              </th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Email</th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('createdAt')}
              >
                Date {renderSortIcon('createdAt')}
              </th>
              <th className="px-4 py-2">Call Details</th>
                 <th className="px-4 py-2">Marked</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubmissions.map((entry, i) => (
              <React.Fragment key={entry._id}>
                {/* Main Row */}
                <tr className="border-t">
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
                  <td className="px-4 py-2">{entry.email}</td>
                  <td className="px-4 py-2">
                    {new Date(entry.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2">
                    {entry.callDetails?.length > 0 ? (
                      <button 
                        onClick={() => toggleCallDetails(entry._id)}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                      >
                        {entry.callDetails.length} call(s)
                      </button>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td> <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => toggleMarked(entry._id, entry.marked)}
                      className={`px-2 py-1 text-xs rounded ${
                        entry.marked ? "bg-green-600 text-white" : "bg-gray-200"
                      }`}
                    >
                     {entry.marked ? '✓' : 'Mark'}
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
                        onClick={() => deleteContact(entry._id)}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <FiTrash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Call Details Row */}
                {expandedCallDetails === entry._id && entry.callDetails?.map((detail, idx) => (
                  <tr key={`${entry._id}-${idx}`} className="bg-gray-50 border-t">
                    <td colSpan={2}></td>
                    <td colSpan={4} className="px-4 py-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`font-medium ${
                            detail.buyingStatus === 'high' ? 'text-green-600' :
                            detail.buyingStatus === 'mid' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            Call {idx + 1}: {detail.buyingStatus.toUpperCase()}
                          </span>
                          <div className="text-sm">
                            <span className="font-medium">Follow-up:</span> {new Date(detail.followUpDate).toLocaleString()}
                          </div>
                          <div className="whitespace-pre-wrap text-sm mt-1">
                            {detail.description}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCallDetail(detail._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={16}/>
                        </button>
                      </div>
                    </td>
                    <td colSpan={1}></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Call Details Modal */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Call Details for {selectedSubmission.name} ({selectedSubmission.phone || selectedSubmission.email})
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
    </>
  );
};

export default ContactSubmissionsTable;