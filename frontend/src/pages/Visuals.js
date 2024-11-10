import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userState';
import { useNavigate } from 'react-router-dom';

const Visuals = () => {
  const [participatedQueries, setParticipatedQueries] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchParticipatedQueries = async () => {
      try {
        if (user) {
          const response = await axios.get(`http://localhost:5000/api/query/participated/${user._id}`);
          setParticipatedQueries(response.data);
        }
      } catch (error) {
        console.error('Error fetching participated queries:', error);
      }
    };
    fetchParticipatedQueries();
  }, [user]);

  return (
    <div>
      <h1>Visuals of Participated Queries</h1>
      <div className="query-cards">
        {participatedQueries.map((query) => (
          <div 
            key={query._id} 
            className="query-card" 
            onClick={() => navigate(`/visual/${query._id}`)}
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

export default Visuals;