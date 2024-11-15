// Profile.js
import React, { useContext, useState, useEffect } from 'react';
import { CountryDropdown } from 'react-country-region-selector';
import { UserContext } from '../context/userState';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, updateUser, calculateAge } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    birthdate: '',
    gender: '',
    ethnicity: '',
    country: ''
  });
  const [isInfoCardExpanded, setIsInfoCardExpanded] = useState(false);
  const [isUpdateCardExpanded, setIsUpdateCardExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        birthdate: user.birthdate || '',
        gender: user.gender || '',
        ethnicity: user.ethnicity || '',
        country: user.country || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateUser(formData);
      alert('User information updated successfully');
    } catch (error) {
      console.error('Failed to update user information:', error);
    }
  };

  const goToCreateQuery = () => {
    navigate('/create');
  };

  const goToMyQueries = () => {
    navigate('/myqueries');
  };

  return (
    <div style={styles.container}>
      {/* User Information Card */}
      <div style={styles.card} onClick={() => setIsInfoCardExpanded(!isInfoCardExpanded)}>
        <h2>User Information</h2>
        {!isInfoCardExpanded && <p>Click to view your information</p>}
      </div>
      {isInfoCardExpanded && (
        <div style={styles.expandedCard}>
          <p><strong>Username:</strong> {user?.username}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Birthdate:</strong> {user?.birthdate?.slice(0, 10)}</p>
          <p><strong>Age:</strong> {calculateAge(user?.birthdate)}</p>
          <p><strong>Gender:</strong> {user?.gender}</p>
          <p><strong>Ethnicity:</strong> {user?.ethnicity}</p>
          <p><strong>Country:</strong> {user?.country}</p>
        </div>
      )}

      {/* Update Information Card */}
      <div style={styles.card} onClick={() => setIsUpdateCardExpanded(!isUpdateCardExpanded)}>
        <h2>Update Information</h2>
        {!isUpdateCardExpanded && <p>Click to edit your information</p>}
      </div>
      {isUpdateCardExpanded && (
        <div style={styles.expandedCard}>
          <form style={styles.form}>
            <div style={styles.formGroup}>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Email:</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Birthdate:</label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
              />
            </div>
            <div style={styles.formGroup}>
              <label>Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Ethnicity:</label>
              <select name="ethnicity" value={formData.ethnicity} onChange={handleChange}>
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
            <div style={styles.formGroup}>
              <label>Country:</label>
              <CountryDropdown
                value={formData.country}
                onChange={handleChange} 
              />
            </div>
            <button type="button" onClick={handleUpdate} style={styles.updateButton}>
              Update
            </button>
          </form>
        </div>
      )}

      <button onClick={goToCreateQuery} style={styles.createQueryButton}>Create Query</button>
      <button onClick={goToMyQueries} style={styles.myQueriesButton}>My Queries</button>
      <button onClick={logout} style={styles.logoutButton}>Logout</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  card: {
    backgroundColor: '#5A5A5A',
    padding: '20px',
    borderRadius: '8px',
    cursor: 'pointer',
    width: '80%',
    textAlign: 'center',
    marginBottom: '5px',
  },
  expandedCard: {
    backgroundColor: '#5A5A5A',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '10px',
    width: '80%',
    marginBottom: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  updateButton: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  createQueryButton: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  myQueriesButton: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#FFA500',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  logoutButton: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#F44336',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Profile;