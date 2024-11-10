import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userState';
import { useNavigate } from 'react-router-dom';

const Queries = () => {
  const [unparticipatedQueries, setUnparticipatedQueries] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnparticipatedQueries = async () => {
      try {
        if (user) {
          const response = await axios.get(`http://localhost:5000/api/query/unparticipated/${user._id}`);
          setUnparticipatedQueries(response.data);
        }
      } catch (error) {
        console.error('Error fetching unparticipated queries:', error);
      }
    };
    fetchUnparticipatedQueries();
  }, [user]);

  return (
    <div>
      <h1>Available Queries</h1>
      <div className="query-cards">
        {unparticipatedQueries.map((query) => (
          <div 
            key={query._id} 
            className="query-card" 
            onClick={() => navigate(`/query/${query._id}`)}
            style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}
          >
            <h2>{query.queryName}</h2>
            <p>Created by: {query.createdBy.userName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Queries;