// frontend/src/AdminLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';

// IMPORTANT: Credentials are: U: admin, P: password123 (as hardcoded in app.py)
const API_LOGIN_URL = 'http://127.0.0.1:5000/api/login';

// This component sends credentials and stores the JWT token upon success
const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Send credentials to the Flask login endpoint
      const response = await axios.post(API_LOGIN_URL, {
        username: username,
        password: password,
      });

      // 1. Store the token in the browser's local storage
      const token = response.data.access_token;
      localStorage.setItem('access_token', token);
      
      // 2. Notify the parent component (App.jsx) that login succeeded
      onLoginSuccess(); 
      
    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      setError('Login failed. Check username/password or backend connection.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-200 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Admin Login</h2>
      
      {error && <p className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Login
        </button>
        <p className="text-center text-xs text-gray-500 mt-2">Hint: U: admin, P: password123</p>
      </form>
    </div>
  );
};

export default AdminLogin;