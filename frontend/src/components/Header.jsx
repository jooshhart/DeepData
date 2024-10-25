import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../images/DeepData Logo.jpg'; // Assuming logo.png is in the images folder
import { FaUserCircle } from "react-icons/fa";
import { useLogoutMutation } from '../slices/userApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';

const Header = () => {
   const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

   return (
      <header style={styles.header}>
         <Navbar bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to='/'>
            <img src={logo} alt='DeepData' />
            DeepData
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              <SearchBox />
              {userInfo ? (
                <>
                  <NavDropdown title={userInfo.name} id='username'>
                    <NavDropdown.Item as={Link} to='/profile'>
                      Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link as={Link} to='/login'>
                  <FaUserCircle /> Sign In
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
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
