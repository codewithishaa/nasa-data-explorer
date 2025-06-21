import React, { useEffect, useState } from "react";
import axios from "axios";

const MarsRoverViewer = ({ date }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/mars?date=${date}`);
        setPhotos(res.data);
      } catch (err) {
        console.error("Failed to fetch Mars photos", err);
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      fetchPhotos();
    }
  }, [date]);

  return (
    <div className="chart-wrapper">
      <h2 style={{ textAlign: "center" }}>🚗 Mars Rover Photos</h2>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading Mars photos...</p>
      ) : photos.length === 0 ? (
        <p style={{ textAlign: "center" }}>No photos available for this date.</p>
      ) : (
        <div className="scrollable-row">
          {photos.map((photo, i) => (
            <div className="mars-card" key={i}>
              <div className="mars-img-wrapper">
                <img src={photo.img_src} alt={`Mars-${i}`} className="mars-image" />
              </div>
              <div className="mars-meta">
                <p><span>📷 Camera:</span> {photo.camera.name}</p>
                <p><span>🛠️ Rover:</span> {photo.rover.name}</p>
                <p><span>📅 Earth Date:</span> {photo.earth_date}</p>
                <p><span>🌞 Sol:</span> {photo.sol}</p>
                <hr />
                <p style={{ fontStyle: "italic", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  <span role="img" aria-label="brain">🧠</span> <strong>AI Summary:</strong><br />
                  {photo.ai_summary || "Not available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarsRoverViewer;
