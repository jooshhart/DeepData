import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/userState';

const PrivateRoute = () => {
  const { user } = useContext(UserContext);  // Access user from UserContext
  console.log("Current user in PrivateRoute:", user); // Debugging log

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default PrivateRoute;