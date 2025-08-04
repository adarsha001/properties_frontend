import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api';

const AdminAccess = () => {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState({ users: true, chats: true });
  const [error, setError] = useState(null);
  const [selectedChats, setSelectedChats] = useState([]);
  const [selectedManager, setSelectedManager] = useState('');
  const [chatSearch, setChatSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, chatsRes] = await Promise.all([
          axios.get(API.users, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          axios.get(API.chat, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        const managers = usersRes.data.filter(user => user.role === 'manager');
        setUsers(usersRes.data);

        const enhancedChats = chatsRes.data.map(chat => {
          if (chat.assignedTo) {
            const manager = managers.find(m => m._id === chat.assignedTo._id || m._id === chat.assignedTo);
            return {
              ...chat,
              assignedToDetails: manager || null
            };
          }
          return chat;
        });

        setChats(enhancedChats);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch data');
      } finally {
        setLoading({ users: false, chats: false });
      }
    };

    fetchData();
  }, []);

  const toggleChatSelection = (chatId) => {
    setSelectedChats(prev =>
      prev.includes(chatId)
        ? prev.filter(id => id !== chatId)
        : [...prev, chatId]
    );
  };

  const assignChatsToManager = async () => {
    if (selectedChats.length === 0 || !selectedManager) {
      setError('Please select at least one chat and a manager');
      return;
    }

    try {
      const response = await axios.put(
        `${API.chat}/batch-assign`,
        {
          chatIds: selectedChats,
          managerId: selectedManager
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setChats(chats.map(chat =>
        selectedChats.includes(chat._id)
          ? {
              ...chat,
              assignedTo: selectedManager,
              assignedToDetails: users.find(u => u._id === selectedManager)
            }
          : chat
      ));

      setSelectedChats([]);
      setSelectedManager('');
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.error ||
        (err.response?.data?.details || 'Failed to assign chats');
      setError(errorMessage);
    }
  };

  const filteredUnassignedChats = chats.filter(chat =>
    !chat.assignedTo && (
      chat.name?.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.phone?.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.location?.toLowerCase().includes(chatSearch.toLowerCase())
    )
  );

  const filteredAssignedChats = chats.filter(chat =>
    chat.assignedTo && (
      chat.name?.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.phone?.toLowerCase().includes(chatSearch.toLowerCase()) ||
      chat.location?.toLowerCase().includes(chatSearch.toLowerCase())
    )
  );

  if (loading.users || loading.chats) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Chat Assignment</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
          <button onClick={() => setError(null)} className="absolute top-0 right-0 px-4 py-3">
            <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unassigned Chats */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Unassigned Chats</h3>
            <div className="w-64">
              <input
                type="text"
                placeholder="Search chats..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
              />
            </div>
            {selectedChats.length > 0 && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {selectedChats.length} selected
              </span>
            )}
          </div>
          <div className="divide-y divide-gray-200">
            {filteredUnassignedChats.length === 0 ? (
              <div className="p-6 text-gray-500 text-center">No unassigned chats available</div>
            ) : (
              filteredUnassignedChats.map(chat => (
                <div
                  key={chat._id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${selectedChats.includes(chat._id) ? 'bg-blue-50' : ''}`}
                  onClick={() => toggleChatSelection(chat._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{chat.name} - {chat.phone}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Interested in: {chat.propertyType} in {chat.location} (Budget: {chat.budget})
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(chat.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {selectedChats.includes(chat._id) && (
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assignment Panel */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden h-fit sticky top-4">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Assign to Manager</h3>
          </div>
          <div className="p-6">
            {selectedChats.length > 0 ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selected Chats ({selectedChats.length})
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
                    {chats
                      .filter(chat => selectedChats.includes(chat._id))
                      .map(chat => (
                        <div key={chat._id} className="mb-2 last:mb-0">
                          <p className="text-sm font-medium">{chat.name}</p>
                          <p className="text-xs text-gray-500">{chat.phone}</p>
                        </div>
                      ))
                    }
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="manager" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Manager
                  </label>
                  <select
                    id="manager"
                    value={selectedManager}
                    onChange={(e) => setSelectedManager(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a manager</option>
                    {users.filter(user => user.role === 'manager' && user.isActive).map(manager => (
                      <option key={manager._id} value={manager._id}>
                        {manager.fullName} ({manager.username})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={assignChatsToManager}
                  disabled={!selectedManager}
                  className={`w-full px-4 py-2 rounded-md text-white ${selectedManager ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  Assign {selectedChats.length > 1 ? `${selectedChats.length} Chats` : 'Chat'}
                </button>
              </>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mt-2">Select chats from the list to assign</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assigned Chats Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Assigned Chats</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredAssignedChats.length === 0 ? (
            <div className="p-6 text-gray-500 text-center">No assigned chats available</div>
          ) : (
            filteredAssignedChats.map(chat => (
              <div key={chat._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{chat.name} - {chat.phone}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      Interested in: {chat.propertyType} in {chat.location} (Budget: {chat.budget})
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(chat.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Assigned to: {chat.assignedToDetails?.fullName || 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAccess;
