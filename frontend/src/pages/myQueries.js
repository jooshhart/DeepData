import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/userState';
import { useNavigate } from 'react-router-dom';

const MyQueries = () => {
  const [createdQueries, setCreatedQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    setFilteredQueries(
      createdQueries.filter(query =>
        query.queryName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, createdQueries]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQueries = filteredQueries.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredQueries.length / itemsPerPage);

  return (
    <div>
      <input
        type="text"
        placeholder="Search Queries"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '1rem' }}
      />
      <div className="query-cards">
        {currentQueries.map((query) => (
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
      <div className="pagination">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MyQueries;