//Imports the axios library which is used to make HTTP requests 
const axios = require('axios');

/*Defines an async controller function called getApod
Checks if the frontend sent a date in the query string like /api/apod?date=2025-06-21
If not provided, it defaults to today's date in YYYY-MM-DD format.*/
const getApod = async (req, res) => {
  const date = req.query.date || new Date().toISOString().split('T')[0];
  //Makes a GET request to the NASA APOD API
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod`, {
      params: {
        api_key: process.env.NASA_API_KEY,
        date,
      },
    });
    // Sends the APOD data (image, title, explanation, etc.) as a JSON response back to your React frontend.
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch APOD data' });
  }
};
//Exports the getApod function so it can be used in routes/apod.js
module.exports = { getApod };

