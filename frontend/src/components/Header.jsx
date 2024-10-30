import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../images/DeepData Logo.jpg'; // Assuming logo.png is in the images folder
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
   const location = useLocation(); // To track the current page

   return (
      <header style={styles.header}>
         <div style={styles.logoContainer}>
            <Link to="/home">
               <img src={logo} alt="Logo" style={styles.logo} />
            </Link>
         </div>

         <div style={styles.navContainer}>
            <Link to="/home" style={location.pathname === '/home' ? styles.activeLink : styles.link}>Homepage</Link>
            <Link to="/queries" style={location.pathname === '/queries' ? styles.activeLink : styles.link}>Queries</Link>
            <Link to="/visuals" style={location.pathname === '/visuals' ? styles.activeLink : styles.link}>Visuals</Link>
         </div>

         <div style={styles.userContainer}>
            <Link to="/" style={styles.userLink}>
               <FaUserCircle style={styles.userIcon}/>
            </Link>
         </div>
      </header>
   );
};

// CSS in JS styling
const styles = {
   header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#333', // Dark grey
      padding: '10px 20px',
      color: '#fff',
   },
   logoContainer: {
      flex: 1,
   },
   logo: {
      height: '40px',
      cursor: 'pointer',
   },
   navContainer: {
      flex: 2,
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
   },
   link: {
      textDecoration: 'none',
      color: '#ccc',
      fontSize: '18px',
   },
   activeLink: {
      textDecoration: 'none',
      color: '#fff',
      fontSize: '18px',
      borderBottom: '2px solid #fff', // Highlight current page
   },
   userContainer: {
      flex: 1,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
   },
   userLink: {
      alignItems: 'center',
   },
   userIcon: {
      fontSize: '35px',
      cursor: 'pointer',
      color: '#fff',
   },
};

export default Header;
