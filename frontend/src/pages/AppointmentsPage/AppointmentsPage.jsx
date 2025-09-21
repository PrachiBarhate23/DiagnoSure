// src/pages/AppointmentsPage/AppointmentsPage.jsx
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  User,
  ClipboardList,
  Phone,
  XCircle,
  RefreshCw
} from 'lucide-react';
import './AppointmentsPage.css';

const AppointmentsPage = () => {
  const { appointments, removeAppointment, translate } = useApp();
  const [filter, setFilter] = useState('all'); // all, upcoming, past
  const [sortBy, setSortBy] = useState('date'); // date, hospital

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const isUpcoming = (appointmentDate) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    return appointment >= today;
  };

  const getFilteredAppointments = () => {
    let filtered = [...appointments];

    if (filter === 'upcoming') {
      filtered = filtered.filter(app => isUpcoming(app.appointmentDate));
    } else if (filter === 'past') {
      filtered = filtered.filter(app => !isUpcoming(app.appointmentDate));
    }

    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.appointmentDate) - new Date(b.appointmentDate);
      } else if (sortBy === 'hospital') {
        return a.hospitalName.localeCompare(b.hospitalName);
      }
      return 0;
    });

    return filtered;
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      removeAppointment(appointmentId);
    }
  };

  const getAppointmentStatus = (appointmentDate) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    const diffTime = appointment - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 30));

    if (diffDays < 0) {
      return { status: 'completed', text: 'Completed', class: 'status-completed' };
    } else if (diffDays === 0) {
      return { status: 'today', text: 'Today', class: 'status-today' };
    } else if (diffDays === 1) {
      return { status: 'tomorrow', text: 'Tomorrow', class: 'status-tomorrow' };
    } else if (diffDays <= 7) {
      return { status: 'upcoming', text: `In ${diffDays} days`, class: 'status-upcoming' };
    } else {
      return { status: 'scheduled', text: 'Scheduled', class: 'status-scheduled' };
    
  };

  const filteredAppointments = getFilteredAppointments();

  return (
    <div className="appointments-page">
      {/* Header */}
      <div className="appointments-header">
        <div className="header-content">
          <h1 className="page-title">{translate('myAppointments')}</h1>
          <div className="appointments-stats">
            <div className="stat-card">
              <div className="stat-number">{appointments.length}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">
                {appointments.filter(app => isUpcoming(app.appointmentDate)).length}
              </div>
              <div className="stat-label">Upcoming</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="appointments-controls">
        <div className="controls-content">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({appointments.length})
            </button>
            <button
              className={`filter-tab ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming ({appointments.filter(app => isUpcoming(app.appointmentDate)).length})
            </button>
            <button
              className={`filter-tab ${filter === 'past' ? 'active' : ''}`}
              onClick={() => setFilter('past')}
            >
              Past ({appointments.filter(app => !isUpcoming(app.appointmentDate)).length})
            </button>
          </div>

          <div className="sort-controls">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="date">Date</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="appointments-content">
        {filteredAppointments.length === 0 ? (
          <div className="no-appointments">
            <div className="no-appointments-icon">
              <Calendar size={40} />
            </div>
            <h3>{translate('noAppointments')}</h3>
            <p>You haven't booked any appointments yet.</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.href = '/'}
            >
              Book Your First Appointment
            </button>
          </div>
        ) : (
          <div className="appointments-list">
            {filteredAppointments.map((appointment) => {
              const status = getAppointmentStatus(appointment.appointmentDate);
              return (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <div className="appointment-info">
                      <h3 className="hospital-name">{appointment.hospitalName}</h3>
                      <p className="hospital-address">{appointment.hospitalAddress}</p>
                      <p className="hospital-specialization">{appointment.hospitalSpecialization}</p>
                    </div>
                    <div className={`appointment-status ${status.class}`}>
                      {status.text}
                    </div>
                  </div>

                  <div className="appointment-details">
                    <div className="detail-row">
                      <div className="detail-item">
                        <User size={30} className="detail-icon" />
                        <div className="detail-content">
                          <span className="detail-label">Patient</span>
                          <span className="detail-value">{appointment.patientName}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Calendar size={30} className="detail-icon" />
                        <div className="detail-content">
                          <span className="detail-label">{translate('date')}</span>
                          <span className="detail-value">{formatDate(appointment.appointmentDate)}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Clock size={30} className="detail-icon" />
                        <div className="detail-content">
                          <span className="detail-label">{translate('time')}</span>
                          <span className="detail-value">{formatTime(appointment.appointmentTime)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="reason-section">
                      <ClipboardList size={30} className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Reason for Visit</span>
                        <span className="detail-value reason-text">{appointment.reason}</span>
                      </div>
                    </div>
                  </div>

                  <div className="appointment-actions">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => alert('Reschedule feature coming soon!')}
                      disabled={!isUpcoming(appointment.appointmentDate)}
                    >
                      <RefreshCw size={30} /> Reschedule
                    </button>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => alert('Contact feature coming soon!')}
                    >
                      <Phone size={30} /> Contact
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleCancelAppointment(appointment.id)}
                      disabled={!isUpcoming(appointment.appointmentDate)}
                    >
                      <XCircle size={30} /> Cancel
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
};
export default AppointmentsPage;