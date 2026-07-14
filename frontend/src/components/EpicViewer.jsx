import React, { useEffect, useState, useCallback } from "react";
import { fetchEPIC } from "../services/nasaApi";
import LoadingSkeleton from "./common/LoadingSkeleton";
import EmptyState from "./common/EmptyState";
import ImageModal from "./common/ImageModal";

const EpicViewer = ({ date, refreshKey }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [actualDate, setActualDate] = useState("");

  const fetchEpicImages = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEPIC(date);
      setImages(data?.images || []);
      setActualDate(data?.actualDate || "");
    } catch (err) {
      console.error("EPIC fetch failed:", err.message);
      setImages([]);
      setActualDate("");
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    if (date) {
      fetchEpicImages();
    }
  }, [fetchEpicImages, refreshKey, date]);

  return (
    <div className="glass-panel" style={styles.container}>
      {actualDate && (
        <div style={{ marginBottom: "1rem", color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: "600" }}>
          🛰️ Displaying the latest available NASA EPIC imagery.
        </div>
      )}

      {loading ? (
        <div style={{ padding: "2rem 0" }}>
          <LoadingSkeleton type="card" count={3} message="Loading Earth Observations..." />
        </div>
      ) : images.length === 0 ? (
        <EmptyState
          message="No Earth Observations Recorded"
          icon="🌍"
          subtext="No EPIC imagery available for the selected date."
        />
      ) : (
        <div style={styles.grid}>
          {images.map((img, i) => (
            <div
              className="media-card glass-panel"
              key={i}
              onClick={() => setSelectedImage(img)}
              style={styles.epicCard}
            >
              <img
                src={img.imageUrl}
                alt="Earth"
                style={styles.epicImage}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=1000";
                }}
              />
              <div className="media-card-body">
                <div>
                  <h4 className="media-card-title">DSCOVR EPIC Snapshot</h4>
                  <p className="media-card-desc">{img.caption}</p>
                </div>
                <div className="media-card-meta">
                  <span>📅 {img.date ? img.date.split(" ")[0] : ""}</span>
                  <span style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)" }}>
                    ID: {img.identifier}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.imageUrl}
          title="DSCOVR Earth Polychromatic Imaging Camera (EPIC) Capture"
          description={selectedImage.caption}
          metadata={{
            "Satellite": "DSCOVR Spacecraft",
            "Camera": "EPIC",
            "Distance": "~1 Million Miles (L1 Orbit)",
            "Capture Date/Time": selectedImage.date,
            "Image Identifier": selectedImage.identifier,
          }}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "1.5rem",
    marginTop: "1.5rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1.5rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "1.25rem",
  },
  textBlock: {
    flex: "1 1 350px",
  },
  infoText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.88rem",
    lineHeight: "1.4",
  },
  pickerWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  label: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "0.75rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  dateInput: {
    width: "180px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  epicCard: {
    height: "460px",
    display: "flex",
    flexDirection: "column",
  },
  epicImage: {
    width: "100%",
    height: "260px",
    objectFit: "contain",
    background: "#000",
    borderRadius: "16px",
  },
};

export default EpicViewer;
