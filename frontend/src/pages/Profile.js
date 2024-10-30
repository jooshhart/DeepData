import React, {useContext} from 'react';
import { UserContext } from '../context/userState';

const Profile = () => {
  const { user, logout } = useContext(UserContext);

  return (
    <div>
      {user ? (
      <>
        <span>Welcome, {user.username}</span> {/* Display username */}
        <button onClick={logout}>Logout</button>
      </>
    ) : (
      <a href="/login">Login</a>
    )}
    </div>
  );
};

export default Profile;
