import React, { createContext, useState } from 'react';
import axios from 'axios';

// Define the QueryContext
export const QueryContext = createContext();

// QueryProvider component
export const QueryProvider = ({ children }) => {
  const [queryData, setQueryData] = useState(null);

  // Function to create a new query
  const createQuery = async (queryInfo) => {
    try {
      const response = await axios.post('http://localhost:5000/api/query/create', queryInfo);
      setQueryData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating query:', error);
    }
  };

  // Function to add a participant’s answer to a query
  const addAnswer = async (answerInfo) => {
    try {
      const response = await axios.patch('http://localhost:5000/api/query/answer', answerInfo);
      setQueryData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding answer:', error);
    }
  };

  // Function to get query details
  const getQueryDetails = async (queryId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/query/detail/${queryId}`);
      setQueryData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting query details:', error);
    }
  };

  return (
    <QueryContext.Provider value={{ queryData, createQuery, addAnswer, getQueryDetails }}>
      {children}
    </QueryContext.Provider>
  );
};