// const BASE_URL = "https://properties-backend-ok36.onrender.com/api";
const BASE_URL = "http://localhost:5000/api";

const API = {
  // Authentication
  login: `${BASE_URL}/auth/login`,

  // Chat Submissions
  chatSubmissions: `${BASE_URL}/chat`,
  chatById: (id) => `${BASE_URL}/chat/${id}`,
  chatCallDetails: (chatId) => `${BASE_URL}/chat/${chatId}/call-details`,

  // Contact Submissions
  contactSubmissions: `${BASE_URL}/contact`,
  deleteContactById: (id) => `${BASE_URL}/contact/${id}`,
  contactCallDetails: (contactId) => `${BASE_URL}/contact/${contactId}/call-details`,
  getContactCallDetails: (contactId) => `${BASE_URL}/contact/${contactId}/call-details`,
  updateContact: (id) => `${BASE_URL}/contact/${id}`,
  markContact: (id) => `${BASE_URL}/contact/${id}/mark`,

  // Leads
  leads: `${BASE_URL}/leads`,
  leadById: (id) => `${BASE_URL}/leads/${id}`,

  // Call Details (generic)
  callDetails: `${BASE_URL}/callDetails`,
  callDetailById: (id) => `${BASE_URL}/callDetails/${id}`,

  // User Management - Fixed the URLs to match your backend routes
  users: `${BASE_URL}/admin/users`,
  createUser: `${BASE_URL}/admin/users`, // POST
  getAllUsers: `${BASE_URL}/admin/users`, // GET
  updateUser: (id) => `${BASE_URL}/admin/users/${id}`, // PUT
  resetUserPassword: (id) => `${BASE_URL}/admin/users/${id}/reset-password`, // PUT
  deleteUser: (id) => `${BASE_URL}/admin/users/${id}`, // DELETE
};

export default API;