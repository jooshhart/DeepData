import React from 'react';

const Homepage = () => {
   return (
      <div>
         <main>
            <div style={styles.container}>
               <h1 style={styles.title}>DeepData</h1>
               <div style={styles.cardWrapper}>
                  <div style={styles.card}>
                     <p style={styles.description}>
                        DeepData is a powerful platform designed to help you visualize and analyze large datasets with ease. 
                        Whether you're looking to query data or generate insightful visuals, DeepData has the tools you need to make data-driven decisions.
                     </p>
                  </div>
               </div>
            </div>
         </main>
      </div>
   );
};

const styles = {
   container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',  // Keep the title at the top
      alignItems: 'center',
      height: '91vh',                // Full viewport height
      backgroundColor: 'black',
   },
   title: {
      color: 'white',
      fontSize: '10vw',
      marginTop: '20px',            // Space between the top and title
      marginBottom: '5px', 
   },
   cardWrapper: {
      display: 'flex',
      justifyContent: 'center',      // Center the card horizontally
      alignItems: 'center',          // Center the card vertically
      flexGrow: 1,                   // Make this take up the remaining space
      width: '100%',                 // Ensure the card is centered within full width
      maxHeight: '30vh'
   },
   card: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '20px',
      maxWidth: '600px',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // Optional shadow for depth
   },
   description: {
      color: 'black',
      fontSize: '1.2rem',
      margin: 0,
   },
};

export default Homepage;