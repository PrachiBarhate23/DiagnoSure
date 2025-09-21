import React from 'react';
import './ResearchList.css';

const ResearchList = ({ research }) => {
  return (
    <div className="research-list">
      <h3>Literature Research</h3>
      <div className="research-items">
        {research && research.length > 0 ? (
          research.map((item, index) => (
            <div key={index} className="research-item">
              <h4 className="research-title">{item.title}</h4>
              <p className="research-summary">{item.summary}</p>
              {item.link && (
                <a 
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="research-link"
                >
                  Learn More
                </a>
              )}
            </div>
          ))
        ) : (
          <p className="no-research">No research data available.</p>
        )}
      </div>
    </div>
  );
};

export default ResearchList;