const axios = require("axios");
require("dotenv").config();

const getNeoData = async (req, res) => {
  const { start_date } = req.query;

  if (!start_date) {
    return res.status(400).json({ error: "Missing start_date parameter" });
  }

  try {
    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start_date}&end_date=${start_date}&api_key=${process.env.NASA_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Neo API error:", error.message);
    res.status(500).json({ error: "Failed to fetch NEO data" });
  }
};

module.exports = { getNeoData };
