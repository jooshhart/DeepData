import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Plot from 'react-plotly.js';
import { QueryContext } from '../context/queryState';

const VisualDetails = () => {
  const { id: queryId } = useParams();
  const { queryData, fetchQueryById } = useContext(QueryContext);

  const [xAxis, setXAxis] = useState('age');
  const [colorBy, setColorBy] = useState('gender');

  useEffect(() => {
    fetchQueryById(queryId);
  }, [queryId, fetchQueryById]);

  if (!queryData) return <p>Loading query details...</p>;

  // Extract participant data for visualization
  const { participants } = queryData;
  const demographicOptions = ['age', 'gender', 'ethnicity', 'country', 'answer'];

  // Utility to calculate counts grouped by xAxis and colorBy
  const calculateCounts = (data, field, colorField) => {
    return data.reduce((acc, item) => {
      const xValue = item[field];
      const colorValue = item[colorField] || 'Unknown';

      acc[colorValue] = acc[colorValue] || {};
      acc[colorValue][xValue] = (acc[colorValue][xValue] || 0) + 1;

      return acc;
    }, {});
  };

  // Get counts grouped by xAxis and colorBy
  const counts = calculateCounts(participants, xAxis, colorBy);

  // Prepare plot data for bar chart with unique colors for each colorBy category
  const plotData = Object.entries(counts).map(([colorValue, xCounts], index) => ({
    x: Object.keys(xCounts),
    y: Object.values(xCounts),
    type: 'bar',
    name: colorValue,
    marker: {
      color: `hsl(${(index * 360) / Object.keys(counts).length}, 70%, 50%)`, // Assign unique colors using HSL
    },
  }));

  return (
    <div>
      <h1>{queryData.queryName}</h1>
      <p>Created by: {queryData.createdBy}</p>

      {/* Axis and Color Selectors */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          X-Axis:
          <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
            {demographicOptions.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Color By:
          <select value={colorBy} onChange={(e) => setColorBy(e.target.value)}>
            {demographicOptions.map(option => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Render Graph */}
      <Plot
        data={plotData}
        layout={{
          title: `Bar Graph of ${xAxis} grouped by ${colorBy}`,
          xaxis: { title: xAxis.charAt(0).toUpperCase() + xAxis.slice(1) },
          yaxis: { title: 'Count' },
          paper_bgcolor: 'black',
          plot_bgcolor: 'black',
          font: { color: 'white' },
          barmode: 'group', // Group bars side-by-side
        }}
        style={{ width: '100%', height: 400 }}
      />
    </div>
  );
};

export default VisualDetails;