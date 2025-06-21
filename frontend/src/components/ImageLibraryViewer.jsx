import React, { useState, useEffect } from "react";
import axios from "axios";

const ImageLibraryViewer = () => {
  const [query, setQuery] = useState("saturn");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/image?query=${query}`);
      const data = Array.isArray(res.data) ? res.data : [];
      if (!data.length) {
        setError("No results available.");
      }
      setImages(data);
    } catch (err) {
      console.error("Failed to fetch images", err);
      setError("Unexpected data format from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="chart-wrapper image-library">
      <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        🖼️ NASA Image Library Results for: <em>{query}</em>
      </h2>

      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          style={{
            padding: "10px",
            borderRadius: "8px",
            flexGrow: 1,
            fontSize: "1rem",
            border: "none",
          }}
        />
        <button onClick={fetchImages}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div className="image-grid">
          {images.map((img, i) => (
            <div className="image-card" key={i}>
              <img src={img.imageUrl} alt={img.title} />
              <h4>{img.title}</h4>
              <p>{img.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLibraryViewer;
