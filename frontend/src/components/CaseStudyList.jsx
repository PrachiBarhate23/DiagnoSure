import React from 'react';
import './CaseStudyList.css';

const CaseStudyList = ({ caseStudies }) => {
  return (
    <div className="case-study-list">
      <h3>Past History Case Study</h3>
      <div className="case-study-items">
        {caseStudies && caseStudies.length > 0 ? (
          caseStudies.map((caseStudy, index) => (
            <div key={index} className="case-study-item">
              <div className="case-id">Case #{caseStudy.case_id}</div>
              <p className="case-summary">{caseStudy.short_summary}</p>
              {caseStudy.link && (
                <a 
                  href={caseStudy.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-link"
                >
                  Learn More
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="no-cases">No case studies available.</p>
        )}
      </div>
    </div>
  );
};

export default CaseStudyList;