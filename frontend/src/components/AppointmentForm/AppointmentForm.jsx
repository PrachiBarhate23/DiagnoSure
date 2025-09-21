import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './AppointmentForm.css';

const AppointmentForm = ({ hospital, onClose, onSuccess }) => {
  const { addAppointment, translate, token, API_BASE } = useApp();
  const [formData, setFormData] = useState({
    patientName: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Fetch available time slots whenever hospital or date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (hospital && formData.appointmentDate) {
        try {
          const res = await fetch(`${API_BASE}/appointments/slots/?hospitalId=${hospital.id}&date=${formData.appointmentDate}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          setAvailableSlots(data.slots || []);
        } catch (err) {
          console.error('Error fetching slots:', err);
        }
      }
    };
    fetchSlots();
  }, [hospital, formData.appointmentDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientName.trim()) newErrors.patientName = translate('patientName') + ' is required';
    if (!formData.appointmentDate) newErrors.appointmentDate = translate('appointmentDate') + ' is required';
    else if (new Date(formData.appointmentDate) < new Date().setHours(0,0,0,0))
      newErrors.appointmentDate = translate('appointmentDate') + ' must be in the future';
    if (!formData.appointmentTime) newErrors.appointmentTime = translate('appointmentTime') + ' is required';
    if (!formData.reason.trim()) newErrors.reason = translate('reason') + ' is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = { ...formData, hospitalId: hospital.id };
      const result = await addAppointment(payload);

      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess && onSuccess(result.appointment);
          onClose();
        }, 2000);
      } else {
        console.error('Booking failed:', result);
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  if (showSuccess) {
    return (
      <div className="appointment-success">
        <div className="success-icon">✅</div>
        <h3>{translate('appointmentSuccess')}</h3>
        <p>{translate('appointmentWith')} {hospital.name} {translate('hasBeenScheduled')}.</p>
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
          <label htmlFor="patientName">{translate('patientName')} *</label>
          <input
            type="text"
            id="patientName"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            className={errors.patientName ? 'error' : ''}
            placeholder={translate('enterPatientName')}
          />
          {errors.patientName && <span className="error-message">{errors.patientName}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="appointmentDate">{translate('appointmentDate')} *</label>
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
            <label htmlFor="appointmentTime">{translate('appointmentTime')} *</label>
            <select
              id="appointmentTime"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              className={errors.appointmentTime ? 'error' : ''}
            >
              <option value="">{translate('selectTime')}</option>
              {availableSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.appointmentTime && <span className="error-message">{errors.appointmentTime}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">{translate('reason')} *</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows="3"
            className={errors.reason ? 'error' : ''}
            placeholder={translate('describeReason')}
          />
          {errors.reason && <span className="error-message">{errors.reason}</span>}
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose} disabled={isSubmitting}>{translate('cancel')}</button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? translate('booking') + '...' : translate('submitAppointment')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
