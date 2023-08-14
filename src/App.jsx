import React, { useState } from "react";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "./App.css";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const OPEN_CAGE_API_KEY = "3191478cb2834f05b835fcdd96410ea2";

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([41.174719, 29.613101]);
  const [mapZoom, setMapZoom] = useState(13);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSearch = async () => {
    if (searchQuery) {
      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
            searchQuery
          )}&key=${OPEN_CAGE_API_KEY}`
        );
        const data = response.data;
        setSearchResults(data.results);
      } catch (error) {
        console.error("Error searching for location:", error);
      }
    }
  };

  const handleResultClick = (result) => {
    setSelectedLocation(result);
    setSearchResults([]);
    setMapCenter([result.geometry.lat, result.geometry.lng]);
    setMapZoom(15);  
  };

  return (
    <>
    <h1>Leaflet Map</h1>
      <MapContainer center={mapCenter} zoom={mapZoom}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>Your Real-Time Location</Popup>
            </Marker>
          )}
          {selectedLocation && (
            <Marker position={[selectedLocation.geometry.lat, selectedLocation.geometry.lng]}>
              <Popup>{selectedLocation.formatted}</Popup>
            </Marker>
          )}
        </MarkerClusterGroup>
      </MapContainer>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a location"
        />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
        <br /><br />
      </div>
      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((result, index) => (
            <li
              key={index}
              onClick={() => handleResultClick(result)}
              className="search-result-item"
            >
              {result.formatted}
            </li>
          ))}
        </ul>
      )}
       <br /><br />
      <button onClick={getUserLocation}>Show My Location</button>
      <br /><br />
      <div><div className="erdemlabel"><a href="https://github.com/erdemonal11" target="_blank" className="erdemlabel">erdemapps.</a></div>  <br /> Beta Version 14/08/2023 Contact me via my GitHub for issues </div>
    </>
  );
}

export default App;
