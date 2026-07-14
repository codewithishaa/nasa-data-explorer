import React from "react";

const ChartCard = ({ title, description, children }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
        {description && <p style={styles.description}>{description}</p>}
      </div>
      <div style={styles.content}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "16px",
    padding: "1.5rem",
    width: "100%",
    boxShadow: "0 10px 40px 0 rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  title: {
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "600",
    margin: "0",
    letterSpacing: "0.2px",
  },
  description: {
    color: "rgba(255, 255, 255, 0.55)",
    fontSize: "0.8rem",
    margin: "0",
    lineHeight: "1.4",
  },
  content: {
    position: "relative",
    width: "100%",
    minHeight: "220px",
    maxHeight: "320px",
  },
};

export default ChartCard;
