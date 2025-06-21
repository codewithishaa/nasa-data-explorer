const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateAISummary(photo) {
  const prompt = `Describe this Mars rover photo briefly using its metadata:\n
  Camera: ${photo.camera.full_name}\n
  Rover: ${photo.rover.name}\n
  Sol: ${photo.sol}\n
  Earth Date: ${photo.earth_date}\n\n
  Return a short human-friendly summary.`;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    });

    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error("AI summary error:", err.message);
    return "A Mars rover image showing the Martian surface.";
  }
}

module.exports = generateAISummary;
