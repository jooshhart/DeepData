import React, { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Send the sign-up data to your backend
      const response = await axios.post('/api/auth/signup', {
        username: username,
        password: password,
        email: email,
      });

      // If the sign-up is successful, store the JWT token in localStorage
      const token = response.data.token;
      localStorage.setItem('token', token);

      // Clear error message and set success message
      setSuccessMessage('Sign-up successful!');
      setErrorMessage('');

      // Redirect to the profile page
      window.location.href = '/profile';
    } catch (error) {
      // Handle errors by displaying appropriate messages
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || 'Sign-up failed. Please try again.');
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSignUp}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <a href="/signin">Sign In</a></p>
    </div>
  );
};

export default SignUp;