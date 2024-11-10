import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { QueryContext } from '../context/queryState';
import { UserContext } from '../context/userState';

const CreateQuery = () => {
  const { createQuery } = useContext(QueryContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); // Initialize the navigate function

  const [queryName, setQueryName] = useState('');
  const [answers, setAnswers] = useState(['']); // Start with one answer field by default
  const [message, setMessage] = useState(null); // Message for success or error feedback

  // Handler to update answer options
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // Handler to add a new answer field
  const addAnswerField = () => {
    setAnswers([...answers, '']);
  };

  // Handler to submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verify user is available from context
    if (!user) {
      setMessage('User must be logged in to create a query.');
      return;
    }

    // Prepare query data
    const queryData = {
      queryName,
      createdBy: {
        userId: user._id,
        userName: user.username,
      },
      answers: answers.filter(answer => answer.trim()), // Filter out empty answers
    };

    // Create the query
    const result = await createQuery(queryData);
    
    // Handle success or error messages
    if (result.success) {
      setMessage('Query created successfully!');
      setQueryName(''); // Reset form
      setAnswers(['']); // Reset answers
      navigate('/'); // Redirect to profile page on success
    } else {
      setMessage(result.message || 'Failed to create query.');
    }
  };

  return (
    <div>
      <h1>Create New Query</h1>
      {message && <p>{message}</p>} {/* Display success or error message */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Query Name:</label>
          <input
            type="text"
            value={queryName}
            onChange={(e) => setQueryName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label>Answers:</label>
          {answers.map((answer, index) => (
            <div key={index}>
              <input
                type="text"
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                placeholder={`Answer ${index + 1}`}
                required
              />
            </div>
          ))}
          <button type="button" onClick={addAnswerField}>Add Answer Option</button>
        </div>
        
        <button type="submit">Create Query</button>
      </form>
    </div>
  );
};

export default CreateQuery;