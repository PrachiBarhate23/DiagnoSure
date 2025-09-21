import React, { useState, useEffect } from 'react';
import './AppointmentForm.css';
import { addAppointment } from '../../api/api';

const AppointmentForm = ({ hospital, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    doctorName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Hardcoded slots
  useEffect(() => {
    if (hospital && formData.appointmentDate) {
      const hardcodedSlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
      setAvailableSlots(hardcodedSlots);
    }
  }, [hospital, formData.appointmentDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctorName.trim()) newErrors.doctorName = 'Doctor name is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    else if (new Date(formData.appointmentDate) < new Date().setHours(0,0,0,0))
      newErrors.appointmentDate = 'Appointment date must be in the future';
    if (!formData.appointmentTime) newErrors.appointmentTime = 'Appointment time is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        doctor_name: formData.doctorName,
        hospital_name: hospital.name,
        date: formData.appointmentDate,
        time: formData.appointmentTime,
        symptoms: formData.reason,
      };

      const result = await addAppointment(payload);

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess && onSuccess(result.appointment);
          onClose();
        }, 2000);
      } else {
        setErrors({ submit: result.error || 'Booking failed' });
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      setErrors({ submit: 'Network error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  if (showSuccess) {
    return (
      <div className="appointment-success">
        <div className="success-icon">✅</div>
        <h3>Appointment Booked!</h3>
        <p>
          Appointment with {hospital.name} has been scheduled.
        </p>
      </div>
    );
  }

  return (
    <div className="appointment-form">
      <div className="hospital-info">
        <img src={hospital.image} alt={hospital.name} className="hospital-image" />
        <div className="hospital-details">
          <h3>{hospital.name}</h3>
          <p className="hospital-address">{hospital.address}</p>
          <p className="hospital-specialization">{hospital.specialization}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="doctorName">Doctor Name *</label>
          <input
            type="text"
            id="doctorName"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className={errors.doctorName ? 'error' : ''}
            placeholder="Enter Doctor Name"
          />
          {errors.doctorName && <span className="error-message">{errors.doctorName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="appointmentDate">Appointment Date *</label>
            <input
              type="date"
              id="appointmentDate"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              min={getTodayDate()}
              className={errors.appointmentDate ? 'error' : ''}
            />
            {errors.appointmentDate && <span className="error-message">{errors.appointmentDate}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="appointmentTime">Appointment Time *</label>
            <select
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              className={errors.appointmentTime ? 'error' : ''}
            >
              <option value="">Select Time</option>
              {availableSlots.length > 0 ? (
                availableSlots.map((t) => <option key={t} value={t}>{t}</option>)
              ) : (
                <option disabled>No slots available</option>
              )}
            </select>
            {errors.appointmentTime && <span className="error-message">{errors.appointmentTime}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason *</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            className={errors.reason ? 'error' : ''}
            placeholder="Describe reason for appointment"
          />
          {errors.reason && <span className="error-message">{errors.reason}</span>}
        </div>

        {errors.submit && <div className="error-message">{errors.submit}</div>}

        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
