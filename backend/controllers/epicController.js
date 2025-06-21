const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const NASA_API_KEY = process.env.NASA_API_KEY;

exports.getEpicImages = async (req, res) => {
  try {
    const { date } = req.query; // format: YYYY-MM-DD
    const [year, month, day] = date.split('-');

    const metadataUrl = `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${NASA_API_KEY}`;
    const metaResponse = await axios.get(metadataUrl);
    const images = metaResponse.data;

    if (!images.length) {
      return res.json([]);
    }

    const baseImageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${year}/${month}/${day}/png`;

    const results = images.map((img) => ({
      caption: img.caption,
      imageUrl: `${baseImageUrl}/${img.image}.png`,
      date: img.date,
    }));

    res.json(results);
  } catch (err) {
    console.error('EPIC fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch EPIC images' });
  }
};
