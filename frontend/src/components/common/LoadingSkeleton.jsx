import React from "react";

const LoadingSkeleton = ({ type = "card", count = 1, message }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "metric":
        return (
          <div className="skeleton-wrapper skeleton-metric" style={styles.metric}>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "60%", height: "14px" }}></div>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "80%", height: "28px", margin: "8px 0" }}></div>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "40%", height: "12px" }}></div>
          </div>
        );
      case "text":
        return (
          <div className="skeleton-wrapper" style={styles.text}>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "90%", height: "16px" }}></div>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "100%", height: "14px", margin: "8px 0" }}></div>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "70%", height: "14px" }}></div>
          </div>
        );
      case "card":
      default:
        return (
          <div className="skeleton-wrapper skeleton-card" style={styles.card}>
            <div className="skeleton-circle" style={styles.circle}></div>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "70%", height: "18px", margin: "12px 0 6px" }}></div>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "50%", height: "14px", marginBottom: "12px" }}></div>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "90%", height: "12px", marginBottom: "6px" }}></div>
            <div className="skeleton-bar" style={{ ...styles.bar, width: "80%", height: "12px" }}></div>
          </div>
        );
    }
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
      {message && (
        <div style={{ color: "rgba(255, 255, 255, 0.55)", fontSize: "0.85rem", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "0.5rem" }}>
          📡 {message}
        </div>
      )}
      <div style={styles.container}>
        {Array.from({ length: count }).map((_, idx) => (
          <React.Fragment key={idx}>{renderSkeleton()}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    width: "100%",
    justifyContent: "center",
  },
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "1.5rem",
    width: "280px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
  },
  metric: {
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "1.25rem",
    flex: "1 1 200px",
    minWidth: "180px",
    boxShadow: "0 4px 20px 0 rgba(0, 0, 0, 0.15)",
  },
  text: {
    width: "100%",
    padding: "1rem",
    background: "rgba(255, 255, 255, 0.01)",
    borderRadius: "8px",
  },
  circle: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    animation: "pulse 1.5s infinite ease-in-out",
  },
  bar: {
    borderRadius: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    animation: "pulse 1.5s infinite ease-in-out",
  },
};

export default LoadingSkeleton;
