import React from 'react';

const Footer = () => {
   return (
      <footer style={styles.footer}>
         <p>&copy; 2024 DeepData. All rights reserved.</p>
      </footer>
   );
};

// CSS in JS styling
const styles = {
   footer: {
      backgroundColor: '#333', // Dark grey like header
      color: '#fff',
      textAlign: 'center',
      padding: '10px 0',
      position: 'fixed',
      width: '100%',
      bottom: 0,
   },
};

export default Footer;