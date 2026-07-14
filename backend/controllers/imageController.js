const axios = require("axios");

const fetchImageLibrary = async (req, res) => {
  const { query, page = 1 } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing query parameter" });
  }

  try {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page=${page}`;
    const response = await axios.get(url);

    const items = response.data?.collection?.items;

    if (!Array.isArray(items)) {
      return res.status(500).json({ error: "Invalid response format from NASA API" });
    }

    const results = items
      .filter(item => item.data && item.data[0] && item.links && item.links[0])
      .map(item => ({
        title: item.data[0].title,
        description: item.data[0].description,
        thumbnail: item.links[0].href,
        nasa_id: item.data[0].nasa_id,
        date_created: item.data[0].date_created
      }));

    return res.json(results);
  } catch (error) {
    console.error("NASA Image API fetch error:", error.message);
    return res.status(500).json({ error: "Failed to fetch NASA images" });
  }
};

module.exports = { fetchImageLibrary };
