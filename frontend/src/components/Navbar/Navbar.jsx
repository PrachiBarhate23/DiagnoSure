import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  User,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Menu,
  X,
  Calendar,
  Hospital
} from 'lucide-react';
import './Navbar.css';
import logo from '../../assets/logo.png';

const Navbar = ({ isLanding = false, onScrollToFeature }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, language, toggleTheme, changeLanguage, translate } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const langRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setIsLanguageOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { key: 'symptomChecker', path: '/symptom-checker', id: 'symptomChecker' },
    { key: 'prescriptionReader', path: '/prescription-reader', id: 'prescriptionReader' },
    { key: 'careAppointments', path: '/appointments', id: 'careAppointments' },
    { key: 'calendar', path: '/calendar', id: 'calendar', icon: Calendar }, 
    { key: 'communityForum', path: '/communityForum', id: 'communityForum' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const handleNavigation = (item) => {
    if (isLanding && onScrollToFeature) {
      onScrollToFeature(item.id);
    } else {
      navigate(item.path);
    }
    setIsMenuOpen(false);
  };

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode);
    setIsLanguageOpen(false);
  };

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/')}>
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="brand-name">{translate('diagnosure')}</span>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-menu">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`navbar-item nav-link ${isActiveRoute(item.path) ? 'active' : ''}`}
              onClick={() => handleNavigation(item)}
            >
              <span className="nav-text">{translate(item.key)}</span>
            </button>
          ))}
        </div>

        {/* Right Controls */}
        <div className="navbar-controls">
          {/* Theme Toggle */}
          <button className="control-btn theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* Language Selector (not on landing) */}
          {!isLanding && (
            <div className="dropdown language-dropdown" ref={langRef}>
              <button
                className="control-btn dropdown-trigger"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <Globe size={18} />
                <ChevronDown size={12} className="dropdown-arrow" />
              </button>
              {isLanguageOpen && (
                <div className="dropdown-menu">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className={`dropdown-item ${language === lang.code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Auth Buttons for Landing */}
          {isLanding ? (
            <div className="auth-buttons">
              <button
                className="btn-secondary"
                onClick={() => navigate('/login')}
              >
                Log In
              </button>
              <button
                className="btn-primary"
                onClick={() => navigate('/signup')}
              >
                Sign Up
              </button>
            </div>
          ) : (
            /* Profile Dropdown */
            <div className="dropdown profile-dropdown" ref={profileRef}>
              <button
                className="control-btn profile-btn"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="avatar">
                  <User size={18} />
                </div>
                <ChevronDown size={12} className="dropdown-arrow" />
              </button>
              {isProfileOpen && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => { handleNavigation({ path: '/profile' }); setIsProfileOpen(false); }}
                  >
                    <User size={16} />
                    {translate('myProfile')}
                  </button>
                  <button
                    className="dropdown-item"
                    onClick={() => { handleNavigation({ path: '/appointments' }); setIsProfileOpen(false); }}
                  >
                    <Hospital size={16} />
                    {translate('myAppointments')}
                  </button>
                  <div className="dropdown-separator"></div>
                  <button className="dropdown-item">
                    <X size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <button
              key={item.key}
              className={`mobile-menu-item ${isActiveRoute(item.path) ? 'active' : ''}`}
              onClick={() => handleNavigation(item)}
            >
              <span>{translate(item.key)}</span>
            </button>
          ))}
          {isLanding && (
            <div className="mobile-auth-buttons">
              <button onClick={() => handleNavigation({ path: '/login' })}>Log In</button>
              <button onClick={() => handleNavigation({ path: '/signup' })}>Sign Up</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
