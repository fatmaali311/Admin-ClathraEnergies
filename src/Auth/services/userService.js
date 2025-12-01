
import { authHeaders } from './authService';

async function safeParseJSON(response) {
 try {
  return await response.json();
 } catch {
  return null;
 }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// POST /users/add-admin
export async function addAdmin(email) {
 const res = await fetch(`${API_BASE_URL}/users/add-admin`, {
  method: 'POST',
  headers: authHeaders(),
  body: JSON.stringify({ email }),
 });
 const data = await safeParseJSON(res);
 return { ok: res.ok, status: res.status, data };
}

// GET /users/admins
export async function getAdmins(page = 1, limit = 10) {
 const res = await fetch(`${API_BASE_URL}/users/admins?page=${page}&limit=${limit}`, {
  method: 'GET',
  headers: authHeaders(),
 });
 const data = await safeParseJSON(res);
 return { ok: res.ok, status: res.status, data };
}


export async function resetPassword(token, passwordObj) {
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
 const res = await fetch(`${API_BASE_URL}/users/reset-password/${token}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }, 
  body: JSON.stringify(passwordObj),
 });
 
 // Assuming you have safeParseJSON defined/imported
 const data = await safeParseJSON(res); 
 return { ok: res.ok, status: res.status, data };
}
// PATCH /users/complete-profile/{token}

export async function completeProfile(token, body) {
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
 const res = await fetch(`${API_BASE_URL}/users/complete-profile/${token}`, {
  method: 'PATCH',
  // Note: Headers here typically don't need authHeaders since it uses a unique token
  headers: { 'Content-Type': 'application/json' }, 
  body: JSON.stringify(body),
 });
 
 const data = await safeParseJSON(res); 
 return { ok: res.ok, status: res.status, data };
}


// POST /users/forget-password
export async function forgotPassword(email) {
 const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
 const res = await fetch(`${API_BASE_URL}/users/forget-password`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email }),
 });
 
 const data = await safeParseJSON(res); 
 return { ok: res.ok, status: res.status, data };
}
// POST /users/resend-complete-profile
export async function resendCompleteProfile(email) {
 const res = await fetch(`${API_BASE_URL}/users/resend-complete-profile`, {
  method: 'POST',
  headers: authHeaders(),
  body: JSON.stringify({ email }),
 });
 const data = await safeParseJSON(res);
 return { ok: res.ok, status: res.status, data };
}

// DELETE /users/remove-admin/{id}
export async function removeAdmin(id) {
 const res = await fetch(`${API_BASE_URL}/users/remove-admin/${id}`, {
  method: 'DELETE',
  headers: authHeaders(),
 });

 const data = await safeParseJSON(res);
 return { ok: res.ok, status: res.status, data };
}


export async function updateProfile(formData) {
  const res = await fetch(`${API_BASE_URL}/users/update-profile`, {
    method: 'PATCH',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  const data = await safeParseJSON(res);
  return { ok: res.ok, status: res.status, data };
}

export async function verifyEmailChange(token) {
  const res = await fetch(`${API_BASE_URL}/users/verify-email/${token}`, {
    method: 'PATCH',
    headers: { 
      'accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    console.error("Failed to parse response:", e);
  }

  console.log('Verify Email API response:', res.status, data);

  return { ok: res.ok, status: res.status, data, error: !res.ok ? data : null };
}
