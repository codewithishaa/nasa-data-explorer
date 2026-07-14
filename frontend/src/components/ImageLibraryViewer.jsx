import React, { useState, useEffect, useCallback } from "react";
import { searchNASAImages } from "../services/nasaApi";
import VoiceSearch from "./VoiceSearch";
import LoadingSkeleton from "./common/LoadingSkeleton";
import ErrorState from "./common/ErrorState";
import ImageModal from "./common/ImageModal";

const ImageLibraryViewer = ({ externalQuery, onExternalQueryProcessed }) => {
  const [query, setQuery] = useState("apollo 11");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appendLoading, setAppendLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchImages = useCallback(async (searchQuery, pageNum = 1, append = false) => {
    if (!searchQuery || !searchQuery.trim()) return;
    if (append) {
      setAppendLoading(true);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const data = await searchNASAImages(searchQuery, pageNum);
      const dataArray = Array.isArray(data) ? data : [];
      
      if (append) {
        setImages((prev) => [...prev, ...dataArray]);
      } else {
        setImages(dataArray);
      }

      setPage(pageNum);

      if (dataArray.length === 0) {
        setHasMore(false);
        if (!append) {
          setError(`No images found in NASA registry for "${searchQuery}".`);
        }
      } else {
        setHasMore(dataArray.length >= 10);
      }
    } catch (err) {
      console.error("Failed to fetch images", err);
      setError("Unexpected error occurred while fetching NASA Image index.");
      if (!append) {
        setImages([]);
      }
    } finally {
      setLoading(false);
      setAppendLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages("apollo 11");
  }, [fetchImages]);

  // Listen to external search requests from the Hero Speech recognition
  useEffect(() => {
    if (externalQuery) {
      setQuery(externalQuery);
      fetchImages(externalQuery, 1, false);
      if (onExternalQueryProcessed) {
        onExternalQueryProcessed();
      }
    }
  }, [externalQuery, fetchImages, onExternalQueryProcessed]);

  const handleVoiceResult = (spokenText) => {
    setQuery(spokenText);
    fetchImages(spokenText, 1, false);
  };

  return (
    <div className="glass-panel" style={styles.container}>
      {/* Search Header Panel */}
      <div style={styles.searchPanel}>
        <div style={styles.inputWrapper}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchImages(query, 1, false)}
            placeholder="Search NASA archives (e.g., Kepler, Mars, Nebula)..."
            style={styles.searchInput}
          />
          <VoiceSearch onResult={handleVoiceResult} label="Voice" style={styles.voiceBtn} />
        </div>
        <button onClick={() => fetchImages(query, 1, false)} style={styles.searchBtn}>
          Query Archive
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "2rem 0" }}>
          <LoadingSkeleton type="card" count={3} message="Loading Image Library..." />
        </div>
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchImages(query, 1, false)} />
      ) : (
        <>
          <div style={styles.grid}>
            {images.map((img, i) => (
              <div
                className="media-card glass-panel"
                key={i}
                onClick={() => setSelectedImage(img)}
                style={styles.cardContainer}
              >
                <img
                  src={img.thumbnail}
                  alt={img.title}
                  className="media-card-image"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000";
                  }}
                />
                <div className="media-card-body" style={styles.cardBody}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <h4 className="media-card-title" style={styles.cardTitle}>{img.title}</h4>
                    <span style={styles.cardDate}>
                      📅 {img.date_created ? new Date(img.date_created).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : "Unknown Date"}
                    </span>
                    <p className="media-card-desc" style={styles.cardDesc}>
                      {img.description || "No archival notes provided for this observation."}
                    </p>
                  </div>
                  <div className="media-card-meta" style={{ marginTop: "0.5rem", marginBottom: "0.75rem" }}>
                    <span style={styles.badge}>{img.mediaType || "image"}</span>
                    <span style={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)" }}>
                      ID: {img.nasa_id ? img.nasa_id.slice(0, 12) : "N/A"}
                    </span>
                  </div>
                  <div style={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        const origUrl = img.thumbnail.replace(/~thumb\.(jpe?g|png|gif)/i, '~orig.$1');
                        window.open(origUrl, "_blank");
                      }}
                      className="btn-primary"
                      style={styles.actionBtn}
                    >
                      Open Full Image
                    </button>
                    <button
                      onClick={() => {
                        window.open(`https://images.nasa.gov/details/${img.nasa_id}`, "_blank");
                      }}
                      className="btn-primary"
                      style={{ ...styles.actionBtn, background: "rgba(255, 255, 255, 0.08)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "#fff" }}
                    >
                      Open NASA Page
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {appendLoading && (
            <div style={{ padding: "2rem 0" }}>
              <LoadingSkeleton type="card" count={3} />
            </div>
          )}

          {images.length > 0 && hasMore && !appendLoading && (
            <div style={styles.loadMoreContainer}>
              <button onClick={() => fetchImages(query, page + 1, true)} style={styles.loadMoreBtn}>
                Load More Results
              </button>
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage.thumbnail}
          title={selectedImage.title}
          description={selectedImage.description}
          metadata={{
            "NASA ID": selectedImage.nasa_id,
            "Observation Date": selectedImage.date_created 
              ? new Date(selectedImage.date_created).toLocaleDateString()
              : "N/A",
            "Media Type": "image",
            "NASA Asset URL": `https://images-api.nasa.gov/asset/${selectedImage.nasa_id}`,
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
  searchPanel: {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    paddingBottom: "1.25rem",
  },
  inputWrapper: {
    display: "flex",
    position: "relative",
    flexGrow: 1,
    minWidth: "280px",
  },
  searchInput: {
    width: "100%",
    paddingRight: "100px", // space for voice button
  },
  voiceBtn: {
    position: "absolute",
    right: "4px",
    top: "4px",
    bottom: "4px",
    padding: "0 12px",
    height: "calc(100% - 8px)",
    fontSize: "0.75rem",
  },
  searchBtn: {
    padding: "10px 24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
  },
  badge: {
    display: "inline-block",
    padding: "2px 6px",
    background: "rgba(139, 92, 246, 0.15)",
    border: "1px solid rgba(139, 92, 246, 0.25)",
    borderRadius: "4px",
    color: "#c084fc",
    fontSize: "0.68rem",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  cardContainer: {
    height: "auto",
    minHeight: "440px",
    display: "flex",
    flexDirection: "column",
  },
  cardBody: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    padding: "1rem",
  },
  cardTitle: {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#fff",
    margin: "0",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  cardDate: {
    fontSize: "0.75rem",
    color: "#818cf8",
    fontWeight: "500",
  },
  cardDesc: {
    fontSize: "0.8rem",
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: "1.4",
    display: "-webkit-box",
    WebkitLineClamp: "3",
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    margin: "0",
  },
  cardActions: {
    display: "flex",
    gap: "0.5rem",
    marginTop: "auto",
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    padding: "6px 10px",
    fontSize: "0.75rem",
    borderRadius: "6px",
    textAlign: "center",
    cursor: "pointer",
    boxShadow: "none",
    height: "auto",
  },
  loadMoreContainer: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2.5rem",
    marginBottom: "1rem",
    width: "100%",
  },
  loadMoreBtn: {
    padding: "12px 32px",
    fontSize: "0.95rem",
    background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  }
};

export default ImageLibraryViewer;

