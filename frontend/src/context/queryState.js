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
      const { data } = await axios.post('https://deepdatavisuals.onrender.com/api/query/create', queryInfo);
      setQueryData(data); // Assuming `setQueryData` is accessible here
      return { success: true, data };
    } catch (error) {
      console.error('Error creating query:', error);
      
      // Provide more structured error handling
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create query',
        status: error.response?.status,
      };
    }
  };

   // Function to fetch query data by ID
   const fetchQueryById = async (queryId) => {

    try {
      // Make GET request to backend
      const response = await axios.get(`https://deepdatavisuals.onrender.com/api/query/${queryId}`);
      
      // Update state with response data
      setQueryData(response.data);
    } catch (err) {
      console.error('Error fetching query:', err);
    }
  };

  return (
    <QueryContext.Provider value={{ queryData, createQuery, fetchQueryById }}>
      {children}
    </QueryContext.Provider>
  );
};