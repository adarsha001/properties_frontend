import React, { useState } from 'react';
import axios from 'axios';
import API from '../api';
import { 
  FiCopy, FiCheckCircle, FiTrash2, FiLogOut, FiPlus, 
  FiEdit, FiSearch, FiFilter, FiArrowUp, FiArrowDown, FiPhone 
} from "react-icons/fi";

const ChatSubmissionsTable = ({ 
  submissions, 
  fetchSubmissions,
  getAuthHeader 
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [callDetails, setCallDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callDetailForm, setCallDetailForm] = useState({
    buyingStatus: "mid",
    description: "",
    followUpDate: ""
  });
  const [isAddingNewRow, setIsAddingNewRow] = useState(false);
  const [newRowData, setNewRowData] = useState({
    name: '',
    phone: '',
    intent: '',
    budget: '',
    propertyType: '',
    location: '',
    scheduleDate: '',
    scheduleTime: ''
  });
  const [expandedChatId, setExpandedChatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });
  const [filterConfig, setFilterConfig] = useState({
    buyingStatus: null,
    contacted: null,
    location: null
  });

  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(submissions.map(item => item.location))];

  const handleNewRowInputChange = (e) => {
    const { name, value } = e.target;
    setNewRowData(prev => ({ ...prev, [name]: value }));
  };

  const fetchCallDetails = (submissionId) => {
    axios
      .get(`${API.callDetails}/submission/${submissionId}`, getAuthHeader())
      .then((res) => {
        setCallDetails(Array.isArray(res.data) ? res.data : []);
        console.log(res.data)
      })
      .catch((err) => {
        console.error("Error fetching call details:", err);
        setCallDetails([]);
      });
  };

  const submitCallDetail = () => {
    if (!callDetailForm.description || !callDetailForm.followUpDate || !callDetailForm.buyingStatus) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      contact: selectedSubmission._id,
      chat: selectedSubmission._id,
      buyingStatus: callDetailForm.buyingStatus,
      description: callDetailForm.description,
      followUpDate: new Date(callDetailForm.followUpDate).toISOString()
    };

    axios
      .post(
        API.chatCallDetails(selectedSubmission._id),
        payload,
        getAuthHeader()
      )
      .then(() => {
        fetchCallDetails(selectedSubmission._id);
        fetchSubmissions();
        setCallDetailForm({
          buyingStatus: "mid",
          description: "",
          followUpDate: ""
        });
      })
      .catch((err) => {
        console.error("Full error response:", err.response?.data);
        alert("Error adding call detail: " + (err.response?.data?.message || err.message));
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
      });
  };

  const deleteSubmission = (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    axios
      .delete(API.chatById(id), getAuthHeader())
      .then(() => fetchSubmissions())
      .catch(() => {
        alert("Session expired. Please login again.");
      });
  };

 const handleAddCallDetail = (submission) => {
  console.log("Before state update - submission:", submission);
  setSelectedSubmission(submission);
  console.log("After setting submission");
  fetchCallDetails(submission._id);
  setIsModalOpen(true);
  console.log("After setting modal open");
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
          console.log( "hello",selectedSubmission._id)
        }
        fetchSubmissions();
      })
      .catch((err) => alert("Error deleting call detail: " + err.message));
  };

  const toggleCallDetails = (chatId) => {
    setExpandedChatId(expandedChatId === chatId ? null : chatId);
  };

  // Search and filter functionality
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = 
      submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.phone.includes(searchTerm) ||
      submission.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.propertyType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = 
      (!filterConfig.buyingStatus || 
        (submission.callDetails && submission.callDetails.some(
          detail => detail.buyingStatus === filterConfig.buyingStatus
        ))) &&
      (!filterConfig.contacted || submission.contacted === filterConfig.contacted) &&
      (!filterConfig.location || submission.location === filterConfig.location);

    return matchesSearch && matchesFilters;
  });

  // Sort functionality
  const sortedSubmissions = [...filteredSubmissions].sort((a, b) => {
    if (!sortConfig.key) return 0;

    if (sortConfig.key === 'scheduleDate') {
      const dateA = new Date(`${a.scheduleDate} ${a.scheduleTime}`);
      const dateB = new Date(`${b.scheduleDate} ${b.scheduleTime}`);
      return sortConfig.direction === 'ascending' 
        ? dateA - dateB 
        : dateB - dateA;
    }
    
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

  const handleAddNewRow = async () => {
    if (!newRowData.name || !newRowData.phone || !newRowData.intent || 
        !newRowData.budget || !newRowData.propertyType || !newRowData.location) {
      alert("Please fill all required fields (marked with *)");
      return;
    }

    try {
      const response = await axios.post(API.chatSubmissions, {
        ...newRowData,
        scheduleDate: newRowData.scheduleDate || undefined,
        scheduleTime: newRowData.scheduleTime || undefined
      }, getAuthHeader());

      if (response.data) {
        fetchSubmissions();
        setIsAddingNewRow(false);
        setNewRowData({
          name: '',
          phone: '',
          intent: '',
          budget: '',
          propertyType: '',
          location: '',
          scheduleDate: '',
          scheduleTime: '',
          contacted: false
        });
      }
    } catch (err) {
      console.error("Error adding new submission:", err);
      alert("Error adding new submission: " + (err.response?.data?.message || err.message));
    }
  };

  const renderAddNewForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add New Submission</h3>
          <button 
            onClick={() => setIsAddingNewRow(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close form"
          >
            &times;
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name*</label>
            <input
              type="text"
              name="name"
              value={newRowData.name}
              onChange={handleNewRowInputChange}
              className="w-full border rounded p-2 text-sm md:text-base"
              required
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone*</label>
            <input
              type="tel"
              name="phone"
              value={newRowData.phone}
              onChange={handleNewRowInputChange}
              className="w-full border rounded p-2 text-sm md:text-base"
              required
              placeholder="Enter phone number"
              inputMode="tel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Intent*</label>
            <select
              name="intent"
              value={newRowData.intent}
              onChange={handleNewRowInputChange}
              className="w-full border rounded p-2 text-sm md:text-base"
              required
            >
              <option value="">Select intent</option>
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
              <option value="Invest">Invest</option>
              <option value="Consult">Consult</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Budget*</label>
            <input
              type="text"
              name="budget"
              value={newRowData.budget}
              onChange={handleNewRowInputChange}
              className="w-full border rounded p-2 text-sm md:text-base"
              required
              placeholder="Enter budget amount"
              inputMode="decimal"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Property Type*</label>
            <select
              name="propertyType"
              value={newRowData.propertyType}
              onChange={handleNewRowInputChange}
              className="w-full border rounded p-2 text-sm md:text-base"
              required
            >
              <option value="">Select type</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location*</label>
            <input
              type="text"
              name="location"
              value={newRowData.location}
              onChange={handleNewRowInputChange}
              className="w-full border rounded p-2 text-sm md:text-base"
              required
              placeholder="Enter location"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Schedule Date</label>
              <input
                type="date"
                name="scheduleDate"
                value={newRowData.scheduleDate}
                onChange={handleNewRowInputChange}
                className="w-full border rounded p-2 text-sm md:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Schedule Time</label>
              <input
                type="time"
                name="scheduleTime"
                value={newRowData.scheduleTime}
                onChange={handleNewRowInputChange}
                className="w-full border rounded p-2 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="flex items-center pt-2">
            <input
              type="checkbox"
              id="contacted"
              name="contacted"
              checked={newRowData.contacted}
              onChange={(e) => setNewRowData({...newRowData, contacted: e.target.checked})}
              className="mr-2 h-4 w-4"
            />
            <label htmlFor="contacted" className="text-sm font-medium">
              Mark as contacted
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 sticky bottom-0 bg-white py-2">
          <button
            onClick={() => setIsAddingNewRow(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm md:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleAddNewRow}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm md:text-base"
            disabled={
              !newRowData.name || 
              !newRowData.phone || 
              !newRowData.intent || 
              !newRowData.budget || 
              !newRowData.propertyType || 
              !newRowData.location
            }
          >
            Save Submission
          </button>
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, phone, location..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Status</label>
          <select
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterConfig.contacted === null ? 'all' : filterConfig.contacted}
            onChange={(e) => handleFilterChange('contacted', e.target.value === 'all' ? null : e.target.value === 'true')}
          >
            <option value="all">All</option>
            <option value="true">Contacted</option>
            <option value="false">Not Contacted</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 ">Location</label>
          <select
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterConfig.location || 'all'}
            onChange={(e) => handleFilterChange('location', e.target.value)}
          >
            <option value="all">All Locations</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setIsAddingNewRow(true)}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <FiPlus className="mr-2" /> Add New Submission
        </button>
      </div>
    </div>
  );

  const isMobile = window.innerWidth < 640;

  if (isMobile) {
  return (
    <div className="space-y-4">
      {renderControls()}
      {isAddingNewRow && renderAddNewForm()}
      
      {/* Add this modal rendering inside the mobile view */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal content - same as desktop but adjusted for mobile */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Call Details for {selectedSubmission.name}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
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
                <label className="block text-sm font-medium mb-1">Follow-up</label>
                <input
                  type="datetime-local"
                  value={callDetailForm.followUpDate}
                  onChange={(e) => setCallDetailForm({...callDetailForm, followUpDate: e.target.value})}
                  className="w-full border rounded p-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={callDetailForm.description}
                  onChange={(e) => setCallDetailForm({...callDetailForm, description: e.target.value})}
                  className="w-full border rounded p-2 h-24"
                  placeholder="Call notes..."
                />
              </div>
              
              <button
                onClick={submitCallDetail}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Call Detail
              </button>
            </div>
            
           
          </div>
        </div>
      )}
        {sortedSubmissions.map((entry, i) => (
          <div key={i} className={`border ${
            entry.contacted ? "border-green-600" : "border-gray-200"
          } rounded-lg p-4 shadow-sm bg-white`}>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div><span className="font-medium">ID:</span> {i+1}</div>
              <div><span className="font-medium">Name:</span> {entry.name}</div>
              <div className="col-span-2 flex items-center">
                <span className="font-medium">Phone:</span> 
                <a href={`tel:${entry.phone}`} className="ml-1 text-blue-600">
                  {entry.phone}
                </a>
                <button 
                  onClick={() => copyToClipboard(entry.phone)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  title="Copy phone number"
                >
                  <FiCopy size={14}/>
                </button>
                <a 
                  href={`tel:${entry.phone}`}
                  className="ml-2 bg-green-100 text-green-600 p-1 rounded-full hover:bg-green-200"
                  title="Call this number"
                >
                  <FiPhone size={14}/>
                </a>
              </div>
              <div><span className="font-medium">Intent:</span> {entry.intent}</div>
              <div><span className="font-medium">Budget:</span> {entry.budget}</div>
              <div><span className="font-medium">Type:</span> {entry.propertyType}</div>
              <div><span className="font-medium">Location:</span> {entry.location}</div>
              <div className="col-span-2">
                <span className="font-medium">Schedule:</span> {entry.scheduleDate} @ {entry.scheduleTime}
              </div>
            </div>

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
                          title="Delete call detail"
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
                <div className="text-gray-400 bg-amber-400 text-center py-2">
                  No call details available
                </div>
              )}
            </div>

            <div className="flex justify-between mt-4 pt-3 border-t">
              <button
                onClick={() => markAsContacted(entry._id, entry.contacted)}
                className={`px-3 py-1.5 rounded text-sm ${
                  entry.contacted ? "bg-green-600 text-white" : "bg-gray-200"
                }`}
                title={entry.contacted ? "Mark as not contacted" : "Mark as contacted"}
              >
                {entry.contacted ? "✓ Contacted" : "Mark Contact"}
              </button>
              <div className="flex gap-2">
            <button
  onClick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening call details for:", entry._id);
    handleAddCallDetail(entry);
  }}
  className="px-3 py-1.5 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors"
  title="Add call details"
>
  <FiEdit className="inline mr-1" /> Add Call
</button>
                <button
                  onClick={() => deleteSubmission(entry._id)}
                  className="px-3 py-1.5 bg-red-100 text-red-600 rounded text-sm"
                  title="Delete submission"
                >
                  <FiTrash2 className="inline mr-1"/> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {isAddingNewRow && renderAddNewForm()}
      {renderControls()}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('name')}
              >
                Name {renderSortIcon('name')}
              </th>
              <th className="px-4 py-2">Phone</th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('intent')}
              >
                Intent {renderSortIcon('intent')}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('budget')}
              >
                Budget {renderSortIcon('budget')}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('propertyType')}
              >
                Type {renderSortIcon('propertyType')}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('location')}
              >
                Location {renderSortIcon('location')}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('scheduleDate')}
              >
                Schedule {renderSortIcon('scheduleDate')}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('callDetails')}
              >
                Last Call {renderSortIcon('callDetails')}
              </th>
              <th 
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => requestSort('contacted')}
              >
                Contacted {renderSortIcon('contacted')}
              </th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedSubmissions.map((entry, i) => (
              <React.Fragment key={entry._id}>
                <tr className="border-t">
                  <td className="px-4 py-2">{entry.name}</td>
                  <td className="px-4 py-2 flex items-center gap-1">
                    {entry.phone}
                    <button 
                      onClick={() => copyToClipboard(entry.phone)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Copy phone number"
                    >
                      <FiCopy size={14}/>
                    </button>
                    <a 
                      href={`tel:${entry.phone}`}
                      className="text-green-500 hover:text-green-700 ml-1"
                      title="Call this number"
                    >
                      <FiPhone size={14}/>
                    </a>
                  </td>
                  <td className="px-4 py-2">{entry.intent}</td>
                  <td className="px-4 py-2">{entry.budget}</td>
                  <td className="px-4 py-2">{entry.propertyType}</td>
                  <td className="px-4 py-2">{entry.location}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {entry.scheduleDate} @ {entry.scheduleTime}
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
                  </td>
                  
                  <td className="px-4 py-2">
                    <button
                      onClick={() => markAsContacted(entry._id, entry.contacted)}
                      className={`px-2 py-1 text-xs rounded ${
                        entry.contacted ? "bg-green-600 text-white" : "bg-gray-200"
                      }`}
                    >
                      {entry.contacted ? "✓" : "Mark"}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleAddCallDetail(entry)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Add call details"
                      >
                        <FiEdit size={16}/>
                      </button>
                      <button
                        onClick={() => deleteSubmission(entry._id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete submission"
                      >
                        <FiTrash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
                
                {expandedChatId === entry._id && entry.callDetails?.map((detail, idx) => (
                  <tr key={`${entry._id}-${idx}`} className="bg-gray-50 border-t">
                    <td colSpan={4}></td>
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
                          title="Delete call detail"
                        >
                          <FiTrash2 size={16}/>
                        </button>
                      </div>
                    </td>
                    <td colSpan={3}></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

 {isModalOpen && selectedSubmission && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
        <h3 className="text-lg md:text-xl font-semibold">
          Call Details for {selectedSubmission.name} ({selectedSubmission.phone})
        </h3>
        <button
          onClick={() => setIsModalOpen(false)}
          className="text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Close modal"
        >
          &times;
        </button>
      </div>

      {/* Add New Call Section */}
      <div className="mb-6">
        <h4 className="font-medium mb-2 text-base md:text-lg">Add New Call Detail</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* Buying Status */}
          <div className="md:col-span-1">
            <label className="block text-sm md:text-base font-medium mb-1">Buying Status</label>
            <select
              value={callDetailForm.buyingStatus}
              onChange={(e) => setCallDetailForm({...callDetailForm, buyingStatus: e.target.value})}
              className="w-full border rounded p-2 text-sm md:text-base"
            >
              <option value="high">High</option>
              <option value="mid">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          {/* Follow-up Date */}
          <div className="md:col-span-2">
            <label className="block text-sm md:text-base font-medium mb-1">Follow-up Date</label>
            <input
              type="datetime-local"
              value={callDetailForm.followUpDate}
              onChange={(e) => setCallDetailForm({...callDetailForm, followUpDate: e.target.value})}
              className="w-full border rounded p-2 text-sm md:text-base"
            />
          </div>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm md:text-base font-medium mb-1">Description</label>
          <textarea
            value={callDetailForm.description}
            onChange={(e) => setCallDetailForm({...callDetailForm, description: e.target.value})}
            className="w-full border rounded p-2 h-24 text-sm md:text-base"
            placeholder="Enter call notes..."
          />
        </div>
        
        {/* Submit Button */}
        <button
          onClick={submitCallDetail}
          className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm md:text-base"
        >
          Add Call Detail
        </button>
      </div>

      {/* Previous Call Details Section */}
      <div>
        <h4 className="font-medium mb-2 text-base md:text-lg">Previous Call Details</h4>
        
        {selectedSubmission.callDetails.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No call details yet.</p>
        ) : (
          <div className="space-y-3">
            {selectedSubmission.callDetails.map((detail, i) => (
              <div key={i} className="border rounded p-3 md:p-4 bg-gray-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  {/* Status and Follow-up */}
                  <div className="flex-1">
                    <span className={`font-medium text-sm md:text-base ${
                      detail.buyingStatus === 'high' ? 'text-green-600' :
                      detail.buyingStatus === 'mid' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      Call {i + 1}: {detail.buyingStatus.toUpperCase()}
                    </span>
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      <span className="font-medium">Follow-up:</span> {new Date(detail.followUpDate).toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => deleteCallDetail(detail._id)}
                    className="text-red-500 hover:text-red-700 self-end md:self-auto"
                    title="Delete call detail"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
                
                {/* Description */}
                <p className="mt-2 whitespace-pre-wrap text-xs md:text-sm">
                  {detail.description}
                </p>
                
                {/* Timestamp */}
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

export default ChatSubmissionsTable;