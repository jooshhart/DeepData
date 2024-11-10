import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { QueryContext } from '../context/queryState';

const VisualDetails = () => {
  const { id: queryId } = useParams();
  const { queryData, fetchQueryById } = useContext(QueryContext);

  useEffect(() => {
    fetchQueryById(queryId);
  }, [queryId, fetchQueryById]);

  if (!queryData) return <p>Loading query details...</p>;

  return (
    <div>
      <h1>{queryData.queryName}</h1>
      <p>Created by: {queryData.createdBy}</p>

      <h3>Participants:</h3>
      <ul>
        {queryData.participants.map((participant, index) => (
          <li key={index}>
            <p>User ID: {participant.userId}</p>
            <p>Answer: {participant.answer}</p>
            <p>Age: {participant.age}</p>
            <p>Gender: {participant.gender}</p>
            <p>Ethnicity: {participant.ethnicity}</p>
            <p>Country: {participant.country}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VisualDetails;