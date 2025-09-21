// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";

// Components
import Navbar from "./components/Navbar/Navbar";
import ChatWindow from "./components/ChatWindow";
import PrescriptionReader from "./components/PrescriptionReader";
import CommunityHome from "./components/CommunityHome";
import Footer from "./components/Footer";

// Pages
import MapPage from "./pages/MapPage/MapPage";
import AppointmentsPage from "./pages/AppointmentsPage/AppointmentsPage";
import Profile from "./pages/Profile/Profile";
import LandingPage from "./pages/LandingPage";
import SignupPage from "./pages/Signup";
import CompleteYourProfile from "./pages/CompleteYourProfile";
import LoginPage from "./pages/LoginPage";
import CalendarPage from "./pages/CalendarPage";
// Styles
import "./App.css";

// Global styles reset
const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: "Lato", system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #root {
    min-height: 100vh;
  }
`;

// Wrapper to conditionally show Navbar/Footer
function Layout({ children }) {
  const location = useLocation();

  // Routes that should NOT show navbar/footer
  const authRoutes = ["/", "/login", "/signup", "/complete"];
  const hideLayout = authRoutes.includes(location.pathname);

  return (
    <div className="app">
      {!hideLayout && <Navbar />}
      <main className="app-content">{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
}

function App() {
  // Inject global styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Landing/Auth flow */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/complete" element={<CompleteYourProfile />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Main app flow with Navbar/Footer */}
            <Route path="/map" element={<MapPage />} />
            <Route path="/appointments" element={<MapPage />} />
            <Route path="/history" element={<AppointmentsPage />} />
            <Route path="/symptom-checker" element={<ChatWindow />} />
            <Route path="/prescription-reader" element={<PrescriptionReader />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/communityForum" element={<CommunityHome />} />
            {/* Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
