import React, { useState } from "react";
import ApodViewer from "../components/ApodViewer";
import VoiceSearch from "../components/VoiceSearch";
import NeoChart from "../components/NeoChart";
import AsteroidSizeChart from "../components/AsteroidSizeChart";
import AsteroidHazardChart from "../components/AsteroidHazardChart";
import ApproachSpeedChart from "../components/ApproachSpeedChart";
import MarsRoverViewer from "../components/MarsRoverViewer";
import EpicViewer from "../components/EpicViewer";
import ImageLibraryViewer from "../components/ImageLibraryViewer";

// 📅 Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
};

const Home = ({ theme, toggleTheme }) => {
  const [date, setDate] = useState(getTodayDate()); // ✅ Set today as default

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>🚀 NASA Data Explorer</h1>
      
      {/* 🎙️ Voice search stays untouched */}
      <VoiceSearch onDateRecognized={setDate} />

      {/* 📷 APOD section */}
      <ApodViewer date={date} setDate={setDate} toggleTheme={toggleTheme} theme={theme} />

      {/* 📊 Data visualizations */}
      <NeoChart date={date} theme={theme} />
      <AsteroidHazardChart date={date} />
      <AsteroidSizeChart date={date} />
      <ApproachSpeedChart date={date} />

      {/* 🚗 Mars Rover images */}
      <MarsRoverViewer date={date} />

      {/* 🌍 Earth EPIC photos */}
      <EpicViewer date={date} />

      {/* 🖼️ NASA Image Library search results */}
      <ImageLibraryViewer />
    </div>
  );
};

export default Home;
