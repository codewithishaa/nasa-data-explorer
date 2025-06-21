const axios = require("axios");

const fetchImageLibrary = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  try {
    const response = await axios.get(`https://images-api.nasa.gov/search?q=${query}&media_type=image`);

    const items = response.data?.collection?.items;

    if (!Array.isArray(items)) {
      return res.status(500).json({ error: "Invalid response format from NASA API" });
    }

    const results = items
      .filter(item => item.data && item.data[0] && item.links && item.links[0])
      .map(item => ({
        title: item.data[0].title,
        description: item.data[0].description,
        imageUrl: item.links[0].href
      }));

    return res.json(results);
  } catch (error) {
    console.error("NASA Image API fetch error:", error.message);
    return res.status(500).json({ error: "Failed to fetch NASA images" });
  }
};

module.exports = { fetchImageLibrary };
