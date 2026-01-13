import apiClient from "../../lib/apiClient";
import { handleRequest } from "../utils/serviceHelpers";

export async function loginUser(credentials) {
  const response = await handleRequest(apiClient.post('/auth/login', credentials));
  if (response.ok && response.data?.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response;
}

export async function logoutRequest() {
  localStorage.removeItem('token');
  return { ok: true, message: 'Logged out locally' };
}

// Fetch current logged-in user profile
export async function fetchUserProfile() {
  const response = await handleRequest(apiClient.get('/users/user-data'));
  
  if (response.ok && response.data?.user?.role) {
    // Normalize the role key to match frontend logic
    response.data.user.role = response.data.user.role.replace(/_/g, '').toLowerCase(); 
    // converts "super_admin" → "superadmin"
  }
  
  return response;
}
