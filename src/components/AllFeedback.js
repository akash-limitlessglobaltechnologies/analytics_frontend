import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

function AllFeedback() {
  // Add custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(59, 130, 246, 0.5);
        border-radius: 10px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(59, 130, 246, 0.7);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const navigate = useNavigate();
  const { appId } = useParams();
  const location = useLocation();
  const [app, setApp] = useState(null);
  const [feedbackData, setFeedbackData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filterRating, setFilterRating] = useState(0); // 0 means no filter
  const [copied, setCopied] = useState(false);
  
  // Use React app URL for API calls
  const API_URL = process.env.REACT_APP_API_URL || 'https://analytics-backend-six.vercel.app';
  
  // Use fixed localhost URL for the feedback submission link
  const SUBMISSION_BASE_URL = 'https://analytics-backend-six.vercel.app';
  
  // Load app and feedback data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Get app info from location state
        let currentApp = location.state?.app;
        
        // If not available in location state, fetch from API
        if (!currentApp) {
          try {
            // Try to get the instance directly from API using ID as key
            const instanceResponse = await axios.get(`${API_URL}/api/feedback/instances/${appId}`);
            if (instanceResponse.data.success && instanceResponse.data.data) {
              currentApp = instanceResponse.data.data;
            }
          } catch (err) {
            console.error("Failed to fetch instance:", err);
          }
        }
        
        if (!currentApp) {
          setError("Instance not found");
          setLoading(false);
          return;
        }
        
        setApp(currentApp);
        
        // Get feedback for this instance
        try {
          const response = await axios.get(`${API_URL}/api/feedback/feedbacks/${currentApp.key}`);
          if (response.data.success) {
            setFeedbackData(response.data.data || []);
          } else {
            setFeedbackData([]);
          }
        } catch (err) {
          console.error("Failed to fetch feedback:", err);
          setFeedbackData([]);
        }
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [appId, location.state, API_URL]);
  
  // Handle deleting an instance
  const handleDeleteInstance = async () => {
    if (!app || !app.key) return;
    
    try {
      setDeleting(true);
      
      const response = await axios.delete(`${API_URL}/api/feedback/instance/${app.key}`);
      
      if (response.data.success) {
        navigate('/feedback');
      } else {
        alert("Failed to delete the instance. Please try again.");
      }
    } catch (err) {
      console.error("Error deleting instance:", err);
      alert("An error occurred while deleting the instance.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };
  
  // Filter feedback based on rating
  const filteredFeedback = filterRating > 0 
    ? feedbackData.filter(item => item.rating === filterRating)
    : feedbackData;
  
  // Copy feedback URL to clipboard
  const copyFeedbackUrl = () => {
    const url = `${SUBMISSION_BASE_URL}/api/feedback/submit/${app?.key}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch(err => {
        console.error("Failed to copy URL:", err);
        alert("Failed to copy URL. Please try again.");
      });
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get initial letter and color for avatar
  const getInitialAndColor = (name) => {
    if (!name || typeof name !== 'string') return { initial: '?', color: 'bg-gray-500' };
    
    const initial = name.charAt(0).toUpperCase();
    
    // Generate a consistent color based on the name
    const colors = [
      'from-blue-600 to-blue-800', 
      'from-green-600 to-green-800', 
      'from-purple-600 to-purple-800',
      'from-pink-600 to-pink-800', 
      'from-indigo-600 to-indigo-800', 
      'from-red-600 to-red-800',
      'from-yellow-600 to-yellow-800', 
      'from-teal-600 to-teal-800', 
      'from-cyan-600 to-cyan-800'
    ];
    
    const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    
    return { initial, color: colors[colorIndex] };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-6 text-white font-medium text-center">Loading instance data...</p>
      </div>
    );
  }
  
  // Error state
  if (error || !app) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 pt-10 pb-10 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="bg-red-900/20 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded-lg shadow-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{error || "Instance not found"}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/feedback')}
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg shadow-lg transition-all duration-300 flex items-center mx-auto"
          >
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Instances
          </button>
        </div>
      </div>
    );
  }
  
  // Get avatar data
  const { initial, color } = getInitialAndColor(app.name);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 pt-6 pb-10 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Back button - Larger touch target for mobile */}
        <button 
          onClick={() => navigate('/feedback')}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6 font-medium transition-all duration-300 transform hover:translate-x-[-4px] group"
          aria-label="Back to instances"
        >
          <div className="bg-blue-900/30 p-3 rounded-lg mr-2 group-hover:bg-blue-800/40 transition-colors">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-base md:text-lg">Back to Instances</span>
        </button>
        
        {/* App Header - Better mobile layout */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden p-4 md:p-6 mb-6 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center">
            {/* Avatar with first letter instead of image - Fixed dimensions for consistency */}
                            <div className={`bg-gradient-to-br ${color} w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mb-4 md:mb-0 md:mr-6 shadow-lg transform rotate-3`}>
              {initial}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-white mb-3">{app.name}</h1>
              
              {/* Instance Key - Improved mobile layout */}
              <div className="mt-3 flex flex-col md:flex-row items-center md:items-start">
                <span className="text-sm font-medium text-gray-400 mr-2 mb-1 md:mb-0">Instance Key:</span>
                <div className="w-full md:w-auto overflow-x-auto max-w-full">
                  <code className="bg-black/30 px-2 py-1 rounded-lg text-blue-300 text-sm font-mono inline-block">
                    {app.key}
                  </code>
                </div>
              </div>
              
              {/* Feedback URL with copy tooltip - Better responsive handling */}
              <div className="mt-3 relative">
                <div className="flex flex-col md:flex-row items-start">
                  <span className="text-sm font-medium text-gray-400 mr-2 mb-1 md:mb-0">Feedback URL:</span>
                  <div className="flex items-center mt-1 md:mt-0 group relative w-full">
                    <div className="w-full overflow-x-auto max-w-full">
                      <code className="bg-black/30 px-2 py-1 rounded-lg text-blue-300 text-sm font-mono inline-block truncate" style={{maxWidth: "calc(100vw - 120px)"}}>
                        {`${SUBMISSION_BASE_URL}/api/feedback/submit/${app.key}`}
                      </code>
                    </div>
                    <button 
                      onClick={copyFeedbackUrl}
                      className="ml-2 text-blue-400 hover:text-blue-300 p-2 rounded-lg hover:bg-blue-900/30 transition-colors flex-shrink-0"
                      aria-label="Copy URL"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path>
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path>
                      </svg>
                    </button>
                    {copied && (
                      <span className="absolute top-[-30px] left-1/2 transform -translate-x-1/2 px-2 py-1 bg-blue-900 text-white text-xs rounded-lg shadow-lg whitespace-nowrap z-10">
                        URL copied!
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1 md:ml-24">Share this URL to collect feedback</p>
              </div>
            </div>
            
            {/* Delete button - Bigger touch target for mobile */}
            <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-auto flex justify-center md:justify-start">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-4 py-3 rounded-lg transition-all duration-300 flex items-center shadow-lg hover:shadow-red-600/10 w-full md:w-auto justify-center"
                aria-label="Delete instance"
              >
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Delete Instance
              </button>
            </div>
          </div>
        </div>
        
        {/* Feedback List - Improved mobile layout */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden p-4 md:p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-0 flex items-center">
              User Feedback
              <span className="ml-2 text-sm font-normal text-gray-400 bg-black/30 px-2 py-1 rounded-lg">
                {filteredFeedback.length} {filteredFeedback.length === 1 ? 'item' : 'items'}
              </span>
            </h2>
            
            {/* Filter by rating - Full width on mobile */}
            <div className="flex items-center bg-black/30 p-3 rounded-xl w-full md:w-auto">
              <span className="text-sm font-medium text-gray-300 mr-2 whitespace-nowrap">Filter by rating:</span>
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                className="border border-gray-700 rounded-lg px-3 py-2 text-sm bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer flex-grow md:flex-grow-0 min-h-[44px]"
                aria-label="Filter ratings"
              >
                <option value="0">All ratings</option>
                <option value="5">★★★★★ (5)</option>
                <option value="4">★★★★☆ (4)</option>
                <option value="3">★★★☆☆ (3)</option>
                <option value="2">★★☆☆☆ (2)</option>
                <option value="1">★☆☆☆☆ (1)</option>
              </select>
            </div>
          </div>
          
          {filteredFeedback.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="bg-blue-900/20 p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-gray-300 font-medium mb-6 text-lg">No feedback has been submitted yet</p>
              <div className="mt-4 p-5 bg-gray-800 rounded-xl max-w-lg mx-auto shadow-lg border border-gray-700">
                <h3 className="font-medium text-blue-400 mb-4 flex items-center text-base justify-center md:justify-start">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  How to collect feedback:
                </h3>
                <ol className="text-gray-400 text-sm list-decimal list-inside space-y-3 text-left">
                  <li className="pl-2">Copy the feedback URL from above</li>
                  <li className="pl-2">Share this URL with your users</li>
                  <li className="pl-2">Users can submit feedback through the URL</li>
                  <li className="pl-2">All submissions will appear here automatically</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFeedback.map(item => {
                // Get avatar details for the feedback author
                const { initial: userInitial, color: userColor } = getInitialAndColor(item.name || 'Anonymous');
                
                return (
                  <div key={item.id || item._id} className="border border-gray-700 rounded-xl p-4 bg-gray-900 hover:shadow-lg transition-shadow">
                    <div className="flex items-start">
                      {/* User avatar with first letter - Consistent size */}
                      <div className={`bg-gradient-to-br ${userColor} w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md`}>
                        {userInitial}
                      </div>
                      
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div className="max-w-full overflow-hidden">
                            <h3 className="text-base font-bold text-white">{item.name || "Anonymous"}</h3>
                            <p className="text-gray-400 text-xs">{formatDate(item.createdAt)}</p>
                            {item.userEmail && <p className="text-gray-500 text-xs mt-1 truncate" title={item.userEmail}>{item.userEmail}</p>}
                          </div>
                          <div className="flex items-center mt-2 md:mt-0 bg-black/20 px-2 py-1 rounded-lg self-start">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i}
                                className={`w-5 h-5 ${i < item.rating ? 'text-yellow-400' : 'text-gray-600'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        {item.message ? (
                          <div className="mt-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
                            <div className="max-h-40 overflow-y-auto custom-scrollbar">
                              <p className="text-gray-300 text-sm break-words whitespace-pre-wrap">{item.message}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredFeedback.length > 5 && (
                <div className="flex justify-center mt-6">
                  <button
                    className="bg-gray-800 hover:bg-gray-700 text-blue-400 font-medium py-3 px-4 border border-gray-700 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Back to top"
                  >
                    <span className="flex items-center">
                      <svg className="w-5 h-5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back to Top
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Delete Confirmation Modal - Improved for mobile */}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-5 w-full max-w-md border border-gray-700 transform transition-all duration-300">
              <div className="text-center mb-5">
                <div className="w-16 h-16 mx-auto bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Delete Instance</h2>
              </div>
              
              <p className="text-gray-300 mb-6 text-center text-base">
                Are you sure you want to delete <span className="font-bold text-white">{app.name}</span>? This action cannot be undone, and all feedback will be permanently deleted.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center items-center space-y-3 md:space-y-0 md:space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full md:w-auto px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors border border-gray-600"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteInstance}
                  className="w-full md:w-auto px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg font-medium disabled:opacity-50 transition-all duration-300"
                  disabled={deleting}
                >
                  {deleting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    'Delete Instance'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllFeedback;