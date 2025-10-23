import React from 'react';
import { Navigate } from "react-router-dom";

/**
 * A wrapper component for routes that require authentication.
 * If a token exists in localStorage, it renders the child component;
 * otherwise, it redirects the user to the login page.
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - The protected component to render
 */
export default function ProtectedRoute({ children }) {
  // Check for the authentication token in localStorage
  const token = localStorage.getItem("token");
  
  // If token is present, render the child component (the intended page)
  // If not, redirect to the login page
  return token ? children : <Navigate to="/login" />;
}
