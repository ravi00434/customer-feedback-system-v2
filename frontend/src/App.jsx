import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLogin from './AdminLogin';

// Advanced UI Components
const StarRating = ({ rating, onRatingChange, interactive = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? "button" : undefined}
          className={`text-3xl transition-all duration-200 ${
            interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          } ${
            star <= (hoverRating || rating)
              ? 'text-yellow-400 drop-shadow-lg'
              : 'text-gray-300'
          }`}
          onClick={interactive ? () => onRatingChange(star) : undefined}
          onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
          onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        >
          ⭐
        </button>
      ))}
      {interactive && (
        <span className="ml-3 text-lg font-semibold text-gray-700">
          {hoverRating || rating}/5
        </span>
      )}
    </div>
  );
};

const AnimatedCounter = ({ value, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value);
    if (start === end) return;
    
    const totalMilSecDur = parseInt(duration);
    const incrementTime = (totalMilSecDur / end) * 1000;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(String(start));
      if (start === end) clearInterval(timer);
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);
  
  return <span>{count}</span>;
};

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
      
      {/* Large gradient orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>
    </div>
  );
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

const App = () => {
  const [currentView, setCurrentView] = useState('customer'); // 'customer', 'admin', 'admin-panel'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('admin-panel');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setCurrentView('customer');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Advanced animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
      <ParticleBackground />
      
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>

      <nav className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-24">
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl animate-glow">
                    <span className="text-white font-bold text-2xl animate-pulse">⭐</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                    FeedbackHub Pro
                  </h1>
                  <p className="text-white/70 text-sm font-medium">Premium Feedback Management</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView('customer')}
                className={`group px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-500 transform hover:scale-110 hover:rotate-1 ${
                  currentView === 'customer' 
                    ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl shadow-purple-500/50' 
                    : 'text-white/80 hover:text-white hover:bg-white/10 border border-white/20'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">💬</span>
                  <span>Submit Feedback</span>
                </span>
              </button>
              {!isLoggedIn ? (
                <button
                  onClick={() => setCurrentView('admin')}
                  className={`group px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-500 transform hover:scale-110 hover:rotate-1 ${
                    currentView === 'admin' 
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl shadow-purple-500/50' 
                      : 'text-white/80 hover:text-white hover:bg-white/10 border border-white/20'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span className="text-lg">🔐</span>
                    <span>Admin Access</span>
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setCurrentView('admin-panel')}
                    className={`group px-8 py-4 rounded-2xl text-sm font-bold transition-all duration-500 transform hover:scale-110 hover:rotate-1 ${
                      currentView === 'admin-panel' 
                        ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-2xl shadow-purple-500/50' 
                        : 'text-white/80 hover:text-white hover:bg-white/10 border border-white/20'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-lg">📊</span>
                      <span>Dashboard</span>
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-400/30 transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-lg">🚪</span>
                      <span>Logout</span>
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto py-16 sm:px-6 lg:px-8">
        <div className="animate-slide-in-up">
          {currentView === 'customer' && <CustomerFeedbackForm />}
          {currentView === 'admin' && !isLoggedIn && <AdminLogin onLoginSuccess={handleLoginSuccess} />}
          {currentView === 'admin-panel' && isLoggedIn && <AdminPanel />}
        </div>
      </main>
    </div>
  );
};

const CustomerFeedbackForm = () => {
  const [formData, setFormData] = useState({
    product_id: '',
    customer_name: '',
    rating: 5,
    review_text: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      await axios.post(`${API_BASE_URL}/feedback`, formData);
      setMessage('Thank you for your feedback!');
      setFormData({ product_id: '', customer_name: '', rating: 5, review_text: '' });
    } catch (error) {
      setMessage('Error submitting feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-block p-4 bg-white/10 backdrop-blur-lg rounded-3xl mb-8 animate-float">
          <span className="text-8xl">🌟</span>
        </div>
        <h2 className="text-7xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-6 animate-gradient-x">
          Share Your Experience
        </h2>
        <p className="text-2xl text-white/80 max-w-3xl mx-auto leading-relaxed">
          Your voice matters! Help us create amazing experiences by sharing your honest feedback
        </p>
        <div className="flex justify-center space-x-8 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">4.8/5</div>
            <div className="text-white/60">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400">1,247</div>
            <div className="text-white/60">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">99%</div>
            <div className="text-white/60">Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl p-12 border border-white/20 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
        
        {message && (
          <div className={`p-8 rounded-3xl mb-10 border-2 ${
            message.includes('Thank you') 
              ? 'bg-gradient-to-r from-green-400/20 to-emerald-400/20 border-green-400 text-green-100' 
              : 'bg-gradient-to-r from-red-400/20 to-pink-400/20 border-red-400 text-red-100'
          } animate-pulse shadow-2xl`}>
            <div className="flex items-center justify-center">
              <span className="text-4xl mr-4">{message.includes('Thank you') ? '🎉' : '⚠️'}</span>
              <span className="font-bold text-xl">{message}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="block text-lg font-bold text-white mb-3 flex items-center">
                <span className="text-2xl mr-3">🏷️</span>
                Product/Service ID
              </label>
              <input
                type="text"
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                required
                className="w-full px-6 py-5 border-2 border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-400 transition-all duration-500 bg-white/10 backdrop-blur-lg text-white placeholder-white/60 text-lg"
                placeholder="e.g., PROD-001, SERVICE-X"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-lg font-bold text-white mb-3 flex items-center">
                <span className="text-2xl mr-3">👤</span>
                Your Name
              </label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                className="w-full px-6 py-5 border-2 border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-400 transition-all duration-500 bg-white/10 backdrop-blur-lg text-white placeholder-white/60 text-lg"
                placeholder="Enter your full name"
              />
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-lg font-bold text-white mb-4 flex items-center">
              <span className="text-2xl mr-3">⭐</span>
              Rate Your Experience
            </label>
            <div className="flex flex-col items-center space-y-6 p-8 bg-white/5 rounded-3xl border border-white/20">
              <StarRating 
                rating={formData.rating} 
                onRatingChange={(rating) => setFormData(prev => ({...prev, rating}))}
                interactive={true}
              />
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">
                  {formData.rating === 1 && "😞 Poor"}
                  {formData.rating === 2 && "😐 Fair"}
                  {formData.rating === 3 && "🙂 Good"}
                  {formData.rating === 4 && "😊 Very Good"}
                  {formData.rating === 5 && "🤩 Excellent"}
                </div>
                <p className="text-white/60">Click the stars to rate</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-lg font-bold text-white mb-3 flex items-center">
              <span className="text-2xl mr-3">💭</span>
              Tell Us More
            </label>
            <textarea
              name="review_text"
              value={formData.review_text}
              onChange={handleChange}
              required
              rows={8}
              className="w-full px-6 py-5 border-2 border-white/30 rounded-2xl shadow-lg focus:outline-none focus:ring-4 focus:ring-pink-400/50 focus:border-pink-400 transition-all duration-500 bg-white/10 backdrop-blur-lg text-white placeholder-white/60 text-lg resize-none"
              placeholder="Share your detailed experience... What did you love? What could we improve? Your honest feedback helps us grow! ✨"
            />
            <div className="text-right text-white/60 text-sm">
              {formData.review_text.length}/500 characters
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-8 px-12 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-black text-2xl rounded-3xl shadow-2xl hover:shadow-pink-500/50 transform hover:scale-105 hover:-rotate-1 transition-all duration-500 disabled:opacity-50 disabled:transform-none relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 flex items-center justify-center">
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-4 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Your Amazing Feedback...
                </>
              ) : (
                <>
                  <span className="text-3xl mr-4">🚀</span>
                  Submit Your Feedback
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminPanel = () => {
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({ total: 0, average_rating: 0 });
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ rating: 5, review_text: '' });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_BASE_URL}/admin/feedback`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedback(response.data.feedback);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.delete(`${API_BASE_URL}/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchFeedback();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditData({ rating: item.rating, review_text: item.review_text });
  };

  const saveEdit = async () => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.put(`${API_BASE_URL}/feedback/${editingId}`, editData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditingId(null);
      fetchFeedback();
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({ rating: 5, review_text: '' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Admin Dashboard
        </h2>
        <p className="text-xl text-gray-600">Manage and analyze customer feedback</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-3xl shadow-xl text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Total Feedback</h3>
              <p className="text-4xl font-bold mt-2">{stats.total}</p>
            </div>
            <div className="text-5xl opacity-80">📊</div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-3xl shadow-xl text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Average Rating</h3>
              <p className="text-4xl font-bold mt-2">{stats.average_rating}/5</p>
            </div>
            <div className="text-5xl opacity-80">⭐</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-3xl shadow-xl text-white transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold opacity-90">Satisfaction</h3>
              <p className="text-4xl font-bold mt-2">{Math.round((stats.average_rating / 5) * 100)}%</p>
            </div>
            <div className="text-5xl opacity-80">😊</div>
          </div>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/20 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            💬 All Feedback ({feedback.length})
          </h3>
        </div>
        
        <div className="divide-y divide-gray-100">
          {feedback.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-xl text-gray-500">No feedback yet. Encourage customers to share their thoughts!</p>
            </div>
          ) : (
            feedback.map((item, index) => (
              <div key={item._id} className={`p-8 hover:bg-purple-50/50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/30' : 'bg-gray-50/30'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
                          {item.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900 text-lg">{item.customer_name}</span>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                        🏷️ {item.product_id}
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        📅 {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {editingId === item._id ? (
                      <div className="space-y-6 bg-white/50 p-6 rounded-2xl border-2 border-purple-200">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">⭐ Rating</label>
                          <select
                            value={editData.rating}
                            onChange={(e) => setEditData({...editData, rating: parseInt(e.target.value)})}
                            className="px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300"
                          >
                            <option value={1}>⭐ 1 - Poor</option>
                            <option value={2}>⭐⭐ 2 - Fair</option>
                            <option value={3}>⭐⭐⭐ 3 - Good</option>
                            <option value={4}>⭐⭐⭐⭐ 4 - Very Good</option>
                            <option value={5}>⭐⭐⭐⭐⭐ 5 - Excellent</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">💭 Review</label>
                          <textarea
                            value={editData.review_text}
                            onChange={(e) => setEditData({...editData, review_text: e.target.value})}
                            rows={4}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-purple-400 transition-all duration-300 resize-none"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={saveEdit}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                          >
                            ✅ Save Changes
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                          >
                            ❌ Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center mb-4">
                          <div className="text-3xl mr-3">
                            {'⭐'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                          </div>
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-bold">
                            {item.rating}/5 Stars
                          </span>
                        </div>
                        <div className="bg-white/50 p-6 rounded-2xl border-l-4 border-purple-400">
                          <p className="text-gray-800 text-lg leading-relaxed">{item.review_text}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {editingId !== item._id && (
                    <div className="flex space-x-3 ml-6">
                      <button
                        onClick={() => startEdit(item)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => deleteFeedback(item._id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
