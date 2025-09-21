import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

const API_BASE = "http://localhost:8090"; // change if needed
const token = localStorage.getItem("token");

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [appointments, setAppointments] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => { localStorage.setItem("theme", theme); document.documentElement.setAttribute("data-theme", theme); }, [theme]);
  useEffect(() => { localStorage.setItem("language", language); }, [language]);

  // ---- Backend integration ----
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments/list/`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setAppointments(data || []);
    } catch (err) { console.error(err); }
  };

  const addAppointment = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/book/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) setAppointments(prev => [...prev, data.appointment]);
      return data;
    } catch (err) { console.error(err); return { success: false }; }
  };

  const removeAppointment = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/cancel/${id}/`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setAppointments(prev => prev.filter(a => a.id !== id));
      return data;
    } catch (err) { console.error(err); return { success: false }; }
  };

  const fetchHospitalsNearby = async (lat, lng) => {
    try {
      const res = await fetch(`${API_BASE}/hospitals/search/?lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setHospitals(data.hospitals || []);
    } catch (err) { console.error(err); }
  };

  const translate = (key) => translations[language]?.[key] || translations.en[key] || key;
  const toggleTheme = () => setTheme(prev => (prev === "light" ? "dark" : "light"));
  const changeLanguage = (lang) => setLanguage(lang);

  return (
    <AppContext.Provider value={{
      theme,
      language,
      appointments,
      hospitals,
      toggleTheme,
      changeLanguage,
      translate,
      fetchAppointments,
      addAppointment,
      removeAppointment,
      fetchHospitalsNearby
    }}>
      {children}
    </AppContext.Provider>
  );
};
