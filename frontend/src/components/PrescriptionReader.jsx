import React, { useState, useRef } from 'react';
import './PrescriptionReader.css';

// Icon Components (SVG)
const UploadIcon = () => (
  <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CheckIcon = () => (
  <svg className="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="x-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg className="warning-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const PrintIcon = () => (
  <svg className="action-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const SaveIcon = () => (
  <svg className="action-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="action-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

// Footer Component
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">About Us</h3>
          <a href="#" className="footer-link">Our Mission</a>
          <a href="#" className="footer-link">Team</a>
          <a href="#" className="footer-link">Careers</a>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Resources</h3>
          <a href="#" className="footer-link">Blog</a>
          <a href="#" className="footer-link">FAQ</a>
          <a href="#" className="footer-link">Support</a>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Legal</h3>
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>
        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <a href="#" className="footer-link">Contact Form</a>
          <a href="#" className="footer-link">Partnerships</a>
          <div className="social-icons">
            <span className="social-icon">📘</span>
            <span className="social-icon">🐦</span>
            <span className="social-icon">📷</span>
            <span className="social-icon">💼</span>
          </div>
        </div>
      </div>
      <div className="footer-tagline-container">
        <div className="footer-tagline-section">
          <p className="footer-tagline">
            AI-powered tools for personal health management and proactive care.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 AI Prescription Reader. All rights reserved.</p>
      </div>
    </footer>
  );
};

// Main App Component
const PrescriptionReader = () => {
  const [dragOver, setDragOver] = useState(false);
  const [manualText, setManualText] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const fileInputRef = useRef(null);

  // Hardcoded results for the uploaded prescription image
  const hardcodedResults = {
    doctor: "Dr. Rahul Mehta",
    clinic: "Shiv Clinic, Mumbai",
    date: "4th of 2025",
    medications: [
      {
        name: 'Paracetamol 500mg',
        instructions: 'Take 2 times a day',
        note: 'Take with food to prevent stomach upset. Continue for prescribed duration.'
      },
      {
        name: 'Omeprazole 20mg',
        instructions: 'Take once before meals',
        note: 'Take 30 minutes before breakfast. Swallow whole, do not crush.'
      },
      {
        name: 'Amoxicillin 500mg',
        instructions: 'Take 3 times a day',
        note: 'Complete the full course even if symptoms improve. Take at regular intervals.'
      },
      {
        name: 'Cetirizine 10mg',
        instructions: 'Take at night',
        note: 'May cause drowsiness. Take before bedtime for best results.'
      },
      {
        name: 'Ibuprofen 400mg',
        instructions: 'Take if pain persists',
        note: 'Do not exceed 3 doses per day. Take with food to avoid stomach irritation.'
      }
    ],
    interactions: [
      {
        type: 'high',
        title: 'Amoxicillin and Omeprazole Interaction',
        description: 'Increased risk of stomach upset and diarrhea when taken together. Monitor for gastrointestinal discomfort.'
      },
      {
        type: 'moderate',
        title: 'Ibuprofen and Asthma History',
        description: 'Non-steroidal anti-inflammatory drugs (NSAIDs) like Ibuprofen may exacerbate asthma symptoms in sensitive individuals. Use with caution and consult a doctor if breathing difficulties occur.'
      },
      {
        type: 'none',
        title: 'No Critical Interactions Detected',
        description: 'Based on the provided information, no other critical drug-drug interactions or severe warnings were found.'
      }
    ]
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files.length > 0) {
      setTimeout(() => {
        setAnalysisResults(hardcodedResults);
      }, 1000);
    }
  };

  const handleAnalyze = () => {
    if (manualText.trim()) {
      setAnalysisResults(hardcodedResults);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'high':
        return <XIcon />;
      case 'moderate':
        return <WarningIcon />;
      case 'none':
        return <CheckIcon />;
      default:
        return <CheckIcon />;
    }
  };

  const getInteractionClass = (type) => {
    switch (type) {
      case 'high':
        return 'interaction-high';
      case 'moderate':
        return 'interaction-moderate';
      case 'none':
        return 'interaction-none';
      default:
        return 'interaction-none';
    }
  };

  const getInteractionLabel = (type) => {
    switch (type) {
      case 'high':
        return 'High: ';
      case 'moderate':
        return 'Moderate: ';
      case 'none':
        return 'None: ';
      default:
        return '';
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <div className="header-container">
          <div className="header-content">
            <h1 className="title">
              AI Prescription Reader
            </h1>
            <p className="subtitle">
              Instantly understand your medications, detect potential interactions, and 
              manage your health more effectively. Upload your prescription and let AI 
              do the rest.
            </p>
          </div>
          
          {/* Upload Area */}
          <div className="upload-area">
            <div
              className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                multiple
                onChange={handleFileInput}
                className="hidden-input"
              />
              <UploadIcon />
              <div className="upload-text">
                Drag & Drop Image Here or Click to Upload
              </div>
              <div className="upload-subtext">
                Supported formats: JPG, PNG, PDF
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Manual Entry Section */}
        <div className="or-section">
          <div className="or-text">OR</div>
        </div>

        <div className="manual-section">
          <h2 className="section-title">
            Manual Prescription Entry
          </h2>
          <textarea
            className="textarea"
            placeholder="Manually Enter Prescription Details here, e.g., 'Amoxicillin 500mg, take 1 capsule 3 times daily for 7 days.' Include all medications and dosages."
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            className="analyze-btn"
          >
            Analyze Prescription
          </button>
        </div>

        {/* Analysis Results */}
        {analysisResults && (
          <div className="results-section">
            <h2 className="section-title">
              Analysis Results
            </h2>

            <div className="results-grid">
              {/* Extracted Medications */}
              <div>
                <h3 className="subsection-title">
                  Extracted Medications
                </h3>
                <div>
                  {analysisResults.medications.map((med, index) => (
                    <div key={index} className="medication-item">
                      <div className="medication-header">
                        <CheckIcon />
                        <span className="medication-name">{med.name}</span>
                      </div>
                      <p className="medication-instructions">{med.instructions}</p>
                      <p className="medication-note">{med.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety & Interaction Alerts */}
              <div>
                <h3 className="subsection-title">
                  Safety & Interaction Alerts
                </h3>
                <div>
                  {analysisResults.interactions.map((interaction, index) => (
                    <div key={index} className={`interaction-item ${getInteractionClass(interaction.type)}`}>
                      <div className="interaction-header">
                        {getInteractionIcon(interaction.type)}
                        <span className="interaction-title">
                          {getInteractionLabel(interaction.type)}{interaction.title}
                        </span>
                      </div>
                      <p className="interaction-description">{interaction.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button className="action-btn action-btn-secondary">
                <PrintIcon />
                Print Report
              </button>
              <button className="action-btn action-btn-secondary">
                <SaveIcon />
                Save to History
              </button>
              <button className="action-btn action-btn-primary">
                <PhoneIcon />
                Consult a Pharmacist
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default PrescriptionReader;