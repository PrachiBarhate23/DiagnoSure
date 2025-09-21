import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Signup.css';
import signupImage from '../assets/signupp.png';
import logo from '../assets/logo.png';
import { signupUser, loginUser } from '../api/api';

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password1: '',
    password2: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password1 !== formData.password2) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.username.trim()) {
      alert("Username is required!");
      return;
    }

    try {
      // 1️⃣ Signup
      await signupUser({
        username: formData.username,
        email: formData.email,
        password1: formData.password1,
        password2: formData.password2,
        phone_number: formData.phone // make sure backend expects `phone_number`
      });

      console.log("Signup successful");

      // 2️⃣ Auto-login immediately after signup
      const loginRes = await loginUser({
        username: formData.username, // or email depending on your API
        password: formData.password1
      });

      localStorage.setItem('access_token', loginRes.data.access);
      localStorage.setItem('refresh_token', loginRes.data.refresh);
      localStorage.setItem('phone_number', formData.phone); // needed by profile

      alert("Signup successful! Proceed to complete your profile.");
      navigate('/complete'); // redirect to profile completion page

    } catch (err) {
      console.error("Signup/Login error:", err);
      if (err.response && err.response.data) {
        alert("Error: " + JSON.stringify(err.response.data));
      } else {
        alert("Error: " + err.message);
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-header">
        <div className="brand-section">
          <img src={logo} alt="Diagnosure Logo" className="logo" />
          <span className="brand-name">Diagnosure</span>
        </div>
        <div className="signin-link">
          <span>Already a user? </span>
          <Link to="/login">Sign in</Link>
        </div>
      </div>

      <div className="signup-content">
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
          <div className="signup-form-container">
            <h1 className="form-title">Start your free trial</h1>
            <p className="form-subtitle">Enjoy 7 days of premium features. Cancel anytime.</p>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Your full name"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your unique email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password1"
                  placeholder="Create a password"
                  value={formData.password1}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  name="password2"
                  placeholder="Confirm password"
                  value={formData.password2}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="signup-btn">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
