import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/userState';

const Profile = () => {
  const { user, logout, updateUser } = useContext(UserContext);
  
  // State for form data, initially set from user context
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    birthdate: '',
    gender: '',
    ethnicity: '',
    country: ''
  });

  const [isCardExpanded, setIsCardExpanded] = useState(false);

  // Use useEffect to update formData when user context changes
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

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle user update
  const handleUpdate = async () => {
    try {
      await updateUser(formData);
      alert('User information updated successfully');
    } catch (error) {
      console.error('Failed to update user information:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} onClick={() => setIsCardExpanded(!isCardExpanded)}>
        <h2>User Information</h2>
        {!isCardExpanded && <p>Click to expand and edit your information</p>}
      </div>

      {isCardExpanded && (
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
                <option value="Prefer not to say">Prefer not to say</option>
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
                <option value="Native American">Native American</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label>Country:</label>
              <select name="country" value={formData.country} onChange={handleChange}>
                <option value="">Select Country</option>
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="India">India</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <button type="button" onClick={handleUpdate} style={styles.updateButton}>
              Update
            </button>
          </form>
        </div>
      )}

      <div style={styles.buttonsContainer}>
        <button style={styles.navButton}>Comments</button>
        <button style={styles.navButton}>Visuals</button>
      </div>
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
  },
  expandedCard: {
    backgroundColor: '#5A5A5A',
    padding: '20px',
    borderRadius: '8px',
    marginTop: '10px',
    width: '80%',
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
  buttonsContainer: {
    marginTop: '20px',
    display: 'flex',
    gap: '10px',
  },
  navButton: {
    padding: '10px 15px',
    backgroundColor: '#007BFF',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  logoutButton: {
    marginTop: '15px',
    padding: '10px',
    backgroundColor: '#FF5733',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default Profile;