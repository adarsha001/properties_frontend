// const BASE_URL = "https://properties-backend-ok36.onrender.com/api";
const BASE_URL = "http://localhost:5000/api";

const API = {
  // Authentication
   adminLogin: `${BASE_URL}/admin/login`,

  // Chat Submissions
  chatSubmissions: `${BASE_URL}/chat`,
  chatById: (id) => `${BASE_URL}/chat/${id}`,
  chatCallDetails: (chatId) => `${BASE_URL}/chat/${chatId}/call-details`,

  // Contact Submissions
  contactSubmissions: `${BASE_URL}/contact`,
  deleteContactById: (id) => `${BASE_URL}/contact/${id}`,
  contactCallDetails: (contactId) => `${BASE_URL}/contact/${contactId}/call-details`,
 getContactCallDetails: (contactId) => `${BASE_URL}/contact/${contactId}/call-details`,
  // Leads
  leads: `${BASE_URL}/leads`,
  leadById: (id) => `${BASE_URL}/leads/${id}`,

  
  // Call Details (generic)
  callDetails: `${BASE_URL}/callDetails`,
  callDetailById: (id) => `${BASE_URL}/callDetails/${id}`,
   
    




      
  
  
  
  
  // Fix these two lines:
  updateContact: (id) => `${BASE_URL}/contact/${id}`,  // Added BASE_URL
  markContact: (id) => `${BASE_URL}/contact/${id}/mark`
  
};

export default API;