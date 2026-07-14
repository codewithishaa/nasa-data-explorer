import React from "react";

const EmptyState = ({ message = "No records found matching current constraints.", icon = "📡", subtext = "Try modifying your parameters, dates, or search query." }) => {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>{icon}</div>
      <h3 style={styles.title}>{message}</h3>
      <p style={styles.subtext}>{subtext}</p>
    </div>
  );
};

const styles = {
  container: {
    padding: "3.5rem 2rem",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px dashed rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    textAlign: "center",
    maxWidth: "550px",
    margin: "2rem auto",
    backdropFilter: "blur(8px)",
  },
  icon: {
    fontSize: "3.5rem",
    marginBottom: "1.2rem",
    opacity: 0.8,
  },
  title: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: "1.2rem",
    margin: "0 0 0.5rem 0",
    fontWeight: "500",
  },
  subtext: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "0.9rem",
    margin: "0",
    lineHeight: "1.4",
  },
};

export default EmptyState;
