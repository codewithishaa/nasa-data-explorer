import React, { useEffect, useState } from "react";

const ImageModal = ({ isOpen, onClose, imageUrl, title, description, metadata = {} }) => {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setZoomed(false);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div style={styles.content}>
          <div style={{ ...styles.mediaContainer, overflow: "hidden" }}>
            <img 
              src={imageUrl} 
              alt={title} 
              style={{
                ...styles.image,
                cursor: zoomed ? "zoom-out" : "zoom-in",
                transform: zoomed ? "scale(1.5)" : "scale(1)",
                transition: "transform 0.3s ease",
              }} 
              onClick={() => setZoomed(!zoomed)}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000";
              }} 
            />
          </div>
          <div style={styles.detailsContainer}>
            <h3 style={styles.title}>{title}</h3>
            {Object.keys(metadata).length > 0 && (
              <div style={styles.metadataGrid}>
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key} style={styles.metaItem}>
                    <span style={styles.metaKey}>{key}:</span>
                    <span style={styles.metaValue}>{value || "N/A"}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={styles.scrollText}>
              <p style={styles.description}>{description || "No description provided."}</p>
            </div>
            <div style={styles.actions}>
              <a href={imageUrl} target="_blank" rel="noopener noreferrer" style={styles.linkButton}>
                Open Original Resolution
              </a>
              <button 
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = imageUrl;
                  link.setAttribute("download", `${title.replace(/\s+/g, "_")}.png`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }} 
                style={styles.downloadButton}
              >
                📥 Download Image
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(3, 3, 3, 0.9)",
    zIndex: 9999,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    backdropFilter: "blur(8px)",
  },
  modal: {
    backgroundColor: "#080d1a",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "16px",
    maxWidth: "1000px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "hidden",
    position: "relative",
    boxShadow: "0 24px 64px rgba(0, 0, 0, 0.8)",
  },
  closeButton: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "rgba(255, 255, 255, 0.08)",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    cursor: "pointer",
    fontSize: "1rem",
    zIndex: 10,
    transition: "background 0.2s",
  },
  content: {
    display: "grid",
    gridTemplateColumns: "1.2fr 0.8fr",
    height: "100%",
    maxHeight: "90vh",
    boxSizing: "border-box",
  },
  mediaContainer: {
    background: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: "100%",
    minHeight: "400px",
    maxHeight: "80vh",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    maxHeight: "80vh",
  },
  detailsContainer: {
    padding: "2rem 1.5rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    maxHeight: "80vh",
    boxSizing: "border-box",
    borderLeft: "1px solid rgba(255, 255, 255, 0.05)",
  },
  title: {
    color: "#fff",
    fontSize: "1.3rem",
    fontWeight: "700",
    margin: "0 0 1rem 0",
    lineHeight: "1.3",
  },
  metadataGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "0.5rem",
    marginBottom: "1rem",
    background: "rgba(255, 255, 255, 0.02)",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.04)",
  },
  metaItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "0.8rem",
  },
  metaKey: {
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "600",
  },
  metaValue: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  scrollText: {
    flexGrow: 1,
    overflowY: "auto",
    marginBottom: "1.25rem",
    paddingRight: "0.5rem",
  },
  description: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: "0.85rem",
    lineHeight: "1.5",
    margin: "0",
  },
  actions: {
    marginTop: "auto",
  },
  linkButton: {
    display: "block",
    textAlign: "center",
    padding: "12px",
    background: "linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)",
    borderRadius: "8px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "0.9rem",
    boxShadow: "0 4px 12px rgba(30, 136, 229, 0.3)",
    transition: "opacity 0.2s",
  },
  downloadButton: {
    display: "block",
    textAlign: "center",
    width: "100%",
    padding: "12px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "0.9rem",
    marginTop: "0.75rem",
    cursor: "pointer",
    boxShadow: "none",
    transition: "background 0.2s",
  },
};

// Add media queries via standard browser check in render loop or fallback styling
// Let's handle responsive breakdown by rendering styles depending on window width
export default ImageModal;
