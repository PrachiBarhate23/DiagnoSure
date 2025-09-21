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
