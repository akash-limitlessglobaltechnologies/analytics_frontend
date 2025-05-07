import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 bg-white shadow-md z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <svg 
              className="w-8 h-8 text-blue-600" 
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
            <span className="ml-2 text-xl font-bold text-gray-800">Feedback Hub</span>
          </Link>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/feedback"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition duration-150"
              >
                Feedback Instances
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;