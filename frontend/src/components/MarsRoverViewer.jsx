import React, { useEffect, useState, useCallback } from "react";
import { fetchMarsPhotos } from "../services/nasaApi";
import LoadingSkeleton from "./common/LoadingSkeleton";
import EmptyState from "./common/EmptyState";
import ImageModal from "./common/ImageModal";

const ROVER_METADATA = {
  curiosity: {
    landingDate: "August 6, 2012",
    launchDate: "November 26, 2011",
    status: "Active",
    missionName: "Mars Science Laboratory (MSL)",
    totalPhotos: "600,000+"
  },
  opportunity: {
    landingDate: "January 25, 2004",
    launchDate: "July 7, 2003",
    status: "Completed (2018)",
    missionName: "Mars Exploration Rover - B (MER-B)",
    totalPhotos: "228,000+"
  },
  spirit: {
    landingDate: "January 4, 2004",
    launchDate: "June 10, 2003",
    status: "Completed (2010)",
    missionName: "Mars Exploration Rover - A (MER-A)",
    totalPhotos: "124,000+"
  }
};

const MarsRoverViewer = ({ date, refreshKey }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rover, setRover] = useState("Curiosity");
  const [camera, setCamera] = useState("ALL");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [actualDate, setActualDate] = useState("");

  const info = ROVER_METADATA[rover.toLowerCase()] || ROVER_METADATA.curiosity;

  const fetchPhotos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMarsPhotos(date, rover, camera);
      setPhotos(data?.photos || []);
      setActualDate(data?.actualDate || "");
    } catch (err) {
      console.error("Failed to fetch Mars photos", err);
      setPhotos([]);
      setActualDate("");
    } finally {
      setLoading(false);
    }
  }, [date, rover, camera]);

  useEffect(() => {
    if (date) {
      fetchPhotos();
    }
  }, [fetchPhotos, refreshKey, date]);

  const camerasList = [
    { value: "ALL", label: "All Cameras" },
    { value: "FHAZ", label: "Front Hazard Avoidance (FHAZ)" },
    { value: "RHAZ", label: "Rear Hazard Avoidance (RHAZ)" },
    { value: "MAST", label: "Mast Camera (MAST) - Curiosity only" },
    { value: "CHEMCAM", label: "Chemistry & Camera (CHEMCAM) - Curiosity only" },
    { value: "MAHLI", label: "Mars Hand Lens Imager (MAHLI) - Curiosity only" },
    { value: "MARDI", label: "Mars Descent Imager (MARDI) - Curiosity only" },
    { value: "NAVCAM", label: "Navigation Camera (NAVCAM)" },
    { value: "PANCAM", label: "Panoramic Camera (PANCAM) - Spirit/Opportunity" },
    { value: "MINITES", label: "Thermal Emission Spectrometer (MINITES) - Spirit/Opportunity" },
  ];

  return (
    <div className="glass-panel" style={styles.container}>
      {/* Selector Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.selectorItem}>
          <label style={styles.label}>Select Mars Rover</label>
          <select
            value={rover}
            onChange={(e) => {
              setRover(e.target.value);
              setCamera("ALL"); // Reset camera on rover change to avoid invalid combinations
            }}
            style={styles.select}
          >
            <option value="Curiosity">Curiosity</option>
            <option value="Opportunity">Opportunity</option>
            <option value="Spirit">Spirit</option>
          </select>
        </div>

        <div style={styles.selectorItem}>
          <label style={styles.label}>Filter by Camera</label>
          <select
            value={camera}
            onChange={(e) => setCamera(e.target.value)}
            style={styles.select}
          >
            {camerasList.map((cam) => (
              <option key={cam.value} value={cam.value}>
                {cam.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {actualDate && actualDate !== date && (
        <div style={{ marginBottom: "1rem", color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: "600" }}>
          🚀 Displaying the latest available rover imagery captured on {actualDate}.
        </div>
      )}

      {/* Rover Mission Metadata Card */}
      <div style={styles.metadataCard}>
        <h4 style={styles.metadataTitle}>🚀 {info.missionName}</h4>
        <div style={styles.metadataGrid}>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Rover Name</span>
            <span style={styles.metaValue}>{rover}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Status</span>
            <span style={{ ...styles.metaValue, color: info.status.toLowerCase().includes("active") ? "#10b981" : "#94a3b8" }}>
              {info.status}
            </span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Launch Date</span>
            <span style={styles.metaValue}>{info.launchDate}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Landing Date</span>
            <span style={styles.metaValue}>{info.landingDate}</span>
          </div>
          <div style={styles.metaItem}>
            <span style={styles.metaLabel}>Total Photos</span>
            <span style={styles.metaValue}>{info.totalPhotos}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: "2rem 0" }}>
          <LoadingSkeleton type="card" count={3} message="Downloading Rover Images..." />
        </div>
      ) : photos.length === 0 ? (
        <EmptyState
          message="No Rover Photos Found"
          icon="🚗"
          subtext="No photos recorded for this date. Try another rover, camera, or date."
        />
      ) : (
        <div style={styles.grid}>
          {photos.map((photo, i) => (
            <div
              className="media-card glass-panel"
              key={i}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.img_src}
                alt={`Mars Rover-${i}`}
                className="media-card-image"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1000";
                }}
              />
              <div className="media-card-body">
                <div>
                  <h4 className="media-card-title">{photo.rover.name} - Photo #{photo.id}</h4>
                  <p className="media-card-desc">
                    Captured by {photo.rover.name} using its {photo.camera.full_name || photo.camera.name} on Sol {photo.sol} (Earth date: {photo.earth_date}).
                  </p>
                </div>
                <div className="media-card-meta">
                  <span>📷 {photo.camera.name}</span>
                  <span>Sol {photo.sol}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPhoto && (
        <ImageModal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          imageUrl={selectedPhoto.img_src}
          title={`${selectedPhoto.rover.name} Rover - Photo #${selectedPhoto.id}`}
          description={`Captured by ${selectedPhoto.rover.name} using its ${selectedPhoto.camera.full_name || selectedPhoto.camera.name} on Sol ${selectedPhoto.sol} (Earth date: ${selectedPhoto.earth_date}).`}
          metadata={{
            "Rover Name": selectedPhoto.rover.name,
            "Rover Status": selectedPhoto.rover.status,
            "Camera": `${selectedPhoto.camera.full_name} (${selectedPhoto.camera.name})`,
            "Earth Date": selectedPhoto.earth_date,
            "Sol (Martian Day)": selectedPhoto.sol,
            "Launch Date": selectedPhoto.rover.launch_date,
            "Landing Date": selectedPhoto.rover.landing_date,
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
  toolbar: {
    display: "flex",
    gap: "1.5rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "1.25rem",
  },
  selectorItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    flex: "1 1 200px",
  },
  label: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "0.8rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  select: {
    width: "100%",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  metadataCard: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "1.25rem",
    marginBottom: "1.5rem",
  },
  metadataTitle: {
    fontSize: "1.05rem",
    fontWeight: "600",
    color: "#fff",
    margin: "0 0 1rem 0",
  },
  metadataGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "1.25rem",
  },
  metaItem: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  metaLabel: {
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.4)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  metaValue: {
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#fff",
  },
};

export default MarsRoverViewer;
