import React, { useState } from 'react';
import './AppointmentModal.css';

const AppointmentModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would submit this to your backend
    console.log('Appointment booked:', formData);
    alert('Appointment request submitted! You will receive a confirmation email shortly.');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book an Appointment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="appointment-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Preferred Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="time">Preferred Time *</label>
              <select
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
              >
                <option value="">Select time</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="reason">Reason for Visit</label>
            <textarea
              id="reason"
              name="reason"
              rows="3"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Brief description of your symptoms or reason for appointment"
            ></textarea>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;