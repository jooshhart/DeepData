import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const Homepage = () => {
   const [userCounts, setUserCounts] = useState({
      age: {},
      gender: {},
      ethnicity: {},
      country: {}
   });
   const [activeGraph, setActiveGraph] = useState('ageGraph'); // Track the active graph with initial value 'ageGraph'

   useEffect(() => {
      const calculateAge = (birthdate) => {
         const today = new Date();
         const birthDate = new Date(birthdate);
         let age = today.getFullYear() - birthDate.getFullYear();
         const month = today.getMonth() - birthDate.getMonth();
         if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
         }
         return age;
      };

      const fetchAllUsers = async () => {
         try {
            const response = await axios.get('https://deepdatavisuals.onrender.com/api/users/all');
            const users = response.data;

            if (!Array.isArray(users)) {
               console.error("Unexpected data format:", response.data);
               return;
            }

            const counts = {
               age: {},
               gender: {},
               ethnicity: {},
               country: {},
            };

            users.forEach(user => {
               if (!user.birthdate || !user.country || !user.ethnicity || !user.gender) {
                  return;
               }

               const age = calculateAge(user.birthdate);
               counts.age[age] = (counts.age[age] || 0) + 1;
               counts.gender[user.gender] = (counts.gender[user.gender] || 0) + 1;
               counts.ethnicity[user.ethnicity] = (counts.ethnicity[user.ethnicity] || 0) + 1;
               counts.country[user.country] = (counts.country[user.country] || 0) + 1;
            });

            setUserCounts(counts);
         } catch (error) {
            console.error("Failed to fetch all users:", error);
         }
      };

      fetchAllUsers();
   }, []);

   const generateBarChart = (title, data) => {
      return (
         <Plot
            data={[
               {
                  x: Object.keys(data),
                  y: Object.values(data),
                  type: 'bar',
                  marker: { color: 'skyblue' },
               },
            ]}
            layout={{
               title: title,
               xaxis: { title: 'Categories' },
               yaxis: { title: 'Count' },
               margin: { t: 50, b: 40, l: 40, r: 10 },
               paper_bgcolor: 'black',
               plot_bgcolor: 'black',
               font: { color: 'white' },
            }}
            style={{ width: '100%', height: 300 }}
         />
      );
   };

   const renderActiveGraph = () => {
      switch (activeGraph) {
         case 'ageGraph':
            return generateBarChart("Age Distribution", userCounts.age);
         case 'genderGraph':
            return generateBarChart("Gender Distribution", userCounts.gender);
         case 'ethnicityGraph':
            return generateBarChart("Ethnicity Distribution", userCounts.ethnicity);
         case 'countryGraph':
            return generateBarChart("Country Distribution", userCounts.country);
         default:
            return generateBarChart("Age Distribution", userCounts.age);
      }
   };

   return (
      <div style={styles.container}>
         <h1 style={styles.title}>DeepData Visuals</h1>
         
         <div style={styles.card}>
            <p style={styles.description}>
               DeepData is a powerful platform designed to help you visualize and analyze large datasets with ease. 
               Whether you're looking to query data or generate insightful visuals, DeepData has the tools you need to make data-driven decisions.
            </p>
         </div>

         <div style={styles.demographics}>
            <h3>Demographics</h3>
            
            {/* Buttons to toggle between graphs */}
            <div style={styles.buttonContainer}>
               <button
                  style={activeGraph === 'ageGraph' ? styles.activeButton : styles.button}
                  onClick={() => setActiveGraph('ageGraph')}
               >
                  Age
               </button>
               <button
                  style={activeGraph === 'genderGraph' ? styles.activeButton : styles.button}
                  onClick={() => setActiveGraph('genderGraph')}
               >
                  Gender
               </button>
               <button
                  style={activeGraph === 'ethnicityGraph' ? styles.activeButton : styles.button}
                  onClick={() => setActiveGraph('ethnicityGraph')}
               >
                  Ethnicity
               </button>
               <button
                  style={activeGraph === 'countryGraph' ? styles.activeButton : styles.button}
                  onClick={() => setActiveGraph('countryGraph')}
               >
                  Country
               </button>
            </div>

            {/* Display the active graph */}
            {renderActiveGraph()}
         </div>
      </div>
   );
};

// Updated styles with button and activeButton styles
const styles = {
   container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      backgroundColor: 'black',
      minHeight: '100vh',
   },
   title: {
      color: 'white',
      fontSize: '4rem',
      marginBottom: '20px',
   },
   card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '600px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      marginBottom: '40px',
   },
   description: {
      color: 'black',
      fontSize: '1.2rem',
      margin: 0,
   },
   demographics: {
      color: 'white',
      width: '100%',
      maxWidth: '600px',
   },
   buttonContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '20px',
   },
   button: {
      backgroundColor: 'grey',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
   },
   activeButton: {
      backgroundColor: 'dodgerblue',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: 'bold',
   },
};

export default Homepage;