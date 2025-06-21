import React, { useEffect, useState } from "react";
import axios from "axios";

const EpicViewer = ({ date }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchEpicImages = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/epic?date=${date}`);
        setImages(res.data);
      } catch (err) {
        console.error("EPIC fetch failed:", err.message);
      }
    };

    if (date) fetchEpicImages();
  }, [date]);

  return (
    <div className="chart-wrapper">
      <h2 style={{ textAlign: "center" }}>🌍 NASA EPIC Earth Images</h2>

      {images.length === 0 ? (
        <p style={{ textAlign: "center" }}>No EPIC images available for this date.</p>
      ) : (
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "1.5rem",
            padding: "1rem 0",
            paddingBottom: "1.5rem",
          }}
        >
          {images.map((img, i) => (
            <div
              className="mars-card"
              key={i}
              style={{
                minWidth: "240px",
                maxWidth: "240px",
                flex: "0 0 auto",
                display: "flex",
                flexDirection: "column",
                borderRadius: "12px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "220px",
                  height: "220px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#000",
                  borderRadius: "12px 12px 0 0",
                }}
              >
                <img
                  src={img.image}
                  alt="Earth"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    borderRadius: "12px",
                  }}
                />
              </div>

              <div className="mars-meta" style={{ padding: "0.75rem", width: "100%" }}>
                <p style={{ fontWeight: "bold", fontSize: "1rem" }}>📸 EPIC Snapshot</p>
                <p style={{ fontSize: "0.85rem", lineHeight: "1.3" }}>
                  {img.caption.length > 80 ? img.caption.slice(0, 80) + "..." : img.caption}
                </p>
                <p style={{ fontSize: "0.8rem", color: "gray", marginTop: "4px" }}>
                  🕒 {new Date(img.time).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EpicViewer;
