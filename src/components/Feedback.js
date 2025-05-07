import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Feedback() {
  const [instances, setInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState('');
  const [creating, setCreating] = useState(false);
  
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'https://analytics-backend-six.vercel.app';
  
  // Load instances from API
  useEffect(() => {
    const fetchInstances = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/feedback/instances`);
        
        if (response.data.success && response.data.data) {
          setInstances(response.data.data);
        } else {
          setInstances([]);
        }
      } catch (err) {
        console.error("Failed to fetch instances:", err);
        setError("Failed to load feedback instances. Please try again later.");
        setInstances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInstances();
  }, [API_URL]);

  // Handle instance creation
  const handleCreateInstance = async (e) => {
    e.preventDefault();
    
    if (!newInstanceName.trim()) {
      return;
    }
    
    try {
      setCreating(true);
      const response = await axios.post(`${API_URL}/api/feedback/instance`, {
        name: newInstanceName
      });
      
      if (response.data.success) {
        // Add new instance to the list
        const newInstance = response.data.data;
        setInstances([...instances, newInstance]);
        setNewInstanceName('');
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error("Failed to create instance:", err);
      
      // Show more specific error message if available
      const errorMessage = err.response?.data?.message || "Failed to create the feedback instance. Please try again.";
      alert(errorMessage);
    } finally {
      setCreating(false);
    }
  };

  // Navigate to instance details
  const handleInstanceClick = (instance) => {
    navigate(`/all-feedback/${instance._id || instance.id}`, { 
      state: { app: instance } 
    });
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] flex justify-center items-center flex-col px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-6 text-white font-medium">Loading instances...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2d2d2d] pt-28 pb-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 bg-[#2a2a2a] p-6 rounded-2xl shadow-xl">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Feedback Instances</h1>
            <p className="text-gray-400">Create and manage your feedback collection points</p>
          </div>
        </div>

        {error && (
          <div className="bg-gradient-to-r from-red-500/20 to-red-600/20 border-l-4 border-red-500 text-red-100 p-6 mb-8 rounded-xl shadow-lg" role="alert">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {instances.length === 0 && !error ? (
          <div className="bg-gradient-to-b from-[#2a2a2a] to-[#222222] rounded-2xl shadow-2xl p-10 text-center border border-gray-700">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-700/20 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-lg border border-blue-500/30">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">No Feedback Instances Yet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">Create your first feedback instance to start collecting valuable user insights and improve your product.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/20 font-medium"
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Instance
              </span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-400">
                {instances.length} {instances.length === 1 ? 'instance' : 'instances'} available
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-blue-500/20 font-medium flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Instance
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
              {/* Display instances */}
              {instances.map((instance) => {
                const { initial, color } = getInitialAndColor(instance.name);
                
                return (
                  <div
                    key={instance._id || instance.id}
                    onClick={() => handleInstanceClick(instance)}
                    className="bg-gradient-to-b from-[#2a2a2a] to-[#222222] rounded-2xl shadow-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-2xl border border-gray-700"
                  >
                    <div className="p-6 flex flex-col items-center">
                      {/* Avatar with first letter instead of image */}
                      <div className={`bg-gradient-to-br ${color} w-24 h-24 rounded-xl flex items-center justify-center text-white text-4xl font-bold mb-6 shadow-lg transform rotate-3`}>
                        {initial}
                      </div>
                      <h3 className="text-xl font-bold text-white text-center mb-2">{instance.name}</h3>
                      <div className="bg-black/20 px-3 py-1.5 rounded-lg text-gray-400 text-sm mb-3">
                        {instance.key ? `Key: ${instance.key.substring(0, 8)}...` : 'Click to view details'}
                      </div>
                      {instance.createdAt && (
                        <p className="text-gray-500 text-xs mt-1 flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Created: {formatDate(instance.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Create Instance Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-[#2a2a2a] to-[#222222] rounded-2xl shadow-2xl w-full max-w-md mx-4 border border-gray-700 transform transition-all duration-300 animate-fadeIn">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Create Feedback Instance</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-white transition-colors bg-gray-800 hover:bg-gray-700 rounded-full p-2"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <form onSubmit={handleCreateInstance}>
                  <div className="mb-6">
                    <label htmlFor="instanceName" className="block text-sm font-medium text-gray-300 mb-2">
                      Instance Name
                    </label>
                    <input
                      type="text"
                      id="instanceName"
                      value={newInstanceName}
                      onChange={(e) => setNewInstanceName(e.target.value)}
                      placeholder="E.g. Mobile App, Web Dashboard"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                      required
                    />
                    <p className="mt-2 text-sm text-gray-400">
                      This name will be displayed to users when they submit feedback.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl text-gray-300 font-medium hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl shadow-lg font-medium disabled:opacity-50 transition-all duration-300 hover:shadow-blue-500/20"
                      disabled={creating || !newInstanceName.trim()}
                    >
                      {creating ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating...
                        </span>
                      ) : (
                        'Create Instance'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Feedback;