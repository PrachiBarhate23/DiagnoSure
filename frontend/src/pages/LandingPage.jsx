import React, { useState, useEffect, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import LiquidEther from './LiquidEther';
import FeaturesSection from '../components/Features';
import TestimonialSection from '../components/Testimonials';
import Navbar from '../components/Navbar/Navbar';

const LandingPage = () => {
  const [splineError, setSplineError] = useState(false);
  const featuresRef = useRef(null);

  const scrollToFeatures = (e) => {
    e.preventDefault();
    if (featuresRef.current) {
      featuresRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSplineError = () => {
    setSplineError(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ✅ Use Navbar in landing mode */}
      <Navbar isLanding={true} />

      {/* Hero Section */}
      <section style={{ position: 'relative', minHeight: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, opacity: 0.6 }}>
          <LiquidEther colors={['#E3F2FD', '#BBDEFB', '#90CAF9']} />
        </div>

        <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1200px', margin: '0 auto', maxHeight:'800px'}}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', minHeight: '400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h1 style={{ fontSize: '3.5rem', fontWeight: 700 }}>Your Health, Empowered by AI.</h1>
              <p style={{ fontSize: '1.25rem', color: '#4a5568' }}>
                Experience accurate diagnostics, simplified care, and peace of mind.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="/signup" style={{ padding: '0.875rem 1.75rem', background: '#007bff', color: '#fff', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
                  Get Started
                </a>
                <a href="#features" onClick={scrollToFeatures} style={{ padding: '0.875rem 1.75rem', border: '2px solid #007bff', color: '#007bff', borderRadius: '8px', fontWeight: 600, textDecoration: 'none' }}>
                  Learn More
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!splineError ? (
                <Spline
                  scene="https://prod.spline.design/zJ6ygDghAh4UQv8p/scene.splinecode"
                  onError={handleSplineError}
                  style={{ width: '100%', height: '500px', borderRadius: '20px' }}
                />
              ) : (
                <div style={{ textAlign: 'center' }}>AI-Powered Healthcare</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div ref={featuresRef}>
        <FeaturesSection />
      </div>

      {/* Testimonials */}
      <TestimonialSection />
    </div>
  );
};

export default LandingPage;
