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
      'bg-blue-600', 'bg-green-600', 'bg-purple-600', 
      'bg-pink-600', 'bg-indigo-600', 'bg-red-600',
      'bg-yellow-600', 'bg-teal-600', 'bg-cyan-600'
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
      <div className="flex justify-center items-center min-h-[60vh] flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        <p className="mt-6 text-gray-600 font-medium">Loading instances...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Feedback Instances</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg shadow-md transition duration-200 flex items-center font-medium"
        >
          <svg 
            className="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Create Instance
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 mb-8 rounded-md shadow-sm" role="alert">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {instances.length === 0 && !error ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No Feedback Instances Yet</h2>
          <p className="text-gray-500 mb-6">Create your first feedback instance to start collecting user feedback.</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First Instance
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* Display instances */}
          {instances.map((instance) => {
            const { initial, color } = getInitialAndColor(instance.name);
            
            return (
              <div
                key={instance._id || instance.id}
                onClick={() => handleInstanceClick(instance)}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer"
              >
                <div className="p-6 flex flex-col items-center">
                  {/* Avatar with first letter instead of image */}
                  <div className={`${color} w-20 h-20 rounded-xl flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-md`}>
                    {initial}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 text-center">{instance.name}</h3>
                  <p className="text-gray-500 text-sm mt-2 text-center">
                    {instance.key ? `Key: ${instance.key.substring(0, 8)}...` : 'Click to view details'}
                  </p>
                  {instance.createdAt && (
                    <p className="text-gray-400 text-xs mt-3">
                      Created: {formatDate(instance.createdAt)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          {/* Create new instance tile */}
          <div
            onClick={() => setShowCreateModal(true)}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 flex flex-col items-center justify-center min-h-[220px]"
          >
            <div className="p-6 flex flex-col items-center">
              <div className="w-20 h-20 flex items-center justify-center bg-blue-50 rounded-xl mb-4 border-2 border-dashed border-blue-200">
                <svg 
                  className="w-10 h-10 text-blue-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-600 text-center">Create New Instance</h3>
            </div>
          </div>
        </div>
      )}

      {/* Create Instance Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Create Feedback Instance</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateInstance}>
              <div className="mb-6">
                <label htmlFor="instanceName" className="block text-sm font-medium text-gray-700 mb-2">
                  Instance Name
                </label>
                <input
                  type="text"
                  id="instanceName"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="E.g. Mobile App, Web Dashboard"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  This name will be displayed to users when they submit feedback.
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm font-medium disabled:opacity-50 transition-colors"
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
      )}
    </div>
  );
}

export default Feedback;