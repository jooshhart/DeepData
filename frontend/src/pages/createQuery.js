import React, { useState, useContext } from 'react';
import { QueryContext } from '../context/queryState';
import { UserContext } from '../context/userState';

const CreateQuery = () => {
  const { createQuery } = useContext(QueryContext);
  const { user } = useContext(UserContext);

  const [queryName, setQueryName] = useState('');
  const [answers, setAnswers] = useState(['']); // Start with one answer field by default

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
      console.error('User must be logged in to create a query.');
      return;
    }

    // Prepare answers in the format needed for the query data
    const formattedAnswers = answers
      .filter(answer => answer.trim()) // Ignore empty answers
      .map(answer => ({ answer, count: 0 })); // Map each answer to required structure

    // Query data structure for backend
    const queryData = {
      queryName,
      createdBy: {
        userId: user._id,
        userName: user.username,
      },
      answers: formattedAnswers, // Correct format for backend
    };

    // Create the query via context
    await createQuery(queryData);
    console.log('Query created with data:', queryData);
  };

  return (
    <div>
      <h1>Create New Query</h1>
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