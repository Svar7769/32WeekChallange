import React, { useState } from 'react';

const Register = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send a request to your backend to register the user
    console.log('Registration attempt:', user);
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={user.username}
          onChange={(e) => setUser({...user, username: e.target.value})}
        />
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({...user, email: e.target.value})}
        />
        <input
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={(e) => setUser({...user, password: e.target.value})}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
