import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user details here
  const [token, setToken] = useState(null); // Store the JWT token here

  // Define fetchUser here
  const fetchUser = async (token) => {
    try {
      const response = await axios.get('/api/users/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user); // Update user state with fetched data
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      logout(); // Logout if fetching fails (e.g., token expired)
    }
  };

  useEffect(() => {
    // Optionally, check if there's a saved token in localStorage on component mount
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken);
    }
  }, []);

  // Function to handle login
  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/users/login', { username, password });
      const { token, user } = response.data; // Extract user details from response

      // Save token and user data in state and localStorage
      setToken(token);
      setUser(user); // User details like username, email, etc.
      localStorage.setItem('token', token); // Persist token in localStorage

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
