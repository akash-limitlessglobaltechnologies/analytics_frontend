import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Feedback from './components/Feedback';
import AllFeedback from './components/AllFeedback';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="pt-16 pb-8 px-4 md:px-0"> {/* Add padding for fixed navbar */}
          <Routes>
            <Route path="/" element={<Navigate to="/feedback" replace />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/all-feedback/:appId" element={<AllFeedback />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;