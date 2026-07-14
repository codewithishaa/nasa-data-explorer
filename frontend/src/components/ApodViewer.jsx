import React, { useEffect, useState } from "react";
import { fetchAPOD, generateApodSummary } from "../services/nasaApi";
import LoadingSkeleton from "./common/LoadingSkeleton";
import ErrorState from "./common/ErrorState";
import AISummaryCard from "./common/AISummaryCard";

const ApodViewer = ({ date, refreshKey }) => {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fetchAPODData = async () => {
    setLoading(true);
    setError("");
    setAiSummary("");
    setImgError(false);
    try {
      const data = await fetchAPOD(date);
      setApod(data);
    } catch (err) {
      console.error("Failed to fetch APOD:", err.message);
      setError("Failed to download Astronomy Picture of the Day.");
      setApod(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    if (!apod || !apod.explanation) return;
    setAiLoading(true);
    try {
      const data = await generateApodSummary(apod.explanation);
      setAiSummary(data.summary);
    } catch (err) {
      console.error("AI summary error:", err.message);
      // Fallback summary generation
      const sentences = apod.explanation
        .replace(/\s+/g, " ")
        .split(/(?<=[.!?])\s+/)
        .filter(s => s.length > 5);
      const fallback = sentences.slice(0, 2).join(" ");
      setAiSummary(fallback || "A beautiful visual capture of deep space structures.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      fetchAPODData();
    }
  }, [date, refreshKey]);

  if (loading) {
    return (
      <div className="glass-panel" style={styles.card}>
        <LoadingSkeleton type="card" count={1} message="Initializing NASA Telemetry..." />
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchAPODData} />;
  }

  return (
    <div className="glass-panel" style={styles.card}>
      {apod && (
        <div style={styles.grid}>
          {/* Left: Image/Video Preview */}
          <div style={styles.mediaContainer}>
            {imgError ? (
              <div style={styles.fallbackCard}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📷</div>
                <h4 style={{ color: "#fff" }}>Media Unavailable</h4>
                <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "0.85rem", marginTop: "4px" }}>
                  The source telemetry file is inaccessible.
                </p>
              </div>
            ) : apod.media_type === "video" ? (
              <iframe
                title={apod.title}
                src={apod.url}
                frameBorder="0"
                gesture="media"
                allow="encrypted-media"
                allowFullScreen
                style={styles.iframe}
              />
            ) : (
              <img
                src={apod.url}
                alt={apod.title}
                style={styles.image}
                onError={() => setImgError(true)}
              />
            )}
          </div>

          <div style={styles.infoContainer}>
            <div style={styles.header}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={styles.dateBadge}>📅 {apod.date}</span>
                  {apod.hdurl && (
                    <a href={apod.hdurl} target="_blank" rel="noopener noreferrer" style={styles.hdBadge}>
                      ⚡ HD Available
                    </a>
                  )}
                  {apod.copyright && (
                    <span style={styles.copyrightBadge}>© {apod.copyright.trim()}</span>
                  )}
                </div>
                <h3 style={styles.title}>{apod.title}</h3>
              </div>
            </div>

            <div style={styles.explanationWrapper}>
              <p style={styles.explanation}>{apod.explanation}</p>
            </div>

            <AISummaryCard
              summary={aiSummary}
              loading={aiLoading}
              onGenerate={handleGenerateSummary}
              placeholder="Requesting summary from astronomical AI engine..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    padding: "1.5rem",
    marginTop: "1.5rem",
    width: "100%",
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "2rem",
  },
  mediaContainer: {
    width: "100%",
    borderRadius: "16px",
    overflow: "hidden",
    background: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "380px",
    border: "1px solid rgba(255, 255, 255, 0.06)",
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5)",
  },
  image: {
    width: "100%",
    height: "100%",
    maxHeight: "550px",
    objectFit: "cover",
    borderRadius: "16px",
  },
  iframe: {
    width: "100%",
    height: "100%",
    minHeight: "380px",
    borderRadius: "16px",
    border: "none",
  },
  fallbackCard: {
    textAlign: "center",
    padding: "2rem",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
    paddingBottom: "1rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
    gap: "1rem",
  },
  dateBadge: {
    padding: "4px 10px",
    background: "rgba(99, 102, 241, 0.12)",
    border: "1px solid rgba(99, 102, 241, 0.25)",
    borderRadius: "20px",
    color: "#a5b4fc",
    fontSize: "0.72rem",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  hdBadge: {
    padding: "4px 10px",
    background: "rgba(16, 185, 129, 0.12)",
    border: "1px solid rgba(16, 185, 129, 0.25)",
    borderRadius: "20px",
    color: "#34d399",
    fontSize: "0.72rem",
    fontWeight: "600",
    textDecoration: "none",
    boxShadow: "0 0 8px rgba(16, 185, 129, 0.2)",
    transition: "transform 0.2s",
  },
  copyrightBadge: {
    padding: "4px 10px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    borderRadius: "20px",
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: "0.72rem",
    fontWeight: "500",
  },
  title: {
    color: "#fff",
    fontSize: "1.35rem",
    fontWeight: "700",
    lineHeight: "1.3",
    margin: "0",
  },
  pickerWrapper: {
    alignSelf: "flex-start",
  },
  dateInput: {
    padding: "8px 12px",
    fontSize: "0.85rem",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "6px",
    color: "#fff",
  },
  explanationWrapper: {
    maxHeight: "220px",
    overflowY: "auto",
    paddingRight: "0.5rem",
    flexGrow: 1,
  },
  explanation: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: "0.95rem",
    lineHeight: "1.65",
    margin: "0",
    letterSpacing: "0.2px",
  },
};

// Add responsive breakdown
const handleResponsiveStyles = () => {
  if (typeof window !== "undefined" && window.innerWidth <= 960) {
    styles.grid.gridTemplateColumns = "1fr";
  }
};
if (typeof window !== "undefined") {
  window.addEventListener("resize", handleResponsiveStyles);
  handleResponsiveStyles();
}

export default ApodViewer;
