import React, { createContext, useContext, useReducer } from 'react';
import axios from 'axios';

const UserContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token };
    case 'LOGOUT':
      return { ...state, user: null, token: null };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/users/login', { email, password });
    localStorage.setItem('token', data.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: data });
  };

  const register = async (userData) => {
    await axios.post('/api/users/register', userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  const getProfile = async () => {
    const { data } = await axios.get('/api/users/profile', {
      headers: { Authorization: `Bearer ${state.token}` },
    });
    return data;
  };

  return (
    <UserContext.Provider value={{ ...state, login, register, logout, getProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
