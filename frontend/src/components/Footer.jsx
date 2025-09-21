
import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, CheckCircle, XCircle, Printer, Save, Phone } from 'lucide-react';

// Footer Component
const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
  },
  headerContainer: {
    maxWidth: '1152px',
    margin: '0 auto',
    padding: '32px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  headerContent: {
    flex: 1
  },
  title: {
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '16px'
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6b7280',
    maxWidth: '32rem',
    lineHeight: '1.7'
  },
  uploadArea: {
    marginLeft: '32px'
  },
  dropZone: {
    position: 'relative',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: '32px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minWidth: '320px',
    minHeight: '180px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dropZoneHover: {
    borderColor: '#60a5fa',
    backgroundColor: '#eff6ff'
  },
  dropZoneActive: {
    backgroundColor: '#f9fafb'
  },
  uploadIcon: {
    width: '48px',
    height: '48px',
    color: '#3b82f6',
    marginBottom: '16px'
  },
  uploadText: {
    fontSize: '1.125rem',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  uploadSubtext: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  hiddenInput: {
    display: 'none'
  },
  container: {
    maxWidth: '1152px',
    margin: '0 auto',
    padding: '32px 24px'
  },
  orSection: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  orText: {
    color: '#6b7280',
    fontSize: '1.125rem',
    fontWeight: '500'
  },
  manualSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    padding: '24px',
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px'
  },
  textarea: {
    width: '100%',
    height: '128px',
    padding: '16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    resize: 'none',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s',
    fontFamily: 'inherit'
  },
  textareaFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  },
  analyzeBtn: {
    marginTop: '16px',
    width: '100%',
    backgroundColor: '#2563eb',
    color: 'white',
    fontWeight: '600',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.2s'
  },
  analyzeBtnHover: {
    backgroundColor: '#1d4ed8'
  },
  resultsSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb',
    padding: '24px'
  },
  resultsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '32px'
  },
  medicationItem: {
    borderLeft: '4px solid #10b981',
    paddingLeft: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    marginBottom: '16px'
  },
  medicationHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px'
  },
  checkIcon: {
    width: '20px',
    height: '20px',
    color: '#10b981',
    marginRight: '8px'
  },
  medicationName: {
    fontWeight: '600',
    color: '#1f2937'
  },
  medicationInstructions: {
    color: '#374151',
    marginBottom: '4px'
  },
  medicationNote: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontStyle: 'italic'
  },
  interactionItem: {
    paddingLeft: '16px',
    paddingTop: '8px',
    paddingBottom: '8px',
    marginBottom: '16px'
  },
  interactionHigh: {
    borderLeft: '4px solid #ef4444'
  },
  interactionModerate: {
    borderLeft: '4px solid #f59e0b'
  },
  interactionNone: {
    borderLeft: '4px solid #10b981'
  },
  interactionHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '8px'
  },
  interactionTitle: {
    fontWeight: '600',
    marginLeft: '8px'
  },
  interactionTitleHigh: {
    color: '#dc2626'
  },
  interactionTitleModerate: {
    color: '#d97706'
  },
  interactionTitleNone: {
    color: '#059669'
  },
  interactionDescription: {
    color: '#374151',
    fontSize: '0.875rem'
  },
  actionButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginTop: '32px',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb'
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s'
  },
  actionBtnSecondary: {
    backgroundColor: '#f3f4f6',
    color: '#374151'
  },
  actionBtnSecondaryHover: {
    backgroundColor: '#e5e7eb'
  },
  actionBtnPrimary: {
    backgroundColor: '#2563eb',
    color: 'white'
  },
  actionBtnPrimaryHover: {
    backgroundColor: '#1d4ed8'
  },
  actionBtnIcon: {
    width: '16px',
    height: '16px',
    marginRight: '8px'
  },
  footer: {
    background: 'linear-gradient(135deg, #1e3a8a 0%, #059669 100%)',
    color: 'white',
    padding: '40px 20px 20px',
    marginTop: '60px'
  },
  footerContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '30px',
    marginBottom: '30px'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  footerTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '5px'
  },
  footerLink: {
    color: '#e5e7eb',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'color 0.2s'
  },
  socialIcons: {
    display: 'flex',
    gap: '15px',
    marginTop: '10px'
  },
  socialIcon: {
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'transform 0.2s'
  },
  footerBottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#d1d5db'
  },
  footerTagline: {
    fontSize: '16px',
    fontWeight: '500',
    marginBottom: '10px',
    gridColumn: '1 / -1'
  }
};

// Icon Components (SVG)
const UploadIcon = () => (
  <svg style={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const CheckIcon = () => (
  <svg style={styles.checkIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = () => (
  <svg style={{...styles.checkIcon, color: '#ef4444'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = () => (
  <svg style={{...styles.checkIcon, color: '#f59e0b'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
  </svg>
);

const PrintIcon = () => (
  <svg style={styles.actionBtnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

const SaveIcon = () => (
  <svg style={styles.actionBtnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
  </svg>
);

const PhoneIcon = () => (
  <svg style={styles.actionBtnIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

// Footer Component
const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContainer}>
        <div style={styles.footerSection}>
          <h3 style={styles.footerTitle}>About Us</h3>
          <a href="#" style={styles.footerLink}>Our Mission</a>
          <a href="#" style={styles.footerLink}>Team</a>
          <a href="#" style={styles.footerLink}>Careers</a>
        </div>
        <div style={styles.footerSection}>
          <h3 style={styles.footerTitle}>Resources</h3>
          <a href="#" style={styles.footerLink}>Blog</a>
          <a href="#" style={styles.footerLink}>FAQ</a>
          <a href="#" style={styles.footerLink}>Support</a>
        </div>
        <div style={styles.footerSection}>
          <h3 style={styles.footerTitle}>Legal</h3>
          <a href="#" style={styles.footerLink}>Terms of Service</a>
          <a href="#" style={styles.footerLink}>Privacy Policy</a>
        </div>
        <div style={styles.footerSection}>
          <h3 style={styles.footerTitle}>Contact Us</h3>
          <a href="#" style={styles.footerLink}>Contact Form</a>
          <a href="#" style={styles.footerLink}>Partnerships</a>
          <div style={styles.socialIcons}>
            <span style={styles.socialIcon}>📘</span>
            <span style={styles.socialIcon}>🐦</span>
            <span style={styles.socialIcon}>📷</span>
            <span style={styles.socialIcon}>💼</span>
          </div>
        </div>
      </div>
      <div style={styles.footerContainer}>
        <div style={{...styles.footerSection, ...{gridColumn: '1 / -1'}}}>
          <p style={styles.footerTagline}>
            AI-powered tools for personal health management and proactive care.<br/>
            This tool helps you understand your symptoms and prescriptions, but it does not replace a doctor - always consult a healthcare professional for medical advice.
          </p>
        </div>
      </div>
      <div style={styles.footerBottom}>
        <p>&copy; 2024 AI Prescription Reader. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;