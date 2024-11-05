import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Queries from './pages/Queries';
import Visuals from './pages/Visuals';
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile';
import Header from './components/Header';
import Footer from './components/Footer';
import { UserContext } from './context/userState';
import './App.css';

function App() {
  const { token, setToken } = useContext(UserContext);

  if (!token) {
    return <AuthPage setToken={setToken} />;
  }

  return (
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
  );
}

export default App;
