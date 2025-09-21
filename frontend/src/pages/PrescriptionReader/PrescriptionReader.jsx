
// src/pages/PrescriptionReader/PrescriptionReader.jsx

import React from 'react';
import { useApp } from '../../context/AppContext';
import './PrescriptionReader.css';

const PrescriptionReader = () => {
  const { translate } = useApp();

  return (
    <div className="prescription-reader-page">
      <div className="page-header">
        <h1>{translate('prescriptionReader')}</h1>
      </div>
      <div className="page-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">📋</div>
          <h2>Prescription Reader</h2>
          <p>OCR-powered prescription scanning coming soon!</p>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionReader;