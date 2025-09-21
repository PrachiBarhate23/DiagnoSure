import React, { createContext, useContext, useState, useEffect } from "react";
import { translations } from "../utils/translations";

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

const API_BASE = "http://localhost:8090/api"; // backend URL
const token = localStorage.getItem("token");

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");
  const [appointments, setAppointments] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // ---- Backend integration ----
  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments/list/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addAppointment = async (payload) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/book/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.appointment) setAppointments((prev) => [...prev, data.appointment]);
      return data;
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  const removeAppointment = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/cancel/${id}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.message) setAppointments((prev) => prev.filter((a) => a.id !== id));
      return data;
    } catch (err) {
      console.error(err);
      return { success: false };
    }
  };

  const fetchHospitalsNearby = async (lat, lon, query = "hospital") => {
    try {
      const res = await fetch(`${API_BASE}/hospitals/search/?lat=${lat}&lon=${lon}&query=${query}`);
      const data = await res.json();

      // Map API response to UI-friendly structure
      const mapped = data.map((h) => ({
        id: h.osm_id || h.id || Math.random(), // fallback id
        name: h.name || h.display_name || "Unknown Hospital",
        coordinates: [parseFloat(h.lat), parseFloat(h.lon)],
        address: h.display_name || "",
        specialization: h.type || "General",
      }));

      setHospitals(mapped);
      console.log("Mapped hospitals:", mapped); // optional: for debugging
    } catch (err) {
      console.error(err);
      setHospitals([]);
    }
  };

  const translate = (key) =>
    translations[language]?.[key] || translations.en[key] || key;

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));
  const changeLanguage = (lang) => setLanguage(lang);

  return (
    <AppContext.Provider
      value={{
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
        fetchHospitalsNearby,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
