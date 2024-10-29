import React, { useState } from 'react';
import { useUser } from '../context/userState';

const SignUp = () => {
  const { register } = useUser();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} placeholder="Username" />
      <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Email" />
      <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;
