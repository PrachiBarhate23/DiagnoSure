import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css'; 
import signupImage from '../assets/signupp.png';
import logo from '../assets/logo.png';
import { loginUser } from '../api/api';

const LoginPage = () => {
  const navigate = useNavigate(); // 👈 hook for navigation
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
    const res = await loginUser(formData);
    // Save JWT tokens to localStorage
    localStorage.setItem('access_token', res.data.access);
    localStorage.setItem('refresh_token', res.data.refresh);
    alert("Login successful!");
    navigate('/complete'); // or dashboard
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Login failed");
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
          <span>Don't have an account? </span>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>

      <div className="signup-content">
        <div className="left-section">
          <div className="hero-content">
            <h2 className="hero-title">Need health insights?</h2>
            <p className="hero-subtitle">Find answers and support anytime!</p>
            <div className="hero-image">
              <img src={signupImage} alt="Health illustration" className="health-illustration" />
            </div>
            <p className="hero-footer">Get instant health advice at your fingertips!</p>
          </div>
        </div>

        <div className="right-section">
          <div className="signup-form-container">
            <h1 className="form-title">Welcome back!</h1>
            <p className="form-subtitle">Log in to continue your personalized health journey.</p>
            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="signup-btn">
                Log in
              </button>

              <div className="divider">
                <span>or connect with</span>
              </div>

              <button type="button" className="google-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
