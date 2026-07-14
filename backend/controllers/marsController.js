const axios = require("axios");

const fetchMarsPhotos = async (req, res) => {
  const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
  const { date, rover = "curiosity", camera } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Missing 'date' parameter" });
  }

  const cleanDate = date.split('T')[0];
  console.log(`\n--- Mars Rover API Request ---`);
  console.log(`Requested date: ${cleanDate}`);
  console.log(`Rover: ${rover}`);
  console.log(`Camera: ${camera || "ALL"}`);

  let targetDate = new Date(cleanDate);

  // Optimization: Bound search dates to rover's operational mission windows to prevent wasting requests (resulting in 429/404s)
  const roverLower = rover.toLowerCase();
  let maxDate = new Date();
  let minDate = new Date("2000-01-01");

  if (roverLower === "opportunity") {
    maxDate = new Date("2018-06-10");
    minDate = new Date("2004-01-25");
  } else if (roverLower === "spirit") {
    maxDate = new Date("2010-03-22");
    minDate = new Date("2004-01-04");
  } else if (roverLower === "curiosity") {
    minDate = new Date("2012-08-06");
  }

  if (targetDate > maxDate) {
    targetDate = maxDate;
  } else if (targetDate < minDate) {
    targetDate = minDate;
  }

  let attempts = 0;
  let photos = [];
  let actualDateStr = targetDate.toISOString().split("T")[0];

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  while (attempts < 100) {
    // Stop searching if we go before landing date
    if (targetDate < minDate) {
      console.log(`Reached rover landing date bounds (${minDate.toISOString().split("T")[0]}). Stopping search.`);
      break;
    }

    const formattedDate = targetDate.toISOString().split("T")[0];
    console.log(`Every date searched: ${formattedDate}`);

    try {
      await delay(120); // 120ms delay to respect NASA's rate limit burst protection
      const params = {
        earth_date: formattedDate,
        api_key: apiKey,
      };
      if (camera && camera !== "ALL") {
        params.camera = camera;
      }

      const response = await axios.get(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover.toLowerCase()}/photos`,
        { params }
      );

      if (response.data && Array.isArray(response.data.photos) && response.data.photos.length > 0) {
        photos = response.data.photos;
        actualDateStr = formattedDate;
        console.log(`Number of photos found: ${photos.length}`);
        break;
      } else {
        console.log(`Number of photos found: 0`);
      }
    } catch (apiErr) {
      console.warn(`Mars error on ${formattedDate}:`, apiErr.response?.status, apiErr.response?.data || apiErr.message);
      if (apiErr.response) {
        const status = apiErr.response.status;
        if (status === 429) {
          console.error("⚠️ NASA rate limit hit — stopping Mars search loop");
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

  const responsePayload = {
    requestedDate: cleanDate,
    actualDate: photos.length > 0 ? actualDateStr : null,
    photos: photos
  };

  console.log(`Final returned date: ${photos.length > 0 ? actualDateStr : "N/A"}`);
  console.log(`-------------------------------\n`);
  return res.json(responsePayload);
};

module.exports = { fetchMarsPhotos };
