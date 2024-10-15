import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const registerUser = async (username, password, email) => {
   try {
       const response = await axios.post('/api/auth/register', { username, password, email });
       console.log(response.data.message);
   } catch (error) {
       console.error(error.response.data.message);
   }
};

const loginUser = async (username, password) => {
   try {
       const response = await axios.post('/api/auth/login', { username, password });
       console.log('Logged in successfully:', response.data.token);
   } catch (error) {
       console.error(error.response.data.message);
   }
};

const Profile = () => {
   return (
      <div>
         <Header />
         <main>
            <h1>Profile</h1>
         </main>
         <Footer />
      </div>
   );
};

export default Profile;