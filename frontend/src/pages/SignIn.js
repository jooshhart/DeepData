import React, { useState, useContext } from 'react';
import UserContext from '../context/userState';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const { loginUser, error } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await loginUser(email, password);
    setLoading(false);

    // Redirect if login was successful
    if (!error) {
      navigate('/profile');
    }
  };

  return (
    <div className="signin-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      <p className="register-message">
        Don't have an account? <Link to="/signup">Register here</Link>
      </p>
    </div>
  );
};

export default SignIn;
