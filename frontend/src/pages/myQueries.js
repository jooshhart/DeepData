import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userState';
import { useNavigate } from 'react-router-dom';

const MyQueries = () => {
  const [createdQueries, setCreatedQueries] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCreatedQueries = async () => {
      try {
        if (user) {
          const response = await axios.get(`https://deepdatavisuals.onrender.com/api/query/created/${user._id}`);
          setCreatedQueries(response.data);
        }
      } catch (error) {
        console.error('Error fetching created queries:', error);
      }
    };
    fetchCreatedQueries();
  }, [user]);

  return (
    <div>
      <h1>My Queries</h1>
      <div className="query-cards">
        {createdQueries.map((query) => (
          <div 
            key={query._id} 
            className="query-card" 
            onClick={() => navigate(`/visual/${query._id}`)}
            style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}
          >
            <h2>{query.queryName}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQueries;