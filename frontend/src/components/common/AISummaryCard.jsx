import React from "react";

const AISummaryCard = ({ summary, loading, onGenerate, placeholder = "Requesting telemetry compilation..." }) => {
  // Parse summary into sections
  let mainSummary = "";
  let insights = [];
  let scientificImportance = "";

  if (summary) {
    const sentences = summary.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) {
      mainSummary = sentences.join(" ");
      insights = ["Captures rare spatial phenomena.", "Telemetry reflects precise cosmic positioning."];
      scientificImportance = "Provides visual baseline telemetry for astrophysical research.";
    } else {
      mainSummary = sentences.slice(0, 2).join(" ");
      insights = sentences.slice(2, -1);
      if (insights.length === 0) {
        insights = ["Phenomenon exhibits distinct structural boundaries."];
      }
      scientificImportance = sentences[sentences.length - 1];
    }
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <div style={styles.avatar}>🤖</div>
          <div>
            <span style={styles.title}>AI Scientific Summary</span>
            <span style={styles.modelBadge}>GPT-4o</span>
          </div>
        </div>
        {!summary && !loading && onGenerate && (
          <button onClick={onGenerate} style={styles.button}>
            Generate AI Insights
          </button>
        )}
      </div>
      <p style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.82rem", margin: "-0.5rem 0 1.25rem 0", lineHeight: "1.4" }}>
        An AI-generated scientific summary that simplifies NASA's official explanation into concise, easy-to-understand insights while preserving the scientific context.
      </p>

      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <span style={styles.spinner}>⚙️</span>
            <span style={styles.loadingText}>Synthesizing cosmic insights...</span>
          </div>
        ) : summary ? (
          <div style={styles.insightsWrapper}>
            {/* Section 1: AI Generated Summary */}
            <div style={styles.section}>
              <h5 style={styles.sectionHeading}>🤖 AI Generated Summary</h5>
              <p style={styles.bodyText}>{mainSummary}</p>
            </div>

            {/* Section 2: Key Insights */}
            <div style={styles.section}>
              <h5 style={styles.sectionHeading}>💡 Key Insights</h5>
              <ul style={styles.bulletList}>
                {insights.map((item, idx) => (
                  <li key={idx} style={styles.bulletItem}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Section 3: Scientific Importance */}
            <div style={styles.section}>
              <h5 style={styles.sectionHeading}>🔬 Scientific Importance</h5>
              <p style={styles.bodyText}>{scientificImportance}</p>
            </div>
          </div>
        ) : (
          <p style={styles.placeholderText}>{placeholder}</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "rgba(99, 102, 241, 0.03)",
    border: "1px solid rgba(99, 102, 241, 0.15)",
    borderRadius: "16px",
    padding: "1.5rem",
    marginTop: "1.5rem",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(12px)",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    flexWrap: "wrap",
    gap: "0.75rem",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "0.75rem",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.2rem",
    boxShadow: "0 0 10px rgba(99, 102, 241, 0.4)",
  },
  title: {
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: "600",
    display: "block",
  },
  modelBadge: {
    fontSize: "0.7rem",
    color: "rgba(255, 255, 255, 0.4)",
    background: "rgba(255, 255, 255, 0.05)",
    padding: "1px 6px",
    borderRadius: "4px",
    marginLeft: "4px",
  },
  button: {
    padding: "8px 16px",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
    transition: "transform 0.1s, opacity 0.2s",
  },
  content: {
    minHeight: "40px",
  },
  insightsWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },
  sectionHeading: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#818cf8",
    margin: "0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  bodyText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.9rem",
    margin: "0",
    lineHeight: "1.5",
  },
  bulletList: {
    listStyleType: "square",
    paddingLeft: "1.2rem",
    margin: "0",
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
  },
  bulletItem: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "0.9rem",
    lineHeight: "1.4",
  },
  placeholderText: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: "0.85rem",
    margin: "0",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "rgba(255, 255, 255, 0.6)",
    padding: "0.5rem 0",
  },
  loadingText: {
    fontSize: "0.85rem",
  },
  spinner: {
    display: "inline-block",
    animation: "spin 2s linear infinite",
    fontSize: "1.1rem",
  },
};

export default AISummaryCard;
