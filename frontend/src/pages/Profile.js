import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios';

const ProfilePage = () => {
    const [user, setUser] = useState({});
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                const response = await axios.get('/api/user/profile', config);
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.put('/api/user/profile', { username: newUsername, password: newPassword }, config);
            alert('Profile updated successfully!');
            // Optionally refresh the user data here
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
      <div>
        <Header />
        <div className="profile-page">
            <h1>Profile Page</h1>
            <h2>Welcome, {user.username}</h2>
            <form onSubmit={handleUpdateProfile}>
                <div>
                    <label>Change Username:</label>
                    <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                </div>
                <div>
                    <label>Change Password:</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <button type="submit">Update Profile</button>
            </form>
            <div>
                <h3>Avatar Image:</h3>
                <p>[Avatar Image Placeholder]</p> {/* Implement avatar upload logic later */}
            </div>
        </div>
        <Footer />
      </div>
    );
};

export default ProfilePage;
