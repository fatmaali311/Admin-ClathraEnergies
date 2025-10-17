// src/services/authService.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function safeParseJSON(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}



export function authHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await safeParseJSON(res);

  if (res.ok && data?.token) {
    localStorage.setItem('token', data.token);
  }

  return { ok: res.ok, status: res.status, data };
}

export async function logoutRequest() {
 
  localStorage.removeItem('token');
  return { ok: true, message: 'Logged out locally' };
}

// 🔹 Fetch current logged-in user profile
export async function fetchUserProfile() {
  const res = await fetch(`${API_BASE_URL}/users/user-data`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const data = await safeParseJSON(res);

  // ✅ Normalize the role key to match frontend logic
  if (data?.user?.role) {
    data.user.role = data.user.role.replace(/_/g, '').toLowerCase(); 
    // converts "super_admin" → "superadmin"
  }

  return { ok: res.ok, status: res.status, data };
}