// src/pages/Profile/Profile.jsx

import React from 'react';
import { useApp } from '../../context/AppContext';
import './Profile.css';

const Profile = () => {
  const { translate } = useApp();

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>{translate('userProfile')}</h1>
      </div>
      <div className="profile-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">👤</div>
          <h2>Profile Page</h2>
          <p>User profile management features coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;