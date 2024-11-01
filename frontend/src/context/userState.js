import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const fetchUser = async (token, setUser, logout) => {
  try {
    const response = await axios.get('/api/users/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(response.data.user);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    logout(); // Use logout function passed as an argument
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details here
  const [token, setToken] = useState(null); // Store the JWT token here

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken, setUser, logout); // Pass setUser and logout as arguments
    }
  }, []);

  // Function to handle login
  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/users/login', { username, password });
      const { token, user } = response.data; // `user` contains id, username, email
  
      // Update the context with user information
      setToken(token);
      setUser({
        id: user._id,
        username: user.username,
        email: user.email,
      });
      localStorage.setItem('token', token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Function to log out the user
  const logout = () => {
    setToken(null);
    setUser(null); // Clear user details
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};