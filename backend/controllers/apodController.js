// hello
const axios = require('axios');
const generateAISummary = require('../utils/generateAISummary');

/*Defines an async controller function called getApod
Checks if the frontend sent a date in the query string like /api/apod?date=2025-06-21
If not provided, it defaults to today's date in YYYY-MM-DD format.*/
const getApod = async (req, res) => {
  const rawDate = req.query.date || new Date().toISOString().split('T')[0];
  const date = rawDate.split('T')[0];
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  //Makes a GET request to the NASA APOD API
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod`, {
      params: {
        api_key: apiKey,
        date,
      },
    });
    // Sends the APOD data (image, title, explanation, etc.) as a JSON response back to your React frontend.
    res.json(response.data);
  } catch (error) {
    console.error("APOD API error:", error.response?.status, error.response?.data || error.message);
    const status = error.response?.status || 500;
    const detail = error.response?.data?.error?.message || error.message || 'Failed to fetch APOD data';
    res.status(status === 429 ? 429 : 500).json({ error: 'Failed to fetch APOD data', detail, status });
  }
};

/* Controller to generate AI summary of the APOD explanation */
const postApodSummary = async (req, res) => {
  const { explanation } = req.body;
  if (!explanation) {
    return res.status(400).json({ error: "Missing explanation in request body" });
  }
  try {
    const summary = await generateAISummary(explanation);
    res.json({ summary });
  } catch (error) {
    console.error("APOD summary error:", error.message);
    res.status(500).json({ error: "Failed to generate AI summary" });
  }
};

//Exports the getApod and postApodSummary functions so they can be used in routes/apod.js
module.exports = { getApod, postApodSummary };

