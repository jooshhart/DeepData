// queryDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userState';
import { QueryContext } from '../context/queryState';
import axios from 'axios';

const QueryDetails = () => {
  const { id: queryId } = useParams();
  const { user, calculateAge } = useContext(UserContext);
  const { queryData, fetchQueryById } = useContext(QueryContext);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the query details on component mount
    fetchQueryById(queryId);
  }, [queryId, fetchQueryById]);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = async () => {
    if (!user) {
      console.error("User information is missing.");
      return;
    }

    // Calculate age based on birthdate from UserContext
    const age = calculateAge(user.birthdate);

    try {
      await axios.patch('http://localhost:5000/api/query/answer', {
        queryId,
        userId: user._id,
        answer: selectedAnswer,
        age,
        gender: user.gender,
        ethnicity: user.ethnicity,
        country: user.country,
      });
      // Navigate to the visuals page after successfully submitting the answer
      navigate('/visuals');
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (!queryData) return <p>Loading query details...</p>;

  return (
    <div>
      <h1>{queryData.queryName}</h1>
      <p>Created by: {queryData.createdBy}</p>
      <h3>Select Your Answer</h3>
      <ul>
        {queryData.answers.map((answer, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                name="answer"
                value={answer}
                checked={selectedAnswer === answer}
                onChange={() => handleAnswerSelect(answer)}
              />
              {answer}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
        Select
      </button>
    </div>
  );
};

export default QueryDetails;