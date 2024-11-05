import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();

const fetchUser = async (token, setUser, logout) => {
  try {
    const response = await axios.get('http://localhost:5000/api/users/user', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(response.data.user);
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    logout();
  }
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUser(savedToken, setUser, logout);
    }
  }, []);

  // Function to handle login
  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Function to register a user
  const register = async (username, password, email) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, password, email });
      console.log("User registered successfully:", response.data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Function to update user information
  const updateUser = async (updatedInfo) => {
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/user',
        updatedInfo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data.user);
      console.log("User updated successfully:", response.data);
    } catch (error) {
      console.error("User update failed:", error);
    }
  };

  // Function to log out the user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      login,
      register,
      updateUser,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
};