import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './pages/ApplicationForm';
import './App.css';

function App() {
  return (
    <Router>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50"
      >
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/*" element={<Dashboard />} />
          <Route path="/candidature/:filiereId" element={<ApplicationForm />} />
        </Routes>
      </motion.div>
    </Router>
  );
}

export default App;