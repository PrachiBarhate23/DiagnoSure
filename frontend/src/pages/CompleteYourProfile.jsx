import React, { useState } from 'react';
import './CompleteYourProfile.css'; // Make sure to link to the new CSS file
import signupImage from '../assets/signupp.png'; 
import logo from '../assets/logo.png';
import { completeProfile } from '../api/api';

const CompleteYourProfile = () => {
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    medicalHistory: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    pastTreatments: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('access_token');
    const res = await completeProfile(formData, token);
    console.log(res.data);
    alert("Profile completed successfully!");
    navigate('/symptom-checker'); // redirect to dashboard
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Profile update failed");
  }
};

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="brand-section">
          <img 
            src={logo}
            alt="Diagnosure Logo"
            className="logo"
          />
          <span className="brand-name">Diagnosure</span>
        </div>
        <div className="signin-link">
          <span>Already a user? </span>
          <a href="#signin">Sign in</a>
        </div>
      </div>

      <div className="profile-content">
        <div className="left-section">
          <div className="hero-content">
            <h2 className="hero-title">Need health insights?</h2>
            <p className="hero-subtitle">Get instant health advice at your fingertips!</p>
            <div className="hero-image">
              <img
                src={signupImage}
                alt="Health illustration"
                className="health-illustration"
              />
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="profile-form-container">
            <h1 className="form-title">Complete your profile</h1>
            <p className="form-subtitle">Please provide the following details to get personalized health insights.</p>
            
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="age"
                  placeholder="Age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="gender"
                  placeholder="Gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="medicalHistory"
                  placeholder="Medical history"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="medicalConditions"
                  placeholder="Medical conditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>
              
              <div className="form-group">
                <textarea
                  name="allergies"
                  placeholder="Allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="medications"
                  placeholder="Medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <textarea
                  name="pastTreatments"
                  placeholder="Past treatments"
                  value={formData.pastTreatments}
                  onChange={handleInputChange}
                  className="form-textarea"
                />
              </div>
              
              <button type="submit" className="profile-btn">
                Go to Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteYourProfile;
