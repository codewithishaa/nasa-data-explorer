import React from "react";

const SectionHeader = ({ title, subtitle, badge, action }) => {
  return (
    <div style={styles.container}>
      <div style={styles.textContainer}>
        {badge && <span style={styles.badge}>{badge}</span>}
        <h2 style={styles.title}>{title}</h2>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div style={styles.actionContainer}>{action}</div>}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    flexWrap: "wrap",
    gap: "1rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
    paddingBottom: "1rem",
    margin: "3rem 0 2rem 0",
    width: "100%",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    alignItems: "flex-start",
  },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    background: "rgba(99, 102, 241, 0.15)",
    border: "1px solid rgba(99, 102, 241, 0.3)",
    borderRadius: "20px",
    color: "#a5b4fc",
    fontSize: "0.7rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "4px",
  },
  title: {
    color: "#fff",
    fontSize: "1.75rem",
    fontWeight: "700",
    margin: "0",
    background: "linear-gradient(120deg, #fff 40%, rgba(255, 255, 255, 0.7) 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: "0.9rem",
    margin: "0",
    maxWidth: "600px",
    lineHeight: "1.4",
  },
  actionContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
};

export default SectionHeader;
