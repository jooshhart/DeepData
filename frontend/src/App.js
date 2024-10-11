import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Queries from './pages/Queries';
import Visuals from './pages/Visuals';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
     <Router>
        <Routes>
           <Route path="/" element={<Homepage />} /> {/* Root path */}
           <Route path="/queries" element={<Queries />} />
           <Route path="/visuals" element={<Visuals />} />
           <Route path="/profile" element={<Profile />} />
        </Routes>
     </Router>
  );
}

export default App;
