const axios = require('axios');

exports.getEpicImages = async (req, res) => {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const { date } = req.query; // format: YYYY-MM-DD

  if (!date) {
    return res.status(400).json({ error: "Missing 'date' parameter" });
  }

  const cleanDate = date.split('T')[0];
  console.log(`\nIncoming EPIC request for date: ${cleanDate}`);

  let targetDate = new Date(cleanDate);
  let attempts = 0;
  let images = [];
  let actualDateStr = cleanDate;

  while (attempts < 10) {
    const formattedDate = targetDate.toISOString().split("T")[0];
    console.log(`Trying EPIC: ${formattedDate}`);

    try {
      const metadataUrl = `https://api.nasa.gov/EPIC/api/natural/date/${formattedDate}?api_key=${apiKey}`;
      const response = await axios.get(metadataUrl);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        images = response.data;
        actualDateStr = formattedDate;
        console.log(`Found ${images.length} images on ${formattedDate}`);
        break;
      } else {
        console.log("No data");
      }
    } catch (apiErr) {
      console.warn(`EPIC error on ${formattedDate}:`, apiErr.response?.status, apiErr.response?.data || apiErr.message);
      if (apiErr.response) {
        const status = apiErr.response.status;
        if (status === 429) {
          console.error("⚠️ NASA rate limit hit — stopping EPIC search loop");
          break;
        }
        if (status === 403 || status === 401) {
          console.error("❌ NASA API authentication failure: Invalid API Key");
          return res.status(403).json({ error: "Invalid NASA API key" });
        }
      }
    }

    targetDate.setDate(targetDate.getDate() - 1);
    attempts++;
  }

  const results = images.map((img) => {
    // Build dynamically from metadata.date
    const datePart = img.date.split(' ')[0]; // "YYYY-MM-DD"
    const [year, month, day] = datePart.split('-');
    const imageUrl = `https://api.nasa.gov/EPIC/archive/natural/${year}/${month}/${day}/png/${img.image}.png?api_key=${apiKey}`;

    return {
      caption: img.caption,
      imageUrl: imageUrl,
      identifier: img.identifier,
      date: img.date
    };
  });

  const responsePayload = {
    requestedDate: cleanDate,
    actualDate: images.length > 0 ? actualDateStr : null,
    images: results
  };

  console.log(`Returning ${results.length} images`);
  return res.json(responsePayload);
};
