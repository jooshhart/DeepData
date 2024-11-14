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
      const response = await axios.post('https://deepdatavisuals.onrender.com/api/users/login', { username, password });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      window.location.reload()
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Function to register a user
  const register = async (username, email, password, birthdate, gender, ethnicity, country) => {
    try {
      const response = await axios.post('https://deepdatavisuals.onrender.com/api/users/register', {
        username,
        email,
        password,
        birthdate,
        gender,
        ethnicity,
        country,
      });
      console.log("User registered successfully:", response.data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };
  

  // Function to update the user
  const updateUser = async (updatedData) => {
    try {
      const response = await axios.patch(`https://deepdatavisuals.onrender.com/api/users/update/${user._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);  // Update the user state with the updated data
      console.log("User updated successfully:", response.data);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  // Function to log out the user
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  // Function to calculate age based on birthdate
  const calculateAge = (birthdate) => {
    if (!birthdate) return null;
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <UserContext.Provider value={{
      user,
      token,
      login,
      register,
      updateUser,
      logout,
      calculateAge
    }}>
      {children}
    </UserContext.Provider>
  );
};