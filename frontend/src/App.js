import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Queries from './pages/Queries';
import Visuals from './pages/Visuals';
import Login from './pages/SignIn';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserProvider } from './context/userState';
import './App.css';

function App() {
  const [token, setToken] = useState();

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (
    <UserProvider>
      <Router>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Profile />} /> 
            <Route path="/home" element={<Homepage />} />
            <Route path="/queries" element={<Queries />} />
            <Route path="/visuals" element={<Visuals />} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </UserProvider>
  );
}

export default App;
