import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Welcome to Our App</h1>
        
        <div className="mb-8 text-center">
          <p className="text-gray-600 mb-4">
            This is a sample application with a navigation bar that allows you to explore different features.
          </p>
          <p className="text-gray-600">
            Use the navigation bar above to move between pages or choose one of the options below:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <div className="bg-blue-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-blue-700 mb-3">API Track</h2>
            <p className="text-gray-600 mb-4">
              View the latest API activities and track data from our sample endpoints.
            </p>
            <Link
              to="/api-activity"
              className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-300"
            >
              Go to API Track
            </Link>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-green-700 mb-3">Feedback</h2>
            <p className="text-gray-600 mb-4">
              Share your thoughts and suggestions with us to help improve our services.
            </p>
            <Link
              to="/feedback"
              className="inline-block bg-green-500 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-300"
            >
              Submit Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;