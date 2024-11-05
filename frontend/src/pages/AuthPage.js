import React, { useState, useContext } from 'react';
import { UserContext } from '../context/userState';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSignUp, setShowSignUp] = useState(false); // State to toggle between Sign In and Sign Up

  const { login, register } = useContext(UserContext);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (showSignUp) {
      // If in Sign-Up mode
      try {
        await register(username, email, password);
        console.log("User registered successfully");
        // Optionally switch to Sign-In mode after successful registration
        setShowSignUp(false);
      } catch (error) {
        console.error("Error during registration:", error);
      }
    } else {
      // If in Sign-In mode
      try {
        await login(username, password);
        console.log("User logged in successfully");
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2>{showSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleAuth}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {showSignUp && (
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">{showSignUp ? 'Register' : 'Login'}</button>
      </form>
      <p>
        {showSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          style={styles.toggleButton}
          onClick={() => setShowSignUp(!showSignUp)}
        >
          {showSignUp ? 'Sign In here' : 'Sign Up here'}
        </button>
      </p>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  toggleButton: {
    background: 'none',
    border: 'none',
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '1em',
  },
};

export default AuthPage;