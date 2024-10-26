import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Queries from './pages/Queries';
import Visuals from './pages/Visuals';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProfilePage from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';  // Import Header
import Footer from './components/Footer';  // Import Footer
import './App.css';

function App() {
  return (
    <Router>
      <Header />  {/* Header is placed here to render on all pages */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/queries" element={<Queries />} />
          <Route path="/visuals" element={<Visuals />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/profile"
            element={<PrivateRoute element={ProfilePage} />}
          />
        </Routes>
      </div>
      <Footer />  {/* Footer is placed here to render on all pages */}
    </Router>
  );
}

export default App;