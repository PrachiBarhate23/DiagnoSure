import React from 'react';
import './ConditionCard.css';

const ConditionCard = ({ condition }) => {
  const confidencePercentage = Math.round(condition.confidence * 100);
  
  return (
    <div className="condition-card">
      <div className="condition-header">
        <h3 className="condition-name">{condition.name}</h3>
        <div className="confidence-badge">
          <span className="confidence-text">Confidence: {confidencePercentage}%</span>
          <div className="confidence-bar">
            <div 
              className="confidence-fill"
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <p className="condition-insights">{condition.insights}</p>
      
      {condition.evidence_links && condition.evidence_links.length > 0 && (
        <div className="evidence-links">
          <span className="evidence-label">Learn More:</span>
          {condition.evidence_links.map((link, index) => (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="evidence-link"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConditionCard;