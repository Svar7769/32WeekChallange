// src/pages/ProfileSettings.js
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { user, setUser } = useContext(AppContext);
  const [profile, setProfile] = useState({ name: user.name, email: user.email });
  // const [preferences, setPreferences] = useState({ currency: 'USD', dateFormat: 'MM/DD/YYYY' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setUser(profile);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.new === password.confirm) {
      // Change password
    } else {
      alert('New passwords do not match');
    }
  };

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      <form onSubmit={handleProfileSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleProfileChange}
            placeholder="Name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="Email"
            required
          />
        </div>
        <button type="submit" className="save-button">Save Profile</button>
      </form>
      <h2>Change Password</h2>
      <form onSubmit={handlePasswordSubmit} className="password-form">
        <div className="form-group">
          <label htmlFor="current">Current Password</label>
          <input
            type="password"
            id="current"
            name="current"
            value={password.current}
            onChange={handlePasswordChange}
            placeholder="Current Password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="new">New Password</label>
          <input
            type="password"
            id="new"
            name="new"
            value={password.new}
            onChange={handlePasswordChange}
            placeholder="New Password"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm">Confirm New Password</label>
          <input
            type="password"
            id="confirm"
            name="confirm"
            value={password.confirm}
            onChange={handlePasswordChange}
            placeholder="Confirm New Password"
            required
          />
        </div>
        <button type="submit" className="change-button">Change Password</button>
      </form>
    </div>
  );
};

export default ProfileSettings;
