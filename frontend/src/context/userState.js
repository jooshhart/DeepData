import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const LOAD_USER = 'LOAD_USER';
export const LOGOUT = 'LOGOUT';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const REGISTER_FAIL = 'REGISTER_FAIL';
export const AUTH_ERROR = 'AUTH_ERROR';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const DELETE_USER_SUCCESS = 'DELETE_USER_SUCCESS';
export const UPDATE_USER_FAIL = 'UPDATE_USER_FAIL';
export const GET_USERS_FAIL = 'GET_USERS_FAIL';
export const DELETE_USER_FAIL = 'DELETE_USER_FAIL';

// Initial State
const initialState = {
  user: null,
  users: [],
  loading: true,
  error: null,
  token: localStorage.getItem('token') || null,
};

// Reducer Function
const userReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loading: false,
        error: null,
      };
    case LOAD_USER:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case GET_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload,
        loading: false,
        error: null,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case LOGOUT:
    case LOGIN_FAIL:
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case UPDATE_USER_FAIL:
    case GET_USERS_FAIL:
    case DELETE_USER_FAIL:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

// Create Context
const UserContext = createContext();

// UserProvider Component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load User on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const res = await axios.get('/api/users/profile', {
            headers: { Authorization: `Bearer ${state.token}` },
          });
          dispatch({ type: LOAD_USER, payload: res.data });
        } catch (err) {
          dispatch({ type: AUTH_ERROR, payload: 'Failed to load user data' });
        }
      }
    };

    loadUser();
  }, [state.token]);

  // Register User Action
  const registerUser = async (userData) => {
    try {
      const res = await axios.post('/api/users', userData);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: { token: res.data.token, user: res.data },
      });
    } catch (err) {
      dispatch({ type: REGISTER_FAIL, payload: 'Registration failed' });
    }
  };

  // Login User Action
  const loginUser = async (email, password) => {
    try {
      const res = await axios.post('/api/users/auth', { email, password });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { token: res.data.token, user: res.data },
      });
    } catch (err) {
      dispatch({ type: LOGIN_FAIL, payload: 'Login failed' });
    }
  };

  // Logout User Action
  const logoutUser = () => {
    axios.post('/api/users/logout');  // Clear cookie on the backend
    dispatch({ type: LOGOUT });
  };

  // Update User Action
  const updateUser = async (userData) => {
    try {
      const res = await axios.put('/api/users/profile', userData, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      dispatch({ type: UPDATE_USER_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: UPDATE_USER_FAIL, payload: 'Update failed' });
    }
  };

  // Get All Users Action (admin)
  const getUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      dispatch({ type: GET_USERS_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: GET_USERS_FAIL, payload: 'Failed to get users' });
    }
  };

  // Delete User Action (admin)
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${state.token}` },
      });
      dispatch({ type: DELETE_USER_SUCCESS });
    } catch (err) {
      dispatch({ type: DELETE_USER_FAIL, payload: 'Failed to delete user' });
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: state.user,
        users: state.users,
        token: state.token,
        loading: state.loading,
        error: state.error,
        loginUser,
        registerUser,
        logoutUser,
        updateUser,
        getUsers,
        deleteUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
