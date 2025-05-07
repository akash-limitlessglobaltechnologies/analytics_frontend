import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function ApiActivity() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // This is a placeholder API. In a real app, replace with your actual API endpoint
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">API Track</h1>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Sample API Data:</h2>
            <ul className="divide-y divide-gray-200">
              {data.map((item) => (
                <li key={item.id} className="py-4">
                  <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-gray-600">{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        

      </div>
    </div>
  );
}

export default ApiActivity;