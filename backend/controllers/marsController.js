// backend/controllers/marsController.js
const axios = require("axios");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const fetchMarsPhotos = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Missing 'date' parameter" });
  }

  try {
    const nasaRes = await axios.get(
      `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos`,
      {
        params: {
          earth_date: date,
          api_key: process.env.NASA_API_KEY,
        },
      }
    );

    const photos = nasaRes.data.photos.slice(0, 3);

    const enrichedPhotos = await Promise.all(
      photos.map(async (photo) => {
        try {
          const summary = await generateSummary(photo.img_src);
          return { ...photo, ai_summary: summary };
        } catch (err) {
          console.error("❌ OpenAI error for photo:", err.response?.data || err.message || err);
          return {
            ...photo,
            ai_summary: "🔒 AI summary is disabled (quota exceeded or model error)",
          };
        }
      })
    );

    res.json(enrichedPhotos);
  } catch (error) {
    console.error("❌ Mars photos error:", error.message);
    res.status(500).json({ error: "Failed to fetch Mars Rover photos" });
  }
};

const generateSummary = async (imageUrl) => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o", // ✅ Current supported model with image support
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe this Mars Rover photo in 1–2 lines in a human-readable way.",
          },
          {
            type: "image_url",
            image_url: { url: imageUrl },
          },
        ],
      },
    ],
    max_tokens: 60,
  });

  return response.choices[0]?.message?.content || "No summary generated.";
};

module.exports = { fetchMarsPhotos };
