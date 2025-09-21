import React from 'react';
import { useApp } from '../../context/AppContext';
import './HospitalCard.css';
import img from '../../assets/image.png';

// Lucide icons
import { Stethoscope, MapPin, Hospital, Phone, User, Calendar } from 'lucide-react';

const HospitalCard = ({ hospital, onBookAppointment, onViewProfile, isSelected }) => {
  const { translate } = useApp();

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return stars;
  };

  const handleBookAppointment = (e) => {
    e.stopPropagation();
    onBookAppointment(hospital);
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    onViewProfile && onViewProfile(hospital);
  };

  return (
    <div className={`hospital-card ${isSelected ? 'selected' : ''}`}>
      <div className="hospital-card-header">
        <img 
          src={img} 
          alt={hospital.name}
          className="hospital-avatar"
        />
        <div className="hospital-info">
          <h3 className="hospital-name">{hospital.name}</h3>
          <div className="hospital-rating">
            <div className="stars">
              {renderStars(hospital.rating)}
            </div>
            <span className="rating-value">({hospital.rating})</span>
          </div>
        </div>
        {hospital.type === 'doctor'}
      </div>

      <div className="hospital-details">
        <div className="detail-item">
          <span className="detail-icon"><MapPin size={16} /></span>
          <span className="detail-text">{hospital.address}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-icon"><Hospital size={16} /></span>
          <span className="detail-text">{hospital.specialization}</span>
        </div>
        
        <div className="detail-item">
          <span className="detail-icon"><Phone size={16} /></span>
          <span className="detail-text">{hospital.phone}</span>
        </div>
      </div>

      <div className="hospital-actions">
        <button
          className="btn btn-outline"
          onClick={handleViewProfile}
        >
          <span className="btn-icon"><User size={16} /></span>
          {translate('viewProfile')}
        </button>
        
        <button
          className="btn btn-primary"
          onClick={handleBookAppointment}
        >
          <span className="btn-icon"><Calendar size={16} /></span>
          {translate('bookAppointment')}
        </button>
      </div>

      {isSelected && (
        <div className="selection-indicator">
          <div className="selection-pulse"></div>
        </div>
      )}
    </div>
  );
};

export default HospitalCard;
