const axios = require("axios");
require("dotenv").config();

const getNeoData = async (req, res) => {
  const { start_date } = req.query;

  if (!start_date) {
    return res.status(400).json({ error: "Missing start_date parameter" });
  }

  const cleanDate = start_date.split('T')[0];
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  try {
    const response = await axios.get(
      `https://api.nasa.gov/neo/rest/v1/feed?start_date=${cleanDate}&end_date=${cleanDate}&api_key=${apiKey}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("NEO API error:", error.response?.status, error.response?.data || error.message);
    const status = error.response?.status || 500;
    const detail = error.response?.data?.error?.message || error.message || 'Failed to fetch NEO data';
    res.status(status === 429 ? 429 : 500).json({ error: "Failed to fetch NEO data", detail, status });
  }
};

module.exports = { getNeoData };
