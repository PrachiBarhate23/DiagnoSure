import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompleteYourProfile.css';
import signupImage from '../assets/signupp.png';
import logo from '../assets/logo.png';
import axios from 'axios';

const CompleteYourProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    medicalHistory: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    pastTreatments: '',
  });

  const token = localStorage.getItem('access_token');
  const phoneNumber = localStorage.getItem('phone_number');

  // Fetch existing profile on mount
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8090/api/profile/complete/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data) {
          setFormData({
            age: res.data.age || '',
            gender: res.data.gender || '',
            medicalHistory: res.data.medical_history || '',
            medicalConditions: res.data.medical_conditions || '',
            allergies: res.data.allergies || '',
            medications: res.data.medications || '',
            pastTreatments: res.data.past_treatments || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err.response?.data || err.message);
      }
    };

    fetchProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !phoneNumber) {
      alert('Something went wrong. Please login again.');
      navigate('/login');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8090/api/profile/complete/',
        {
          phone_number: phoneNumber,
          age: formData.age,
          gender: formData.gender,
          medical_history: formData.medicalHistory,
          medical_conditions: formData.medicalConditions,
          allergies: formData.allergies,
          medications: formData.medications,
          past_treatments: formData.pastTreatments,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log(res.data);
      alert('Profile saved successfully!');
      navigate('/symptom-checker');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Profile update failed. Please try again.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="brand-section">
          <img src={logo} alt="Diagnosure Logo" className="logo" />
          <span className="brand-name">Diagnosure</span>
        </div>
      </div>

      <div className="profile-content">
        <div className="left-section">
          <div className="hero-content">
            <h2 className="hero-title">Need health insights?</h2>
            <p className="hero-subtitle">Get instant health advice at your fingertips!</p>
            <div className="hero-image">
              <img src={signupImage} alt="Health illustration" className="health-illustration" />
            </div>
          </div>
        </div>

        <div className="right-section">
          <div className="profile-form-container">
            <h1 className="form-title">Complete your profile</h1>
            <p className="form-subtitle">Provide the following details for personalized health insights.</p>

            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} className="form-input" />
              </div>
              <div className="form-group">
                <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleInputChange} className="form-input" />
              </div>
              <div className="form-group">
                <textarea name="medicalHistory" placeholder="Medical history" value={formData.medicalHistory} onChange={handleInputChange} className="form-textarea" />
              </div>
              <div className="form-group">
                <textarea name="medicalConditions" placeholder="Medical conditions" value={formData.medicalConditions} onChange={handleInputChange} className="form-textarea" />
              </div>
              <div className="form-group">
                <textarea name="allergies" placeholder="Allergies" value={formData.allergies} onChange={handleInputChange} className="form-textarea" />
              </div>
              <div className="form-group">
                <textarea name="medications" placeholder="Medications" value={formData.medications} onChange={handleInputChange} className="form-textarea" />
              </div>
              <div className="form-group">
                <textarea name="pastTreatments" placeholder="Past treatments" value={formData.pastTreatments} onChange={handleInputChange} className="form-textarea" />
              </div>
              <button type="submit" className="profile-btn">Go to Dashboard</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteYourProfile;
