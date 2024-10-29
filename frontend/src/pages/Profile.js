import React, { useEffect } from 'react';
import { useUser } from '../context/userState';

const Profile = () => {
  const { user, fetchUserProfile } = useUser();

  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);  // Fetch user details if needed
    }
  }, [user, fetchUserProfile]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Email: {user.email}</p>
      {/* Display additional user details here */}
    </div>
  );
};

export default Profile;
