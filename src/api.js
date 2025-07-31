// src/api.js
const BASE_URL = "http://localhost:5000/api" ||"https://properties-backend-ok36.onrender.com/api";

const API = {
  adminLogin: `${BASE_URL}/admin/login`,
  chatSubmissions: `${BASE_URL}/chat`,
  contactSubmissions: `${BASE_URL}/contact`,
  leads: `${BASE_URL}/leads`,
  callDetails: `${BASE_URL}/callDetails`,  // Added this line
  deleteById: (id) => `${BASE_URL}/contact/${id}`,
  chatById: (id) => `${BASE_URL}/chat/${id}`,
  leadById: (id) => `${BASE_URL}/leads/${id}`,
  callDetailById: (id) => `${BASE_URL}/callDetails/${id}`,  // Added this line for consistency
    chatCallDetails: (chatId) => `${BASE_URL}/chats/${chatId}/call-details`,
  deleteChatCallDetail: (chatId, callId) => 
    `${BASE_URL}/chats/${chatId}/call-details/${callId}`,
};

export default API;