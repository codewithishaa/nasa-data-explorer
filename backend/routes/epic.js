const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const NASA_API_KEY = process.env.NASA_API_KEY;

router.get('/', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "Date is required" });

  try {
    const response = await axios.get(`https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${NASA_API_KEY}`);
    const data = response.data;

    const baseUrl = "https://epic.gsfc.nasa.gov/archive/natural";
    const images = data.map(img => {
      const d = date.split('-');
      const imageUrl = `${baseUrl}/${d[0]}/${d[1]}/${d[2]}/png/${img.image}.png`;
      return {
        image: imageUrl,
        caption: img.caption,
        time: img.date,
      };
    });

    res.json(images);
  } catch (err) {
    console.error("EPIC fetch error", err.message);
    res.status(500).json({ error: "Failed to fetch EPIC images" });
  }
});

module.exports = router;
