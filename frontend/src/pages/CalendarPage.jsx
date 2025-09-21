import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import AppointmentForm from '../components/AppointmentForm/AppointmentForm';
import { fetchAppointments } from '../api/api';
import enUS from 'date-fns/locale/en-US';  // use import instead of require

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const CalendarPage = ({ hospital }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadAppointments = async () => {
    try {
      const res = await fetchAppointments();
      if (res.success) {
        const appointmentEvents = res.appointments.map((a) => ({
          id: a.id,
          title: `Dr. ${a.doctor_name}`,
          start: new Date(`${a.date}T${a.time}`),
          end: new Date(`${a.date}T${a.time}`),
        }));
        setEvents(appointmentEvents);
      } else {
        console.error('Error fetching appointments:', res.error);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleSelectSlot = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowForm(true);
  };

  const handleNewAppointment = (newAppt) => {
    setEvents((prev) => [
      ...prev,
      {
        id: newAppt.id,
        title: `Dr. ${newAppt.doctor_name}`,
        start: new Date(`${newAppt.date}T${newAppt.time}`),
        end: new Date(`${newAppt.date}T${newAppt.time}`),
      },
    ]);
  };

  const handleSelectEvent = async (event) => {
    if (!window.confirm(`Cancel appointment with ${event.title}?`)) return;

    try {
      const res = await fetch(`http://localhost:8090/api/appointments/cancel/${event.id}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setEvents((prev) => prev.filter((e) => e.id !== event.id));
        alert('Appointment cancelled successfully!');
      } else {
        alert(result.error || 'Failed to cancel appointment');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while cancelling appointment');
    }
  };

  const eventStyleGetter = () => ({
    style: {
      backgroundColor: '#3b82f6',
      color: 'white',
      borderRadius: '8px',
      padding: '4px',
    },
  });

  return (
    <div style={{ padding: '20px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: '80vh' }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />

      {showForm && selectedDate && (
        <AppointmentForm
          hospital={hospital}
          initialDate={selectedDate}
          onClose={() => setShowForm(false)}
          onSuccess={handleNewAppointment}
        />
      )}
    </div>
  );
};

export default CalendarPage;
