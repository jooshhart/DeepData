import React, { useState, useContext } from 'react';
import { UserContext } from '../context/userState';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
      console.log("User registered successfully");
      // You can redirect or update state after registration if needed
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p></p>
    </div>
  );
};

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default Register;
