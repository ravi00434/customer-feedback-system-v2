// frontend/src/AdminLogin.jsx
import { useState } from 'react';
import axios from 'axios';

// IMPORTANT: Credentials are: U: admin, P: password123 (as hardcoded in app.py)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';
const API_LOGIN_URL = `${API_BASE_URL}/login`;

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
    <div className="max-w-lg mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Admin Access
        </h2>
        <p className="text-xl text-gray-600">Secure login to manage feedback</p>
      </div>

      <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-white/20">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl">🔐</span>
          </div>
        </div>
        
        {error && (
          <div className="p-6 rounded-2xl mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 text-red-800 animate-pulse">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              👤 Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 bg-white/50"
              placeholder="Enter admin username"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔑 Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 bg-white/50"
              placeholder="Enter admin password"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            🚀 Access Dashboard
          </button>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-2xl border border-blue-200">
            <p className="text-center text-sm text-gray-600 font-medium">
              💡 <strong>Demo Credentials:</strong><br/>
              Username: <code className="bg-white px-2 py-1 rounded font-mono">admin</code><br/>
              Password: <code className="bg-white px-2 py-1 rounded font-mono">password123</code>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;