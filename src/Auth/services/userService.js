import apiClient from '../../lib/apiClient';
import { handleRequest } from '../utils/serviceHelpers';

// POST /users/add-admin
export async function addAdmin(email) {
  return handleRequest(apiClient.post('/users/add-admin', { email }));
}

// GET /users/admins
export async function getAdmins(page = 1, limit = 10) {
  return handleRequest(apiClient.get(`/users/admins?page=${page}&limit=${limit}`));
}

// POST /users/reset-password/:token
export async function resetPassword(token, passwordObj) {
  return handleRequest(apiClient.post(`/users/reset-password/${token}`, passwordObj));
}

// PATCH /users/complete-profile/:token
export async function completeProfile(token, body) {
  return handleRequest(apiClient.patch(`/users/complete-profile/${token}`, body));
}

// POST /users/forget-password
export async function forgotPassword(email) {
  return handleRequest(apiClient.post('/users/forget-password', { email }));
}

// POST /users/resend-complete-profile
export async function resendCompleteProfile(email) {
  return handleRequest(apiClient.post('/users/resend-complete-profile', { email }));
}

// DELETE /users/remove-admin/:id
export async function removeAdmin(id) {
  return handleRequest(apiClient.delete(`/users/remove-admin/${id}`));
}

// PATCH /users/update-profile
export async function updateProfile(formData) {
  // Axios automatically sets Content-Type to multipart/form-data when body is FormData
  return handleRequest(apiClient.patch('/users/update-profile', formData));
}

// PATCH /users/verify-email/:token
export async function verifyEmailChange(token) {
  return handleRequest(apiClient.patch(`/users/verify-email/${token}`));
}
