import React from 'react';
import './Features.css';

import feature1 from '../assets/featureOne.png';
import feature2 from '../assets/feature2.png';
import feature3 from '../assets/ff.png';
import feature4 from '../assets/fhi.png';

const Features = () => {
  const features = [
    {
      title: "AI Symptom Checker",
      description: "Get instant, accurate health assessments powered by advanced AI technology. Our intelligent system helps you understand your symptoms and provides personalized recommendations.",
      image: feature1,
      id: 1
    },
    {
      title: "Smart Prescription Analysis",
      description: "Upload and analyze your prescriptions with our smart scanning technology. Track interactions, side effects, and ensure medication safety with real-time monitoring.",
      image: feature3,
      id: 2
    },
    {
      title: "Seamless Care Coordination",
      description: "Connect with healthcare providers effortlessly. Schedule appointments, share medical records, and maintain continuous communication with your care team.",
      image: feature2,
      id: 3
    },
    {
      title: "Patient Community",
      description: "Join a supportive community of patients sharing similar health journeys. Access peer support, expert advice, and valuable health insights from real experiences.",
      image: feature4,
      id: 4
    }
  ];

  return (
    <section className="features-section">
      <div className="container">
        <h2 className="features-heading">Your Journey to Better Health Starts Here.</h2>
        <div className="features-list">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className={`feature-item ${feature.id % 2 === 0 ? 'feature-reverse' : ''}`}
            >
              <div className="feature-image">
                <img src={feature.image} alt={feature.title} />
              </div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <button className="learn-more-btn">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;