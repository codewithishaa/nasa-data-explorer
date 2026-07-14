import React from "react";

const ErrorState = ({ message = "An error occurred while fetching space intelligence data.", onRetry }) => {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>📡</div>
      <h3 style={styles.title}>No Data Available</h3>
      <p style={styles.message}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={styles.button}>
          Re-initialize Request
        </button>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2.5rem 2rem",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    borderRadius: "16px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "2rem auto",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(12px)",
  },
  icon: {
    fontSize: "3.5rem",
    marginBottom: "1rem",
  },
  title: {
    color: "#fff",
    fontSize: "1.25rem",
    margin: "0 0 0.5rem 0",
    fontWeight: "600",
  },
  message: {
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: "0.9rem",
    margin: "0 0 1.5rem 0",
    lineHeight: "1.55",
  },
  button: {
    padding: "10px 24px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
    transition: "transform 0.2s",
  },
};

export default ErrorState;
