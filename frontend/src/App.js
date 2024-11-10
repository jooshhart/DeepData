import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Queries from './pages/Queries';
import Visuals from './pages/Visuals';
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile';
import CreateQuery from './pages/createQuery';
import QueryDetails from './pages/queryDetails'
import VisualDetails from './pages/visualDetails';
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
        <div className="app-container">
          <Header />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Profile />} /> 
              <Route path="/home" element={<Homepage />} />
              <Route path="/create" element={<CreateQuery />} />
              <Route path="/queries" element={<Queries />} />
              <Route path="/query/:id" element={<QueryDetails />} />
              <Route path="/visual/:id" element={<VisualDetails />} />
              <Route path="/visuals" element={<Visuals />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
