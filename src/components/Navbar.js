import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-10 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg p-2 mr-3">
              <svg 
                className="w-8 h-8 text-white" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white">Feedback Hub</span>
              <span className="text-xs text-gray-400">Collect and manage feedback</span>
            </div>
          </Link>
          
          <div className="flex items-center">
            <Link
              to="/feedback"
              className="px-5 py-3 rounded-lg text-white font-medium hover:bg-opacity-80 transition duration-300 bg-gradient-to-r from-blue-600 to-blue-700 shadow-md hover:shadow-lg"
            >
              <span className="flex items-center">
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
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                Feedback Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
