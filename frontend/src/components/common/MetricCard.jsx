import React from "react";

const MetricCard = ({ title, value, icon, subtext, color = "#00BFFF" }) => {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={styles.header}>
        <span style={styles.title}>{title}</span>
        <span style={{ ...styles.icon, color }}>{icon}</span>
      </div>
      <div style={styles.content}>
        <div style={styles.value}>{value}</div>
        {subtext && <div style={styles.subtext}>{subtext}</div>}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    padding: "1.25rem",
    flex: "1 1 200px",
    minWidth: "180px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(12px)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.75rem",
  },
  title: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.85rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  icon: {
    fontSize: "1.25rem",
  },
  content: {
    display: "flex",
    flexDirection: "column",
  },
  value: {
    color: "#fff",
    fontSize: "1.65rem",
    fontWeight: "700",
    wordBreak: "break-all",
    lineHeight: "1.2",
  },
  subtext: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "0.75rem",
    marginTop: "0.35rem",
  },
};

export default MetricCard;
