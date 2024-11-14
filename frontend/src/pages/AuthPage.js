import React, { useState, useContext, useRef } from 'react';
import { UserContext } from '../context/userState';
import countrySelect from 'country-select-js';

const AuthPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [ethnicity, setEthnicity] = useState('');
  const [country, setCountry] = useState('');
  const [showSignUp, setShowSignUp] = useState(false);
  const selectRef = useRef(null);

  const { login, register } = useContext(UserContext);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (showSignUp) {
      try {
        await register(username, email, password, birthdate, gender, ethnicity, country);
        console.log("User registered successfully");
        setShowSignUp(false);
      } catch (error) {
        console.error("Error during registration:", error);
      }
    } else {
      try {
        await login(username, password);
        console.log("User logged in successfully");
      } catch (error) {
        console.error("Error during login:", error);
      }
    }
  };

  useEffect(() => {
    // Initialize country-select-js on the select element
    const countrySelectInstance = countrySelect(selectRef.current);

    // Add a change event listener to update the state when a country is selected
    const handleCountryChange = (e) => setCountry(e.target.value);
    selectRef.current.addEventListener('change', handleCountryChange);

    // Cleanup the event listener on component unmount
    return () => {
      selectRef.current.removeEventListener('change', handleCountryChange);
    };
  }, []);

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
          <>
            <div>
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label>Birthdate:</label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
              />
            </div>
            <div>
              <label>Gender:</label>
              <select name="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Ethnicity:</label>
              <select name="ethnicity" value={ethnicity} onChange={(e) => setEthnicity(e.target.value)}>
                <option value="">Select Ethnicity</option>
                <option value="Asian">Asian</option>
                <option value="Black or African American">Black or African American</option>
                <option value="Hispanic or Latino">Hispanic or Latino</option>
                <option value="White">White</option>
                <option value="Native American or Alaska Native">Native American or Alaska Native</option>
                <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
                <option value="Middle Eastern or North African">Middle Eastern or North African</option>
                <option value="Multiracial or Two or More Races">Multiracial or Two or More Races</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label>Country:</label>
              <select
                ref={selectRef}
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select Country</option>
              </select>
            </div>
          </>
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