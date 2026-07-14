const OpenAI = require("openai");
require("dotenv").config();

let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Generates an AI summary for text descriptions (like APOD explanation)
 * or metadata. If OpenAI API key is missing or calls fail, it falls back
 * to a clean sentence-extracted summary.
 */
async function generateAISummary(text, prompt = null) {
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt || `Summarize this text in 2 professional, engaging sentences for a space dashboard: ${text}`
          }
        ],
        max_tokens: 100,
      });
      const content = response.choices[0]?.message?.content?.trim();
      if (content) return content;
    } catch (err) {
      console.error("❌ OpenAI API Error, using fallback:", err.message);
    }
  }

  // Fallback: extract the first two sentences from the text, clean up, and return
  if (!text) return "A celestial phenomenon captured in deep space.";
  
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter(s => s.length > 5);
  
  if (sentences.length > 0) {
    const summary = sentences.slice(0, 2).join(" ");
    return summary.length > 200 ? summary.slice(0, 197) + "..." : summary;
  }
  
  return text.length > 150 ? text.slice(0, 147) + "..." : text;
}

module.exports = generateAISummary;
