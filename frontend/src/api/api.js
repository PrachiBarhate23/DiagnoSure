import axios from 'axios';

const BASE_URL = "http://localhost:8090";

export const signupUser = (data) =>
  axios.post(`${BASE_URL}/auth/registration/`, data);

export const loginUser = (data) =>
  axios.post(`${BASE_URL}/auth/jwt/login/`, data);

export const completeProfile = (data, token) =>
  axios.post(`${BASE_URL}/api/profile/complete/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

  export const addAppointment = async (data, token = null) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/appointments/book/`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return { success: true, appointment: res.data };
  } catch (err) {
    console.error('Appointment booking error:', err.response || err.message);
    
    const message = err.response?.data
      ? JSON.stringify(err.response.data)
      : 'Network error. Please try again.';
      
    return { success: false, error: message };
  }
};

// Fetch all appointments for a user
export const fetchAppointments = async (token = null) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/appointments/`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return { success: true, appointments: res.data };
  } catch (err) {
    console.error('Fetching appointments error:', err.response || err.message);
    
    const message = err.response?.data
      ? JSON.stringify(err.response.data)
      : 'Network error. Please try again.';
      
    return { success: false, error: message };
  }
};
