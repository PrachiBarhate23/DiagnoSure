import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useGeolocated } from "react-geolocated";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useApp } from "../../context/AppContext";
import HospitalCard from "../../components/HospitalCard/HospitalCard";
import Modal from "../../components/Modal/Modal";
import AppointmentForm from "../../components/AppointmentForm/AppointmentForm";

import { Search, MapPin, Crosshair } from "lucide-react";
import "./MapPage.css";

// Fix leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Floating locate button
const LocateButton = ({ userLocation }) => {
  const map = useMap();
  const handleClick = () => {
    if (userLocation) map.setView(userLocation, 15, { animate: true });
  };
  return (
    <button onClick={handleClick} className="locate-btn" title="Recenter to your location">
      <Crosshair size={20} />
    </button>
  );
};

const MapPage = () => {
  const { translate, hospitals, fetchHospitalsNearby } = useApp();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [appointmentHospital, setAppointmentHospital] = useState(null);
  const [searchLocation, setSearchLocation] = useState("");

  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: { enableHighAccuracy: true },
    userDecisionTimeout: 5000,
  });

  const handleSearch = () => {
    if (coords) fetchHospitalsNearby(coords.latitude, coords.longitude, searchLocation || "hospital");
  };

  const onBookAppointment = (hospital) => {
    setAppointmentHospital(hospital);
    setIsAppointmentModalOpen(true);
    setSelectedHospital(null);
  };

  const onViewProfile = (hospital) => console.log("View profile:", hospital.name);

  const handleAppointmentSuccess = (appointment) => {
    console.log("Appointment booked successfully:", appointment);
  };

  if (!isGeolocationAvailable) return <p>Your browser does not support Geolocation ❌</p>;
  if (!isGeolocationEnabled) return <p>Geolocation is not enabled ❌</p>;
  if (!coords) return <p>{translate("loadingLocation") || "Getting your location..."}</p>;

  const userLocation = [coords.latitude, coords.longitude];

  return (
    <div className="map-page">
      {/* Header */}
      <div className="map-header">
        <div className="map-header-content">
          <h1 className="page-title">{translate("careAppointments")}</h1>
          <button className="find-appointments-btn" onClick={handleSearch}>
            <Search size={16} /> {translate("findAppointments")}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-input-wrapper">
            <MapPin size={20} />
            <input
              type="text"
              placeholder={translate("searchLocation")}
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="search-btn" onClick={handleSearch}>
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <MapContainer center={userLocation} zoom={13} style={{ height: "400px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <Marker position={userLocation}>
            <Popup>{translate("yourLocation") || "You are here 🚩"}</Popup>
          </Marker>

          {hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={hospital.coordinates}
              eventHandlers={{ click: () => setSelectedHospital(hospital) }}
            >
              <Popup>
                <div className="info-window">
                  <h3>{hospital.name}</h3>
                  <p>{hospital.address}</p>
                  <p><strong>{hospital.specialization}</strong></p>
                  <button className="info-window-btn" onClick={() => onBookAppointment(hospital)}>
                    {translate("bookAppointment")}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          <LocateButton userLocation={userLocation} />
        </MapContainer>
      </div>

      {/* Nearby Providers */}
      <div className="providers-section">
        <h2 className="section-title">{translate("nearbyProviders")}</h2>
        <div className="providers-grid">
          {hospitals.map((hospital) => (
            <HospitalCard
              key={hospital.id}
              hospital={hospital}
              onBookAppointment={onBookAppointment}
              onViewProfile={onViewProfile}
              isSelected={selectedHospital?.id === hospital.id}
            />
          ))}
        </div>
      </div>

      {/* Appointment Modal */}
      <Modal
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        title={translate("bookAppointment")}
        size="medium"
      >
        {appointmentHospital && (
          <AppointmentForm
            hospital={appointmentHospital}
            onClose={() => setIsAppointmentModalOpen(false)}
            onSuccess={handleAppointmentSuccess}
          />
        )}
      </Modal>
    </div>
  );
};

export default MapPage;
