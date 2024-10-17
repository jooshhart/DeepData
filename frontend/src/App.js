import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Use Routes instead of Switch
import Homepage from './pages/Homepage';
import Queries from './pages/Queries';
import Visuals from './pages/Visuals';
import SignIn from './components/SignIn.js';
import SignUp from './components/SignUp';
import ProfilePage from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />  {/* Correct element usage */}
        <Route path="/queries" element={<Queries />} />
        <Route path="/visuals" element={<Visuals />} />
        <Route path="/signin" element={<SignIn />} />  {/* Correct element usage */}
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/profile"
          element={<ProtectedRoute element={ProfilePage} />}  // Use element and ProtectedRoute for auth
        />
      </Routes>
    </Router>
  );
}

export default App;

